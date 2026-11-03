import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';

const service = new AuthService();

export const register = async (req:Request,res:Response):Promise<void>=>{const result=await service.register(req.body);res.status(201).json({success:true,...result});};
export const login = async (req:Request,res:Response):Promise<void>=>{const result=await service.login(req.body);res.json({success:true,...result});};
export const me = async (req:Request,res:Response):Promise<void>=>{res.json({success:true,user:await service.me(req.user!.id)});};
export const updateMe = async (req:Request,res:Response):Promise<void>=>{res.json({success:true,user:await service.updateProfile(req.user!.id,req.body)});};
