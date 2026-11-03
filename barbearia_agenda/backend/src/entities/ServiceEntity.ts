import { BaseEntity } from './BaseEntity.js';

export class ServiceEntity extends BaseEntity {
    public constructor(
        id: number,
        private name: string,
        private description: string | null,
        private price: number,
        private durationMinutes: number,
        private active: boolean
    ) { super(id); }
    public get nome(): string { return this.name; }
    public get descricao(): string | null { return this.description; }
    public get preco(): number { return this.price; }
    public get duracaoMinutos(): number { return this.durationMinutes; }
    public get ativo(): boolean { return this.active; }
    public toJSON(): Record<string, unknown> { return { id: this.id, nome: this.name, descricao: this.description, preco: this.price, duracaoMinutos: this.durationMinutes, ativo: this.active }; }
}
