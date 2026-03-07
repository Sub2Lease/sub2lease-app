export function Listings() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-screen-2xl flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-wise-white sm:text-5xl">
            Browse Subleases in Madison
          </h1>
          <p className="mt-2 text-wise-white/80">
            Student-to-student listings for the Badger community.
          </p>
        </div>

        {/* Filters (UI only) */}
        <div
          className="
            gradient-border gradient-border-white gradient-radius-20
            bg-black/60 backdrop-blur-md
            p-4 sm:p-5
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            
            <input
              placeholder="Search (Langdon, studio, Lakeshore...)"
              className="
                w-full rounded-full border border-wise-white/20 bg-black/40
                px-4 py-2 text-sm text-wise-white
                placeholder:text-wise-white/50
                outline-none focus:border-wise-white/40
              "
            />

            <select
              className="
                w-full sm:w-56 rounded-full border border-wise-white/20 bg-black/40
                px-4 py-2 text-sm text-wise-white
                outline-none focus:border-wise-white/40
              "
            >
              <option className="bg-ninja-black">All Neighborhoods</option>
            </select>

            <input
              type="number"
              placeholder="Max price"
              className="
                w-full sm:w-44 rounded-full border border-wise-white/20 bg-black/40
                px-4 py-2 text-sm text-wise-white
                placeholder:text-wise-white/50
                outline-none focus:border-wise-white/40
              "
            />
          </div>
        </div>

        {/* Listings Grid (empty for now) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Cards will go here later */}
        </div>

        {/* Empty State */}
        <div className="py-20 text-center">
          <p className="text-wise-white/70">
            No listings available yet.
          </p>
          <button className="mt-6 rounded-full bg-wise-white px-6 py-3 text-sm font-medium text-ninja-black">
            Be the first to list →
          </button>
        </div>

      </div>
    </section>
  );
}