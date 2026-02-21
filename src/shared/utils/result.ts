export interface Ok<T> {
  _: "ok";
  value: T;
}

export interface Err<E> {
  _: "err";
  value: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export const R = {
  ok<T>(value: T): Ok<T> {
    return { _: "ok", value };
  },
  err<E>(value: E): Err<E> {
    return { _: "err", value };
  },
  isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result._ === "ok";
  },
  isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return result._ === "err";
  },
  unwrap<T, E>(result: Result<T, E>): T {
    if (R.isOk(result)) {
      return result.value;
    }

    throw new Error("Cannot unwrap Ok from Err");
  },
  unwrapErr<T, E>(result: Result<T, E>): E {
    if (R.isErr(result)) {
      return result.value;
    }

    throw new Error("Cannot unwrap Err from Ok");
  },
  unwrapOr<T, E, U = T>(result: Result<T, E>, defaultValue: U): T | U {
    if (R.isOk(result)) {
      return result.value;
    }

    return defaultValue;
  },
  map<T, E, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    if (R.isOk(result)) {
      return R.ok(fn(result.value));
    }

    return result;
  },
  mapErr<T, E, F>(result: Result<T, E>, fn: (value: E) => F): Result<T, F> {
    if (R.isErr(result)) {
      return R.err(fn(result.value));
    }

    return result;
  },
  andThen<T, E, U>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
    if (R.isOk(result)) {
      return fn(result.value);
    }

    return result;
  },
};
