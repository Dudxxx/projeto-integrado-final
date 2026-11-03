import { BaseEntity } from './BaseEntity.js';

export type UserLevel = 'USER' | 'ADMIN';

export class User extends BaseEntity {
    public constructor(
        id: number,
        private name: string,
        private readonly email: string,
        private cpf: string,
        private passwordHash: string,
        private readonly level: UserLevel,
        private readonly createdAt: string
    ) {
        super(id);
    }

    public get nome(): string { return this.name; }
    public get emailAddress(): string { return this.email; }
    public get documento(): string { return this.cpf; }
    public get nivel(): UserLevel { return this.level; }
    public get created(): string { return this.createdAt; }
    public get hash(): string { return this.passwordHash; }

    public updateProfile(name: string, cpf: string, passwordHash: string): void {
        this.name = name;
        this.cpf = cpf;
        this.passwordHash = passwordHash;
    }

    public toJSON(): Record<string, unknown> {
        return { id: this.id, nome: this.name, email: this.email, cpf: this.cpf, nivel: this.level, createdAt: this.createdAt };
    }
}
