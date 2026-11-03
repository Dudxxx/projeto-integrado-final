import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/app/DashboardPage';
import { BookAppointmentPage } from './pages/app/BookAppointmentPage';
import { MyAppointmentsPage } from './pages/app/MyAppointmentsPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { ServicesPage } from './pages/admin/ServicesPage';
import { ServiceFormPage } from './pages/admin/ServiceFormPage';
import { BarbersPage } from './pages/admin/BarbersPage';
import { BarberFormPage } from './pages/admin/BarberFormPage';
import { TimeSlotsPage } from './pages/admin/TimeSlotsPage';
import { TimeSlotFormPage } from './pages/admin/TimeSlotFormPage';
import { AppointmentsPage } from './pages/admin/AppointmentsPage';
import { AppointmentFormPage } from './pages/admin/AppointmentFormPage';

export function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<HomePage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/app" element={<ProtectedRoute><AppLayout/></ProtectedRoute>}><Route index element={<DashboardPage/>}/><Route path="agendar" element={<BookAppointmentPage/>}/><Route path="agenda" element={<MyAppointmentsPage/>}/><Route path="perfil" element={<ProfilePage/>}/></Route><Route path="/admin" element={<AdminRoute><AppLayout/></AdminRoute>}><Route path="servicos" element={<ServicesPage/>}/><Route path="servicos/novo" element={<ServiceFormPage/>}/><Route path="servicos/:id/editar" element={<ServiceFormPage/>}/><Route path="barbeiros" element={<BarbersPage/>}/><Route path="barbeiros/novo" element={<BarberFormPage/>}/><Route path="barbeiros/:id/editar" element={<BarberFormPage/>}/><Route path="horarios" element={<TimeSlotsPage/>}/><Route path="horarios/novo" element={<TimeSlotFormPage/>}/><Route path="horarios/:id/editar" element={<TimeSlotFormPage/>}/><Route path="agendamentos" element={<AppointmentsPage/>}/><Route path="agendamentos/novo" element={<AppointmentFormPage/>}/><Route path="agendamentos/:id/editar" element={<AppointmentFormPage/>}/></Route><Route path="*" element={<HomePage/>}/></Routes></BrowserRouter></AuthProvider>}
