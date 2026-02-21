import type { PropsWithChildren } from "react";

export function EmptyLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="relative flex min-h-screen flex-col gap-5 p-6 lg:p-10 lg:pt-6">
        <main className="flex h-full flex-1 flex-col gap-5">{children}</main>
      </div>
    </div>
  );
}
