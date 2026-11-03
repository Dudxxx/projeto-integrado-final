import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/database.js';
import { TimeSlot, type SlotStatus } from '../entities/TimeSlot.js';
import { BaseRepository, type PaginatedResult, type PaginationParams } from './BaseRepository.js';
interface SlotRow extends RowDataPacket { id:number; data_horario:string; hora:string; barbeiro_id:number; status:SlotStatus; barbeiro_nome?:string; }
export class TimeSlotRepository extends BaseRepository<TimeSlot>{
    protected readonly tableName='horarios';
    public async list(p:PaginationParams,search=''):Promise<PaginatedResult<TimeSlot>>{ const like=`%${search}%`; const [rows]=await pool.execute<SlotRow[]>(`SELECT h.*, b.nome barbeiro_nome FROM ${this.tableName} h JOIN barbeiros b ON b.id=h.barbeiro_id WHERE DATE_FORMAT(h.data_horario,'%Y-%m-%d') LIKE ? ORDER BY h.data_horario ASC,h.hora ASC LIMIT ? OFFSET ?`,[like,p.pageSize,p.offset]); const [count]=await pool.execute<RowDataPacket[]>(`SELECT COUNT(*) total FROM ${this.tableName} h WHERE DATE_FORMAT(h.data_horario,'%Y-%m-%d') LIKE ?`,[like]); const total=Number(count[0]?.total??0); return {data:rows.map(r=>this.map(r)),page:p.page,pageSize:p.pageSize,total,totalPages:Math.max(1,Math.ceil(total/p.pageSize))}; }
    public async findById(id:number):Promise<TimeSlot|null>{const [r]=await pool.execute<SlotRow[]>('SELECT h.*, b.nome barbeiro_nome FROM horarios h JOIN barbeiros b ON b.id=h.barbeiro_id WHERE h.id=?',[id]);return r[0]?this.map(r[0]):null;}
    public async available(date?:string):Promise<Array<{id:number;data:string;hora:string;barbeiroId:number;situacao:SlotStatus;barbeiroNome:string}>>{
        const sql=`SELECT h.*, b.nome barbeiro_nome FROM horarios h JOIN barbeiros b ON b.id=h.barbeiro_id WHERE h.status='DISPONIVEL' AND h.data_horario >= CURDATE() ${date?'AND h.data_horario = ?':''} ORDER BY h.data_horario,h.hora`;
        const [r]=await pool.execute<SlotRow[]>(sql,date?[date]:[]);
        return r.map(x=>({id:x.id,data:x.data_horario,hora:x.hora,barbeiroId:x.barbeiro_id,situacao:x.status,barbeiroNome:x.barbeiro_nome??''}));
    }
    public async create(d:{data:string;hora:string;barbeiroId:number;status:SlotStatus}):Promise<TimeSlot>{const [x]=await pool.execute<ResultSetHeader>('INSERT INTO horarios(data_horario,hora,barbeiro_id,status) VALUES(?,?,?,?)',[d.data,d.hora,d.barbeiroId,d.status]);return (await this.findById(x.insertId))!;}
    public async update(id:number,d:{data:string;hora:string;barbeiroId:number;status:SlotStatus}):Promise<TimeSlot>{await pool.execute('UPDATE horarios SET data_horario=?,hora=?,barbeiro_id=?,status=? WHERE id=?',[d.data,d.hora,d.barbeiroId,d.status,id]);return (await this.findById(id))!;}
    public async delete(id:number):Promise<void>{await pool.execute('DELETE FROM horarios WHERE id=?',[id]);}
    public async lockById(conn: Awaited<ReturnType<typeof pool.getConnection>>, id:number):Promise<SlotRow|null>{const [r]=await conn.execute<SlotRow[]>('SELECT h.*, b.nome barbeiro_nome FROM horarios h JOIN barbeiros b ON b.id=h.barbeiro_id WHERE h.id=? FOR UPDATE',[id]);return r[0]??null;}
    public async markStatus(conn: Awaited<ReturnType<typeof pool.getConnection>>, id:number,status:SlotStatus):Promise<void>{await conn.execute('UPDATE horarios SET status=? WHERE id=?',[status,id]);}
    private map(r:SlotRow):TimeSlot{return new TimeSlot(r.id,r.data_horario,r.hora,r.barbeiro_id,r.status);}
}
