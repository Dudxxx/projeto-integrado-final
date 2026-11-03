import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthContextValue { user:User|null; loading:boolean; login:(email:string,senha:string)=>Promise<void>; register:(payload:{nome:string;email:string;senha:string;cpf:string})=>Promise<void>; logout:()=>void; refresh:()=>Promise<void>; }
const AuthContext=createContext<AuthContextValue|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true);
 const refresh=async()=>{try{const token=localStorage.getItem('barbearia_token');if(!token){setUser(null);return;}const result=await api.me();setUser(result.user);}catch{localStorage.removeItem('barbearia_token');setUser(null);}finally{setLoading(false);}};
 useEffect(()=>{void refresh();},[]);
 const value=useMemo<AuthContextValue>(()=>({user,loading,login:async(email,senha)=>{const r=await api.login(email,senha);localStorage.setItem('barbearia_token',r.token);setUser(r.user);},register:async(payload)=>{await api.register(payload);},logout:()=>{localStorage.removeItem('barbearia_token');setUser(null);},refresh}),[user,loading]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=():AuthContextValue=>{const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth deve ser usado dentro de AuthProvider');return ctx;};
