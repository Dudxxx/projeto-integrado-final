import { pool } from '../config/database.js';
import { ConflictError, NotFoundError, ValidationError } from '../errors/AppError.js';
import { BarberRepository } from '../repositories/BarberRepository.js';
import { ServiceRepository } from '../repositories/ServiceRepository.js';
import { TimeSlotRepository } from '../repositories/TimeSlotRepository.js';
import { assertPositiveInteger, assertPositiveNumber, assertRequiredText } from '../utils/validators.js';

const pagination = (page:number,pageSize:number) => {
    const safePage=Number.isInteger(page)&&page>0?page:1; const safeSize=Number.isInteger(pageSize)&&pageSize>0&&pageSize<=100?pageSize:10; return {page:safePage,pageSize:safeSize,offset:(safePage-1)*safeSize};
};

export class ServiceCatalogService {
 public constructor(private readonly repo=new ServiceRepository()){}
 public list(page=1,pageSize=10,search=''){return this.repo.list(pagination(page,pageSize),search);}
 public async create(d:{nome:string;descricao:string|null;preco:number;duracaoMinutos:number;ativo:boolean}){const nome=assertRequiredText(d.nome,'nome',2); const preco=assertPositiveNumber(d.preco,'preço'); const dur=assertPositiveInteger(d.duracaoMinutos,'duração'); return this.repo.create({nome,descricao:d.descricao?.trim()||null,preco,duracao:dur,ativo:d.ativo});}
 public async get(id:number){const x=await this.repo.findById(id);if(!x)throw new NotFoundError('Serviço não encontrado.');return x;}
 public async update(id:number,d:{nome:string;descricao:string|null;preco:number;duracaoMinutos:number;ativo:boolean}){await this.get(id);return this.repo.update(id,{nome:assertRequiredText(d.nome,'nome',2),descricao:d.descricao?.trim()||null,preco:assertPositiveNumber(d.preco,'preço'),duracao:assertPositiveInteger(d.duracaoMinutos,'duração'),ativo:d.ativo});}
 public async delete(id:number){await this.get(id);try{await this.repo.delete(id);}catch{throw new ConflictError('Não é possível excluir um serviço utilizado em agendamentos.');}}
}

export class BarberCatalogService {
 public constructor(private readonly repo=new BarberRepository()){}
 public list(page=1,pageSize=10,search=''){return this.repo.list(pagination(page,pageSize),search);}
 public async create(d:{nome:string;bio:string|null;ativo:boolean}){return this.repo.create({nome:assertRequiredText(d.nome,'nome',2),bio:d.bio?.trim()||null,ativo:d.ativo});}
 public async get(id:number){const x=await this.repo.findById(id);if(!x)throw new NotFoundError('Barbeiro não encontrado.');return x;}
 public async update(id:number,d:{nome:string;bio:string|null;ativo:boolean}){await this.get(id);return this.repo.update(id,{nome:assertRequiredText(d.nome,'nome',2),bio:d.bio?.trim()||null,ativo:d.ativo});}
 public async delete(id:number){await this.get(id);try{await this.repo.delete(id);}catch{throw new ConflictError('Não é possível excluir barbeiro relacionado a horários.');}}
}

export class TimeSlotService {
 public constructor(private readonly repo=new TimeSlotRepository()){}
 public list(page=1,pageSize=10,search=''){return this.repo.list(pagination(page,pageSize),search);}
 public available(date?:string){return this.repo.available(date);}
 public async create(d:{data:string;hora:string;barbeiroId:number;status:'DISPONIVEL'|'BLOQUEADO'|'RESERVADO'}){if(!/^\d{4}-\d{2}-\d{2}$/.test(d.data)||!/^\d{2}:\d{2}$/.test(d.hora))throw new ValidationError('Data ou hora inválida.');if(d.data<new Date().toISOString().slice(0,10))throw new ValidationError('Não é possível criar horário no passado.');return this.repo.create({data:d.data,hora:`${d.hora}:00`,barbeiroId:assertPositiveInteger(d.barbeiroId,'barbeiro'),status:d.status});}
 public async get(id:number){const x=await this.repo.findById(id);if(!x)throw new NotFoundError('Horário não encontrado.');return x;}
 public async update(id:number,d:{data:string;hora:string;barbeiroId:number;status:'DISPONIVEL'|'BLOQUEADO'|'RESERVADO'}){await this.get(id);return this.repo.update(id,{data:d.data,hora:`${d.hora}:00`,barbeiroId:d.barbeiroId,status:d.status});}
 public async delete(id:number){await this.get(id);try{await this.repo.delete(id);}catch{throw new ConflictError('Não é possível excluir horário que possui agendamento.');}}
}
