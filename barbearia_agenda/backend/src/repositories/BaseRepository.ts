import type { Pool } from 'mysql2/promise';

export interface PaginationParams { page: number; pageSize: number; offset: number; }
export interface PaginatedResult<T> { data: T[]; page: number; pageSize: number; total: number; totalPages: number; }

export abstract class BaseRepository<TEntity> {
    protected constructor(protected readonly db: Pool) {}
    protected abstract readonly tableName: string;
    public abstract list(params: PaginationParams, search?: string): Promise<PaginatedResult<TEntity>>;
}
