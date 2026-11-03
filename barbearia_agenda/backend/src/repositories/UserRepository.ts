import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { User, type UserLevel } from '../entities/User.js';

interface UserRow extends RowDataPacket {
    id: number; nome: string; email: string; senha_hash: string; cpf: string; nivel: UserLevel; created_at: string;
}

export class UserRepository {
    public async findByEmail(email: string): Promise<User | null> {
        const [rows] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return rows[0] ? this.map(rows[0]) : null;
    }
    public async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        return rows[0] ? this.map(rows[0]) : null;
    }
    public async existsByCpf(cpf: string, exceptId?: number): Promise<boolean> {
        const sql = exceptId ? 'SELECT id FROM users WHERE cpf = ? AND id <> ? LIMIT 1' : 'SELECT id FROM users WHERE cpf = ? LIMIT 1';
        const params = exceptId ? [cpf, exceptId] : [cpf];
        const [rows] = await pool.execute<RowDataPacket[]>(sql, params);
        return rows.length > 0;
    }
    public async create(data: { nome: string; email: string; cpf: string; senhaHash: string; nivel: UserLevel }): Promise<User> {
        const [result] = await pool.execute<ResultSetHeader>('INSERT INTO users (nome,email,senha_hash,cpf,nivel) VALUES (?,?,?,?,?)', [data.nome,data.email,data.senhaHash,data.cpf,data.nivel]);
        const user = await this.findById(result.insertId);
        if (!user) throw new Error('Usuário criado mas não localizado.');
        return user;
    }
    public async updateProfile(id: number, data: { nome: string; cpf: string; senhaHash: string }): Promise<User> {
        await pool.execute('UPDATE users SET nome = ?, cpf = ?, senha_hash = ? WHERE id = ?', [data.nome,data.cpf,data.senhaHash,id]);
        const user = await this.findById(id);
        if (!user) throw new Error('Usuário não localizado após atualização.');
        return user;
    }
    private map(row: UserRow): User {
        return new User(row.id,row.nome,row.email,row.cpf,row.senha_hash,row.nivel,row.created_at);
    }
}
