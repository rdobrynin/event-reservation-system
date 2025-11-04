/* eslint-disable @typescript-eslint/no-unused-vars */

import type { AbstractDto } from './dto/abstract.dto';

export type Optional<T> = T | undefined;

export type Constructor<T, Arguments extends unknown[] = unknown[]> = new (
  ...arguments_: Arguments
) => T;

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: any): Dto[];
  }
}

declare module 'typeorm' {
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }
}
