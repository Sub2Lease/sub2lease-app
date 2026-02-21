import type { Dispatch, SetStateAction } from "react";

export type Any = any;

export type Obj = Record<string | number | symbol, Any>;

export interface EmptyObj {}

export type State<T> = [T, Dispatch<SetStateAction<T>>];

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

export type IsAny<T> = IfAny<T, true, never>;

export type Identity<T> = T;

export type ValueOrNever<Key extends string, T = never> = [T] extends [never]
  ? { [K in Key]: never }
  : { [K in Key]: T };

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Fn<Args extends Any[] = Any[], Return extends Any = Any> = (...args: Args) => Return;

export type RemovePromise<T> = T extends Promise<infer U> ? U : T;

export type MaybePromise<T> = T | Promise<T>;
