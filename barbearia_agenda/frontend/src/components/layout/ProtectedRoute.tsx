import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
export function ProtectedRoute({children}:{children:ReactNode}){const {user,loading}=useAuth();if(loading)return <div className="center-page">Carregando...</div>;return user?<>{children}</>:<Navigate to="/login" replace/>;}
export function AdminRoute({children}:{children:ReactNode}){const {user,loading}=useAuth();if(loading)return <div className="center-page">Carregando...</div>;if(!user)return <Navigate to="/login" replace/>;return user.nivel==='ADMIN'?<>{children}</>:<Navigate to="/app" replace/>;}
