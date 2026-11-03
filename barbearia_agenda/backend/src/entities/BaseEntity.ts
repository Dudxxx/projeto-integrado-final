export abstract class BaseEntity {
    protected constructor(private readonly entityId: number) {}

    public get id(): number { return this.entityId; }
    public abstract toJSON(): Record<string, unknown>;
}
