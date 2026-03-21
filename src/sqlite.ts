import { Database as BunDatabase } from 'bun:sqlite';

type BunStatement = ReturnType<BunDatabase['prepare']>;

class Statement<Row = unknown> {
  constructor(private readonly statement: BunStatement) {}

  all(...params: unknown[]): Row[] {
    return this.statement.all(...(params as never[])) as Row[];
  }

  get(...params: unknown[]): Row | undefined {
    const row = this.statement.get(...(params as never[])) as Row | null;
    return row ?? undefined;
  }

  run(...params: unknown[]) {
    return this.statement.run(...(params as never[]));
  }
}

export default class Database {
  private readonly database: BunDatabase;

  constructor(
    filename?: ConstructorParameters<typeof BunDatabase>[0],
    options?: ConstructorParameters<typeof BunDatabase>[1],
  ) {
    this.database = new BunDatabase(filename, options);
  }

  exec(sql: string): void {
    this.database.exec(sql);
  }

  pragma(value: string): void {
    this.database.exec(`PRAGMA ${value}`);
  }

  prepare<Row = unknown>(sql: string): Statement<Row> {
    return new Statement<Row>(this.database.prepare(sql));
  }

  close(): void {
    this.database.close();
  }
}
