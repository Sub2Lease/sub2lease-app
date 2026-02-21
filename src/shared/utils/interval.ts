export function setDynamicInterval(fn: () => Promise<void> | void, interval: () => number, runAtStart = false) {
  let timeout: NodeJS.Timeout;
  let running = true;

  async function run() {
    if (!running) return;
    await fn();
    timeout = setTimeout(run, interval());
  }

  if (runAtStart) run();
  else timeout = setTimeout(run, interval());

  return () => {
    if (!running) return;
    running = false;
    clearTimeout(timeout);
  };
}
