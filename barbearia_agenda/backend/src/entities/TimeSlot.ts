import { BaseEntity } from './BaseEntity.js';

export type SlotStatus = 'DISPONIVEL' | 'BLOQUEADO' | 'RESERVADO';

export class TimeSlot extends BaseEntity {
    public constructor(
        id: number,
        private readonly date: string,
        private readonly time: string,
        private readonly barberId: number,
        private status: SlotStatus
    ) { super(id); }
    public get data(): string { return this.date; }
    public get hora(): string { return this.time; }
    public get barbeiroId(): number { return this.barberId; }
    public get situacao(): SlotStatus { return this.status; }
    public toJSON(): Record<string, unknown> { return { id: this.id, data: this.date, hora: this.time, barbeiroId: this.barberId, situacao: this.status }; }
}
