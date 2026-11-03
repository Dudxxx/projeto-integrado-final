import { pool } from '../config/database.js';
import { ConflictError, NotFoundError, ValidationError } from '../errors/AppError.js';
import { AppointmentRepository } from '../repositories/AppointmentRepository.js';
import { ServiceRepository } from '../repositories/ServiceRepository.js';
import { TimeSlotRepository } from '../repositories/TimeSlotRepository.js';

const todaySaoPaulo = (): string => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());
const page = (page:number,pageSize:number)=>{const p=Number.isInteger(page)&&page>0?page:1;const s=Number.isInteger(pageSize)&&pageSize>0&&pageSize<=100?pageSize:10;return {page:p,pageSize:s,offset:(p-1)*s};};

export class AppointmentService {
 public constructor(private readonly appointments=new AppointmentRepository(),private readonly services=new ServiceRepository(),private readonly slots=new TimeSlotRepository()){}
 public list(userId:number,isAdmin:boolean,pageNumber=1,pageSizeNumber=10,search=''){const p=page(pageNumber,pageSizeNumber);return this.appointments.list(p,isAdmin?undefined:userId,search);}
 public async get(id:number,userId:number,isAdmin:boolean){const a=await this.appointments.findById(id);if(!a)throw new NotFoundError('Agendamento não encontrado.');if(!isAdmin&&a.usuarioId!==userId)throw new NotFoundError('Agendamento não encontrado.');return a;}
 public async create(userId:number,d:{servicoId:number;horarioId:number;observacoes:string|null}){
   const service=await this.services.findById(d.servicoId); if(!service||!service.ativo) throw new NotFoundError('Serviço não encontrado ou inativo.');
   const conn=await pool.getConnection();
   try{
     await conn.beginTransaction();
     const slot=await this.slots.lockById(conn,d.horarioId);
     if(!slot) throw new NotFoundError('Horário não encontrado.');
     if(slot.status!=='DISPONIVEL') throw new ConflictError('Esse horário já foi reservado ou bloqueado. Escolha outro.');
     if(slot.data_horario < todaySaoPaulo()) throw new ValidationError('Não é possível agendar em uma data passada.');
     const id=await this.appointments.create(conn,{usuarioId:userId,servicoId:service.id,horarioId:d.horarioId,status:'CONFIRMADO',observacoes:d.observacoes?.trim()||null,preco:service.preco,servico:service.nome});
     await this.slots.markStatus(conn,d.horarioId,'RESERVADO');
     await conn.commit();
     return this.get(id,userId,false);
   }catch(error){await conn.rollback();throw error;}finally{conn.release();}
 }
 public async update(id:number,userId:number,isAdmin:boolean,d:{servicoId:number;horarioId:number;status:'CONFIRMADO'|'CANCELADO'|'CONCLUIDO';observacoes:string|null}){
   const current=await this.get(id,userId,isAdmin);
   const service=await this.services.findById(d.servicoId); if(!service||!service.ativo) throw new NotFoundError('Serviço não encontrado ou inativo.');
   const conn=await pool.getConnection();
   try{
     await conn.beginTransaction();
     const oldSlot=await this.slots.lockById(conn,current.horarioId); const newSlot=await this.slots.lockById(conn,d.horarioId);
     if(!oldSlot||!newSlot) throw new NotFoundError('Horário não encontrado.');
     if(d.horarioId!==current.horarioId && newSlot.status!=='DISPONIVEL') throw new ConflictError('O novo horário já está ocupado.');
     if(d.status==='CANCELADO'){await this.slots.markStatus(conn,current.horarioId,'DISPONIVEL');}
     else {if(d.horarioId!==current.horarioId){await this.slots.markStatus(conn,current.horarioId,'DISPONIVEL');await this.slots.markStatus(conn,d.horarioId,'RESERVADO');}else await this.slots.markStatus(conn,current.horarioId,'RESERVADO');}
     await this.appointments.update(conn,id,{servicoId:service.id,horarioId:d.horarioId,status:d.status,observacoes:d.observacoes?.trim()||null,preco:service.preco,servico:service.nome});
     await conn.commit();
     return this.get(id,userId,isAdmin);
   }catch(error){await conn.rollback();throw error;}finally{conn.release();}
 }
 public async delete(id:number,userId:number,isAdmin:boolean){const current=await this.get(id,userId,isAdmin);const conn=await pool.getConnection();try{await conn.beginTransaction();await this.slots.markStatus(conn,current.horarioId,'DISPONIVEL');await this.appointments.delete(conn,id);await conn.commit();}catch(error){await conn.rollback();throw error;}finally{conn.release();}}
}
