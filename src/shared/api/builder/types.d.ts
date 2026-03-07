import type { z } from "zod";
import type { QueryKey, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

// Shared Types

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
export type MaybePromise<T> = T | Promise<T>;
export type RemovePromise<T> = T extends Promise<infer U> ? U : T;
export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// API namespace

export namespace Api {
  export interface Backend<
    Config extends Any = Any,
    Key extends Any = Any,
    Options extends Any = Any,
    DefaultResult extends z.ZodTypeAny = z.ZodTypeAny,
  > {
    defaultResult: DefaultResult;
    get: (config: Config, options: Options, key: Key, input: Any) => Promise<Any>;
  }

  export type BackendConfig<Back extends Backend> = Parameters<Back["get"]>[0];
  export type BackendKey<Back extends Backend> = Parameters<Back["get"]>[2];
  export type BackendOptions<Back extends Backend> = Parameters<Back["get"]>[1];
  export type BackendDefaultResult<Back extends Backend> = z.infer<Back["defaultResult"]>;

  export interface Item<
    Back extends Backend,
    Input extends z.ZodTypeAny = z.ZodTypeAny,
    Result extends z.ZodTypeAny = z.ZodTypeAny,
    U extends Any = z.infer<Extract<Result, z.ZodTypeAny>>,
  > {
    key: BackendKey<Back> | ((input: z.infer<Input>) => BackendKey<Back>);
    options?: BackendOptions<Back> | ((input: z.infer<Input>) => BackendOptions<Back>);
    map?: (value: z.infer<Extract<Result, z.ZodTypeAny>>) => MaybePromise<U>;
    input?: Input;
    result?: Result;
  }

  type DefaultItemResult<Back extends Backend, I extends Item<Back>> = IfAny<
    z.infer<Extract<I["result"], z.ZodTypeAny>>,
    BackendDefaultResult<Back>,
    z.infer<Extract<I["result"], z.ZodTypeAny>>
  >;

  type ItemReturn<Back extends Backend, I extends Item<Back>> = IfAny<
    RemovePromise<ReturnType<Extract<I["map"], (value: Any) => Any>>>,
    DefaultItemResult<Back, I>,
    RemovePromise<ReturnType<Extract<I["map"], (value: Any) => Any>>>
  >;

  export type Fn<Back extends Backend, I extends Item<Back>> = IfAny<
    z.infer<Extract<I["input"], z.ZodTypeAny>>,
    () => Promise<ItemReturn<Back, I>>,
    (input: z.infer<Extract<I["input"], z.ZodTypeAny>>) => Promise<ItemReturn<Back, I>>
  >;
}

// Hooks Namespace

 
type Fn = (...args: Any[]) => Promise<Any>;

export namespace Hooks {
  type DefaultFn = Fn;

  export type Options = Omit<UseQueryOptions, "queryKey" | "queryFn">;

  export interface Item<F extends DefaultFn = DefaultFn> {
    fn: F;
    key?: QueryKey | ((...args: Parameters<F>) => QueryKey);
    options?: Options | ((...args: Parameters<F>) => Options);
  }

  export type ItemFn<I extends Item> = I extends { fn: infer F } ? F : I;
  export type ItemReturn<I extends Item> = RemovePromise<ReturnType<ItemFn<I>>>;
  export type Fn<I extends Item> = (...args: Parameters<ItemFn<I>>) => UseQueryResult<ItemReturn<I>>;
}