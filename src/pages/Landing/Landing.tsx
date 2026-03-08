import { useNavigate } from "react-router";

export function Landing() {

  const navigate = useNavigate();

  const onClick = () => {
    navigate("/listings");
  };

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="fixed inset-0 -z-10 bg-black/40" />
      <div className="max-w-3xl">
        <h1 className="whitespace-pre-line text-5xl font-semibold leading-[1.05] text-wise-white sm:text-6xl lg:text-7xl">
          {"Student to student\nsubleasing\nmade simple"}
        </h1>

        <p className="mt-6 mx-auto max-w-xl text-base text-wise-white/80 sm:text-lg">
          Subleasing for the Badger community
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={onClick} className="rounded-full bg-wise-white px-6 py-3 text-sm font-medium text-ninja-black">
            Find your home →
          </button>

          <button onClick={() => navigate("/listings/create")} className="rounded-full border border-wise-white/60 bg-transparent px-6 py-3 text-sm font-medium text-wise-white hover:bg-wise-white/10">
            List your place
          </button>
        </div>
      </div>
    </section>
  );
}