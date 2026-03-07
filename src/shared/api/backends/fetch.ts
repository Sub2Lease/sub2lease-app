import type { z } from "zod";
import type { Api } from "../builder/types";

// Types

export interface FetchConfig {
  root: string;
}

export type FetchKey = string;

export type FetchOption = (req: RequestInit & { url: string }) => RequestInit & { url: string };

// Option Helpers

export const methodOptions = {
  post:   ((r) => ({ ...r, method: "POST" }))   as FetchOption,
  patch:  ((r) => ({ ...r, method: "PATCH" }))  as FetchOption,
  put:    ((r) => ({ ...r, method: "PUT" }))     as FetchOption,
  delete: ((r) => ({ ...r, method: "DELETE" })) as FetchOption,
} satisfies Record<string, FetchOption>;

export const simpleJson: FetchOption = (r) => ({
  ...r,
  headers: {
    ...((r.headers as Record<string, string>) ?? {}),
    "Content-Type": "application/json",
  },
});

// Backend

export const fetchBackend = {
  defaultResult: {} as unknown as z.ZodUnknown,

  async get(
    config: FetchConfig,
    options: FetchOption[] | undefined,
    key: FetchKey,
    input: unknown,
  ): Promise<unknown> {
    const url = `${config.root}${key}`;

    let req: RequestInit & { url: string } = { url, method: "GET" };

    if (options) {
      for (const opt of options) {
        req = opt(req);
      }
    }

    const { url: finalUrl, ...init } = req;

    // If the method is not GET and there's a body to send, attach it
    if (init.method !== "GET" && input !== undefined) {
      const contentType = (init.headers as Record<string, string> | undefined)?.["Content-Type"];

      if (contentType === "application/json") {
        init.body = JSON.stringify(input);
      } else if (input instanceof FormData) {
        init.body = input;
      } else if (typeof input === "object" && input !== null) {
        // Build FormData for multipart uploads (e.g. uploadPostPhoto)
        const fd = new FormData();
        for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
          if (v instanceof File || v instanceof Blob) {
            fd.append(k, v);
          } else if (v !== undefined && v !== null) {
            fd.append(k, String(v));
          }
        }
        init.body = fd;
      }
    }

    const raw = localStorage.getItem("auth");
    const token = raw ? (JSON.parse(raw) as { state?: { token?: string } })?.state?.token ?? null : null;
    if (token) {
      init.headers = {
        ...((init.headers as Record<string, string>) ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }

    const res = await fetch(finalUrl, init);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error?: string }).error ?? res.statusText);
    }

    return res.json();
  },
} satisfies Api.Backend<FetchConfig, FetchKey, FetchOption[], z.ZodUnknown>;