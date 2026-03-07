import type { z } from "zod";
import type { Api, Any } from "./types.d.ts";

// Item Helper

export function item<
  Back extends Api.Backend,
  Input extends z.ZodTypeAny = z.ZodTypeAny,
  Result extends z.ZodTypeAny = z.ZodTypeAny,
>(i: Api.Item<Back, Input, Result>): Api.Item<Back, Input, Result> {
  return i;
}

// Builder

type ApiMap<Back extends Api.Backend, Map extends Record<string, Api.Item<Back>>> = {
  [K in keyof Map]: Api.Fn<Back, Map[K]>;
};

export function buildApi<
  Back extends Api.Backend,
  Map extends Record<string, Api.Item<Back>>,
>(
  backend: Back,
  config: Api.BackendConfig<Back>,
  map: Map,
): ApiMap<Back, Map> {
  const result = {} as Record<string, (input: Any) => Promise<Any>>;

  for (const name in map) {
    const apiItem = map[name];

    result[name] = async (input: Any) => {
      // Resolve key
      const key =
        typeof apiItem.key === "function"
          ? (apiItem.key as (i: Any) => string)(input)
          : (apiItem.key as string);

      // Resolve options
      const options =
        typeof apiItem.options === "function"
          ? (apiItem.options as (i: Any) => Any)(input)
          : apiItem.options;

      const raw = await backend.get(config, options, key, input);

      // Parse result with zod if provided
      const parsed = apiItem.result ? apiItem.result.parse(raw) : raw;

      // Apply map transform if provided
      return apiItem.map ? apiItem.map(parsed) : parsed;
    };
  }

  return result as ApiMap<Back, Map>;
}