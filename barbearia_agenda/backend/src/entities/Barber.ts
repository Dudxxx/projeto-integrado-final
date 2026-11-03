import { BaseEntity } from './BaseEntity.js';

export class Barber extends BaseEntity {
    public constructor(
        id: number,
        private name: string,
        private bio: string | null,
        private active: boolean
    ) { super(id); }
    public get nome(): string { return this.name; }
    public get descricao(): string | null { return this.bio; }
    public get ativo(): boolean { return this.active; }
    public toJSON(): Record<string, unknown> { return { id: this.id, nome: this.name, descricao: this.bio, ativo: this.active }; }
}
