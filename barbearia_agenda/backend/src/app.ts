import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { resourceRoutes } from './routes/resourceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'1mb'}));
app.get('/health',(_req,res)=>res.json({success:true,status:'online'}));
app.use('/api/auth',authRoutes);
app.use('/api/users',authRoutes);
app.use('/api',resourceRoutes);
app.use((_req,res)=>res.status(404).json({success:false,code:'NOT_FOUND',message:'Rota não encontrada.'}));
app.use(errorHandler);
