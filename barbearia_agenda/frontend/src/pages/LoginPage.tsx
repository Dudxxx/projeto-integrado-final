import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { EMAIL_REGEX } from '../utils/validators';
export function LoginPage(){const [email,setEmail]=useState('');const [senha,setSenha]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);const {login}=useAuth();const navigate=useNavigate();const submit=async(e:FormEvent)=>{e.preventDefault();setError('');if(!EMAIL_REGEX.test(email)){setError('Informe um e-mail válido.');return;}try{setLoading(true);await login(email,senha);navigate('/app');}catch(err){setError(err instanceof Error?err.message:'Falha ao entrar.');}finally{setLoading(false);}};return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand">BARBEARIA <strong>PRIME</strong></div><h1>Entrar</h1><p>Acesse seus agendamentos.</p>{error&&<div className="alert error">{error}</div>}<TextField label="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><TextField label="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required/><Button type="submit" disabled={loading}>{loading?'Entrando...':'Entrar'}</Button><div className="auth-footer">Ainda não tem conta? <Link to="/register">Cadastre-se</Link></div></form></div>}
