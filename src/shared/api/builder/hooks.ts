import type { UseQueryResult } from "@tanstack/react-query";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Hooks, Any } from "./types.d.ts";

// Types

type DefaultFn = (...args: Any[]) => Promise<Any>;

type MapMap<Map extends Record<string, Hooks.Item>> = {
  [K in keyof Map]: Map[K] extends Hooks.Item ? Hooks.Fn<Map[K]> : never;
};

interface Multicall<Map extends Record<string, Hooks.Item>> {
  multicall: {
    <const List extends [keyof Map, ...Any[]][]>(list: List): UseQueryResult<Any, Any>[];
  };
  item: <K extends keyof Map>(key: K, ...args: Parameters<MapMap<Map>[K]>) => [K, ...Parameters<MapMap<Map>[K]>];
}

// Versioning

const appVersion =
  (typeof __COMMIT_HASH__ !== "undefined" ? __COMMIT_HASH__ : null) ?? "default-version";

// Builder

export function buildHooks<Map extends Record<string, Hooks.Item>>(
  map: Map,
  defaults: Hooks.Options = {},
): MapMap<Map> & Multicall<Map> {
  const result = {} as Record<string, Hooks.Fn<Hooks.Item>>;

  for (const key in map) {
    const hookItem = map[key];
    const rawKey = key;

    result[key] = function (...args: Any[]) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useQuery(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useMemo(
          () => makeQuery(hookItem, rawKey, defaults, args),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [...args],
        ),
      );
    };
  }

  const multicall: Multicall<Map> = {
    multicall(list) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useQueries({
        // eslint-disable-next-line react-hooks/rules-of-hooks
        queries: useMemo(
          () => list.map(([rawKey, ...args]) => makeQuery(map[rawKey], rawKey, defaults, args)),
          [list],
        ),
      });
    },
    item<K extends keyof Map>(key: K, ...args: Parameters<MapMap<Map>[K]>) {
      return [key, ...args] as [K, ...Parameters<MapMap<Map>[K]>];
    },
  };

  return Object.assign(result, multicall) as Any;
}

function makeQuery(
  hookItem: Hooks.Item<DefaultFn>,
  rawKey: string | number | symbol,
  defaults: Hooks.Options,
  args: Any[],
) {
  const key =
    typeof hookItem.key === "function"
      ? [appVersion, ...hookItem.key(...args)]
      : [rawKey, appVersion, ...args];

  const options: Hooks.Options =
    typeof hookItem.options === "function" ? hookItem.options(...args) : (hookItem.options ?? {});

  const merged: Hooks.Options = { ...defaults, ...options };

  return {
    queryKey: key,
    queryFn: () => hookItem.fn(...args),
    ...merged,
  };
}

// Item Helper

export function item<F extends DefaultFn>(i: F | Hooks.Item<F>): Hooks.Item<F> {
  if (typeof i === "function") {
    return { fn: i };
  }
  return i;
}