import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { Barber } from '../entities/Barber.js';
import { BaseRepository, type PaginatedResult, type PaginationParams } from './BaseRepository.js';
interface BarberRow extends RowDataPacket { id:number; nome:string; bio:string|null; ativo:number; }
export class BarberRepository extends BaseRepository<Barber>{
    protected readonly tableName='barbeiros';
    public async list(p:PaginationParams,search=''):Promise<PaginatedResult<Barber>>{ const like=`%${search}%`; const [rows]=await pool.execute<BarberRow[]>(`SELECT * FROM ${this.tableName} WHERE nome LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`,[like,p.pageSize,p.offset]); const [count]=await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) total FROM ${this.tableName} WHERE nome LIKE ?`,[like]); return {data:rows.map(r=>this.map(r)),page:p.page,pageSize:p.pageSize,total:Number(count[0]?.total??0),totalPages:Math.max(1,Math.ceil(Number(count[0]?.total??0)/p.pageSize))}; }
    public async findById(id:number):Promise<Barber|null>{const [r]=await pool.execute<BarberRow[]>('SELECT * FROM barbeiros WHERE id=?',[id]);return r[0]?this.map(r[0]):null;}
    public async create(d:{nome:string;bio:string|null;ativo:boolean}):Promise<Barber>{const [x]=await pool.execute<ResultSetHeader>('INSERT INTO barbeiros(nome,bio,ativo) VALUES(?,?,?)',[d.nome,d.bio,d.ativo?1:0]);return (await this.findById(x.insertId))!;}
    public async update(id:number,d:{nome:string;bio:string|null;ativo:boolean}):Promise<Barber>{await pool.execute('UPDATE barbeiros SET nome=?,bio=?,ativo=? WHERE id=?',[d.nome,d.bio,d.ativo?1:0,id]);return (await this.findById(id))!;}
    public async delete(id:number):Promise<void>{await pool.execute('DELETE FROM barbeiros WHERE id=?',[id]);}
    private map(r:BarberRow):Barber{return new Barber(r.id,r.nome,r.bio,Boolean(r.ativo));}
}
