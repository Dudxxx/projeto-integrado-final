import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import * as c from '../controllers/ResourceControllers.js';

export const resourceRoutes=Router();
resourceRoutes.use(requireAuth);
resourceRoutes.get('/services',c.listServices); resourceRoutes.get('/services/:id',c.getService); resourceRoutes.post('/services',requireAdmin,c.createService); resourceRoutes.put('/services/:id',requireAdmin,c.updateService); resourceRoutes.delete('/services/:id',requireAdmin,c.deleteService);
resourceRoutes.get('/barbers',c.listBarbers); resourceRoutes.get('/barbers/:id',c.getBarber); resourceRoutes.post('/barbers',requireAdmin,c.createBarber); resourceRoutes.put('/barbers/:id',requireAdmin,c.updateBarber); resourceRoutes.delete('/barbers/:id',requireAdmin,c.deleteBarber);
resourceRoutes.get('/time-slots',c.listSlots); resourceRoutes.get('/time-slots/available',c.availableSlots); resourceRoutes.get('/time-slots/:id',c.getSlot); resourceRoutes.post('/time-slots',requireAdmin,c.createSlot); resourceRoutes.put('/time-slots/:id',requireAdmin,c.updateSlot); resourceRoutes.delete('/time-slots/:id',requireAdmin,c.deleteSlot);
resourceRoutes.get('/appointments',c.listAppointments); resourceRoutes.get('/appointments/:id',c.getAppointment); resourceRoutes.post('/appointments',c.createAppointment); resourceRoutes.put('/appointments/:id',c.updateAppointment); resourceRoutes.delete('/appointments/:id',c.deleteAppointment);
