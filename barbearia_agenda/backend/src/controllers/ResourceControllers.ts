import type { Request, Response } from 'express';
import { ServiceCatalogService, BarberCatalogService, TimeSlotService } from '../services/CrudServices.js';
import { AppointmentService } from '../services/AppointmentService.js';

const services=new ServiceCatalogService(); const barbers=new BarberCatalogService(); const slots=new TimeSlotService(); const appointments=new AppointmentService();
const num=(v:unknown, fallback=0)=>{const n=Number(v);return Number.isFinite(n)?n:fallback;};

export const listServices=async(req:Request,res:Response)=>res.json({success:true,...await services.list(num(req.query.page,1),num(req.query.pageSize,10),String(req.query.search??''))});
export const getService=async(req:Request,res:Response)=>res.json({success:true,data:await services.get(num(req.params.id))});
export const createService=async(req:Request,res:Response)=>res.status(201).json({success:true,data:await services.create({nome:String(req.body.nome??''),descricao:req.body.descricao==null?null:String(req.body.descricao),preco:num(req.body.preco),duracaoMinutos:num(req.body.duracaoMinutos),ativo:Boolean(req.body.ativo)}),message:'Serviço cadastrado.'});
export const updateService=async(req:Request,res:Response)=>res.json({success:true,data:await services.update(num(req.params.id),{nome:String(req.body.nome??''),descricao:req.body.descricao==null?null:String(req.body.descricao),preco:num(req.body.preco),duracaoMinutos:num(req.body.duracaoMinutos),ativo:Boolean(req.body.ativo)}),message:'Serviço atualizado.'});
export const deleteService=async(req:Request,res:Response)=>{await services.delete(num(req.params.id));res.json({success:true,message:'Serviço excluído.'});};

export const listBarbers=async(req:Request,res:Response)=>res.json({success:true,...await barbers.list(num(req.query.page,1),num(req.query.pageSize,10),String(req.query.search??''))});
export const getBarber=async(req:Request,res:Response)=>res.json({success:true,data:await barbers.get(num(req.params.id))});
export const createBarber=async(req:Request,res:Response)=>res.status(201).json({success:true,data:await barbers.create({nome:String(req.body.nome??''),bio:req.body.bio==null?null:String(req.body.bio),ativo:Boolean(req.body.ativo)}),message:'Barbeiro cadastrado.'});
export const updateBarber=async(req:Request,res:Response)=>res.json({success:true,data:await barbers.update(num(req.params.id),{nome:String(req.body.nome??''),bio:req.body.bio==null?null:String(req.body.bio),ativo:Boolean(req.body.ativo)}),message:'Barbeiro atualizado.'});
export const deleteBarber=async(req:Request,res:Response)=>{await barbers.delete(num(req.params.id));res.json({success:true,message:'Barbeiro excluído.'});};

export const listSlots=async(req:Request,res:Response)=>res.json({success:true,...await slots.list(num(req.query.page,1),num(req.query.pageSize,10),String(req.query.search??''))});
export const availableSlots=async(req:Request,res:Response)=>res.json({success:true,data:await slots.available(req.query.date?String(req.query.date):undefined)});
export const getSlot=async(req:Request,res:Response)=>res.json({success:true,data:await slots.get(num(req.params.id))});
export const createSlot=async(req:Request,res:Response)=>res.status(201).json({success:true,data:await slots.create({data:String(req.body.data??''),hora:String(req.body.hora??''),barbeiroId:num(req.body.barbeiroId),status:req.body.status}),message:'Horário cadastrado.'});
export const updateSlot=async(req:Request,res:Response)=>res.json({success:true,data:await slots.update(num(req.params.id),{data:String(req.body.data??''),hora:String(req.body.hora??''),barbeiroId:num(req.body.barbeiroId),status:req.body.status}),message:'Horário atualizado.'});
export const deleteSlot=async(req:Request,res:Response)=>{await slots.delete(num(req.params.id));res.json({success:true,message:'Horário excluído.'});};

export const listAppointments=async(req:Request,res:Response)=>res.json({success:true,...await appointments.list(req.user!.id,req.user!.nivel==='ADMIN',num(req.query.page,1),num(req.query.pageSize,10),String(req.query.search??''))});
export const getAppointment=async(req:Request,res:Response)=>res.json({success:true,data:await appointments.get(num(req.params.id),req.user!.id,req.user!.nivel==='ADMIN')});
export const createAppointment=async(req:Request,res:Response)=>res.status(201).json({success:true,data:await appointments.create(req.user!.id,{servicoId:num(req.body.servicoId),horarioId:num(req.body.horarioId),observacoes:req.body.observacoes==null?null:String(req.body.observacoes)}),message:'Agendamento realizado com sucesso.'});
export const updateAppointment=async(req:Request,res:Response)=>res.json({success:true,data:await appointments.update(num(req.params.id),req.user!.id,req.user!.nivel==='ADMIN',{servicoId:num(req.body.servicoId),horarioId:num(req.body.horarioId),status:req.body.status,observacoes:req.body.observacoes==null?null:String(req.body.observacoes)}),message:'Agendamento atualizado.'});
export const deleteAppointment=async(req:Request,res:Response)=>{await appointments.delete(num(req.params.id),req.user!.id,req.user!.nivel==='ADMIN');res.json({success:true,message:'Agendamento cancelado e horário liberado.'});};
