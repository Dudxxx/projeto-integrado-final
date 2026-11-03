export type UserLevel = 'USER' | 'ADMIN';
export interface User { id:number; nome:string; email:string; cpf:string; nivel:UserLevel; createdAt:string; }
export interface AuthResponse { success:boolean; token:string; user:User; }
export interface Service { id:number; nome:string; descricao:string|null; preco:number; duracaoMinutos:number; ativo:boolean; }
export interface Barber { id:number; nome:string; descricao:string|null; ativo:boolean; }
export type SlotStatus='DISPONIVEL'|'BLOQUEADO'|'RESERVADO';
export interface TimeSlot { id:number; data:string; hora:string; barbeiroId:number; situacao:SlotStatus; }
export interface AvailableSlot extends TimeSlot { barbeiroNome:string; }
export type AppointmentStatus='CONFIRMADO'|'CANCELADO'|'CONCLUIDO';
export interface Appointment { id:number; usuarioId:number; servicoId:number; horarioId:number; servico:string; preco:number; data:string; hora:string; barbeiro:string; situacao:AppointmentStatus; observacoes:string|null; }
export interface PageResult<T> { data:T[]; page:number; pageSize:number; total:number; totalPages:number; }
export interface ApiResponse<T> { success:boolean; data:T; message?:string; }
export interface ApiError { success:false; message:string; code:string; }
export interface ServicePayload { nome:string; descricao:string; preco:number; duracaoMinutos:number; ativo:boolean; }
export interface BarberPayload { nome:string; bio:string; ativo:boolean; }
export interface SlotPayload { data:string; hora:string; barbeiroId:number; status:SlotStatus; }
export interface AppointmentPayload { servicoId:number; horarioId:number; observacoes:string; status?:AppointmentStatus; }
