import { BaseEntity } from './BaseEntity.js';

export type AppointmentStatus = 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

export class Appointment extends BaseEntity {
    public constructor(
        id: number,
        private readonly userId: number,
        private readonly serviceId: number,
        private readonly slotId: number,
        private readonly serviceName: string,
        private readonly price: number,
        private readonly date: string,
        private readonly time: string,
        private readonly barberName: string,
        private status: AppointmentStatus,
        private notes: string | null
    ) { super(id); }
    public get usuarioId(): number { return this.userId; }
    public get servicoId(): number { return this.serviceId; }
    public get horarioId(): number { return this.slotId; }
    public get servico(): string { return this.serviceName; }
    public get preco(): number { return this.price; }
    public get data(): string { return this.date; }
    public get hora(): string { return this.time; }
    public get barbeiro(): string { return this.barberName; }
    public get situacao(): AppointmentStatus { return this.status; }
    public get observacoes(): string | null { return this.notes; }
    public toJSON(): Record<string, unknown> { return { id: this.id, usuarioId: this.userId, servicoId: this.serviceId, horarioId: this.slotId, servico: this.serviceName, preco: this.price, data: this.date, hora: this.time, barbeiro: this.barberName, situacao: this.status, observacoes: this.notes }; }
}
