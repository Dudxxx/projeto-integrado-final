import type { ApiResponse, AuthResponse, Barber, BarberPayload, Appointment, AppointmentPayload, AvailableSlot, PageResult, Service, ServicePayload, SlotPayload, TimeSlot, User } from '../types';

export class ApiClient {
    private readonly base='/api';
    private token():string|null{return localStorage.getItem('barbearia_token');}
    private async request<T>(path:string, options:RequestInit={}):Promise<T>{
        const headers=new Headers(options.headers); headers.set('Content-Type','application/json'); const token=this.token(); if(token)headers.set('Authorization',`Bearer ${token}`);
        const response=await fetch(`${this.base}${path}`,{...options,headers});
        const data:unknown=await response.json().catch(()=>({}));
        if(!response.ok){const message=typeof data==='object'&&data!==null&&'message' in data&&typeof data.message==='string'?data.message:'Não foi possível concluir a operação.';throw new Error(message);}
        return data as T;
    }
    public login(email:string,senha:string){return this.request<AuthResponse>('/auth/login',{method:'POST',body:JSON.stringify({email,senha})});}
    public register(payload:{nome:string;email:string;senha:string;cpf:string}){return this.request<AuthResponse>('/auth/register',{method:'POST',body:JSON.stringify(payload)});}
    public me(){return this.request<ApiResponse<User>>('/auth/me');}
    public updateMe(payload:{nome:string;cpf:string;senha:string}){return this.request<ApiResponse<User>>('/users/me',{method:'PUT',body:JSON.stringify(payload)});}
    public listServices(page:number,search=''){return this.request<PageResult<Service>>(`/services?page=${page}&pageSize=8&search=${encodeURIComponent(search)}`);}
    public getService(id:number){return this.request<ApiResponse<Service>>(`/services/${id}`);}
    public createService(payload:ServicePayload){return this.request<ApiResponse<Service>>('/services',{method:'POST',body:JSON.stringify(payload)});}
    public updateService(id:number,payload:ServicePayload){return this.request<ApiResponse<Service>>(`/services/${id}`,{method:'PUT',body:JSON.stringify(payload)});}
    public deleteService(id:number){return this.request<ApiResponse<null>>(`/services/${id}`,{method:'DELETE'});}
    public listBarbers(page:number,search=''){return this.request<PageResult<Barber>>(`/barbers?page=${page}&pageSize=8&search=${encodeURIComponent(search)}`);}
    public getBarber(id:number){return this.request<ApiResponse<Barber>>(`/barbers/${id}`);}
    public createBarber(payload:BarberPayload){return this.request<ApiResponse<Barber>>('/barbers',{method:'POST',body:JSON.stringify(payload)});}
    public updateBarber(id:number,payload:BarberPayload){return this.request<ApiResponse<Barber>>(`/barbers/${id}`,{method:'PUT',body:JSON.stringify(payload)});}
    public deleteBarber(id:number){return this.request<ApiResponse<null>>(`/barbers/${id}`,{method:'DELETE'});}
    public listSlots(page:number,search=''){return this.request<PageResult<TimeSlot>>(`/time-slots?page=${page}&pageSize=8&search=${encodeURIComponent(search)}`);}
    public getSlot(id:number){return this.request<ApiResponse<TimeSlot>>(`/time-slots/${id}`);}
    public availableSlots(date?:string){return this.request<ApiResponse<AvailableSlot[]>>(`/time-slots/available${date?`?date=${encodeURIComponent(date)}`:''}`);}
    public createSlot(payload:SlotPayload){return this.request<ApiResponse<TimeSlot>>('/time-slots',{method:'POST',body:JSON.stringify(payload)});}
    public updateSlot(id:number,payload:SlotPayload){return this.request<ApiResponse<TimeSlot>>(`/time-slots/${id}`,{method:'PUT',body:JSON.stringify(payload)});}
    public deleteSlot(id:number){return this.request<ApiResponse<null>>(`/time-slots/${id}`,{method:'DELETE'});}
    public listAppointments(page:number,search=''){return this.request<PageResult<Appointment>>(`/appointments?page=${page}&pageSize=8&search=${encodeURIComponent(search)}`);}
    public getAppointment(id:number){return this.request<ApiResponse<Appointment>>(`/appointments/${id}`);}
    public createAppointment(payload:AppointmentPayload){return this.request<ApiResponse<Appointment>>('/appointments',{method:'POST',body:JSON.stringify(payload)});}
    public updateAppointment(id:number,payload:AppointmentPayload){return this.request<ApiResponse<Appointment>>(`/appointments/${id}`,{method:'PUT',body:JSON.stringify(payload)});}
    public deleteAppointment(id:number){return this.request<ApiResponse<null>>(`/appointments/${id}`,{method:'DELETE'});}
}
export const api=new ApiClient();
