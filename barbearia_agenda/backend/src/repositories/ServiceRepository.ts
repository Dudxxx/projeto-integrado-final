import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { ServiceEntity } from '../entities/ServiceEntity.js';
import { BaseRepository, type PaginatedResult, type PaginationParams } from './BaseRepository.js';

interface ServiceRow extends RowDataPacket { id:number; nome:string; descricao:string|null; preco:number; duracao_minutos:number; ativo:number; }

export class ServiceRepository extends BaseRepository<ServiceEntity> {
    protected readonly tableName = 'servicos';
    public async list(params: PaginationParams, search = ''): Promise<PaginatedResult<ServiceEntity>> {
        const like = `%${search}%`;
        const [rows] = await pool.execute<ServiceRow[]>(`SELECT * FROM ${this.tableName} WHERE nome LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`, [like, params.pageSize, params.offset]);
        const [countRows] = await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${this.tableName} WHERE nome LIKE ?`, [like]);
        return this.page(rows.map(r => this.map(r)), Number(countRows[0]?.total ?? 0), params);
    }
    public async findById(id:number):Promise<ServiceEntity|null>{ const [r]=await pool.execute<ServiceRow[]>('SELECT * FROM servicos WHERE id=?',[id]); return r[0]?this.map(r[0]):null; }
    public async create(data:{nome:string;descricao:string|null;preco:number;duracao:number;ativo:boolean}):Promise<ServiceEntity>{ const [x]=await pool.execute<ResultSetHeader>('INSERT INTO servicos(nome,descricao,preco,duracao_minutos,ativo) VALUES(?,?,?,?,?)',[data.nome,data.descricao,data.preco,data.duracao,data.ativo?1:0]); return (await this.findById(x.insertId))!; }
    public async update(id:number,data:{nome:string;descricao:string|null;preco:number;duracao:number;ativo:boolean}):Promise<ServiceEntity>{ await pool.execute('UPDATE servicos SET nome=?,descricao=?,preco=?,duracao_minutos=?,ativo=? WHERE id=?',[data.nome,data.descricao,data.preco,data.duracao,data.ativo?1:0,id]); return (await this.findById(id))!; }
    public async delete(id:number):Promise<void>{ await pool.execute('DELETE FROM servicos WHERE id=?',[id]); }
    private map(r:ServiceRow):ServiceEntity{ return new ServiceEntity(r.id,r.nome,r.descricao,Number(r.preco),r.duracao_minutos,Boolean(r.ativo)); }
    private page(data:ServiceEntity[],total:number,p:PaginationParams):PaginatedResult<ServiceEntity>{ return {data,page:p.page,pageSize:p.pageSize,total,totalPages:Math.max(1,Math.ceil(total/p.pageSize))}; }
}
