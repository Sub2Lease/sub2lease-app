import { Link } from "react-router";

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-white/10" />
          <span className="text-sm font-semibold tracking-wide">YourProduct</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="#features">
            Features
          </a>
          <a className="hover:text-white" href="#how">
            How it works
          </a>
          <a className="hover:text-white" href="#faq">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="size-1.5 rounded-full bg-green-400" />
              Now in public beta
            </div>

            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              A simple landing page that looks good out of the box.
            </h1>

            <p className="mt-4 text-base leading-7 text-white/70">
              Add a short, clear description of your product here. Explain the value in one or two
              sentences—fast to read, hard to forget.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-green-400 px-5 py-3 text-sm font-semibold text-black hover:bg-green-300"
              >
                Start free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                See features
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
              <span>✓ No credit card</span>
              <span>✓ Takes 2 minutes</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>

          {/* Hero card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="rounded-2xl bg-black/40 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Live preview</p>
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-red-400/80" />
                  <span className="size-2 rounded-full bg-yellow-300/80" />
                  <span className="size-2 rounded-full bg-green-400/80" />
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Status</p>
                  <p className="mt-1 text-sm font-semibold">All systems operational</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/60">Users</p>
                    <p className="mt-1 text-sm font-semibold">12,482</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/60">Latency</p>
                    <p className="mt-1 text-sm font-semibold">84ms</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Next step</p>
                  <p className="mt-1 text-sm font-semibold">Connect your account →</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/60">
              Replace this card with a screenshot, animation, or a short product demo.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-semibold">Features</h2>
        <p className="mt-2 text-sm text-white/70">
          Three crisp bullets. Keep it simple. Make it skimmable.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Fast setup", desc: "Get started in minutes with sensible defaults." },
            { title: "Clean UI", desc: "A polished design that works on mobile and desktop." },
            { title: "Extensible", desc: "Swap sections out as your product evolves." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 size-10 rounded-2xl bg-white/10" />
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Create", desc: "Sign up and create your first project." },
              { step: "2", title: "Connect", desc: "Integrate the tools you already use." },
              { step: "3", title: "Launch", desc: "Ship with confidence and iterate quickly." },
            ].map((s) => (
              <div key={s.step} className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-green-400 text-sm font-bold text-black">
                    {s.step}
                  </div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { q: "Is this production-ready?", a: "Yes—swap text, hook up routes, and you’re good." },
            { q: "Do I need Tailwind?", a: "This uses Tailwind classes. You can replace with CSS easily." },
            { q: "Can I add pricing?", a: "Yep—add a section and a simple tier card grid." },
            { q: "Where do I put screenshots?", a: "Replace the hero card with an <img> or your demo component." },
          ].map((item) => (
            <div key={item.q} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold">{item.q}</p>
              <p className="mt-2 text-sm leading-6 text-white/70">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} YourProduct. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-white" href="#">
              Terms
            </a>
            <a className="hover:text-white" href="#">
              Privacy
            </a>
            <a className="hover:text-white" href="#">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}