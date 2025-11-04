/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Plain<T> = T;

export type Constructor<T, Arguments extends unknown[] = unknown[]> = new (
  ...arguments_: Arguments
) => T;
