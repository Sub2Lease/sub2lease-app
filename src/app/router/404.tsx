import { Link } from "react-router-dom";

export function NotFoundRoute() {

  return (
     <div>
      <div className="w-full px-6 text-center">
        <h1 className="mb-5 text-3xl lg:text-[40px] lg:leading-[40px]">
          Oops! <br /> Looks like you <br className="sm:hidden" /> got lost...
        </h1>

        <Link className="mt-8 inline-block bg-white p-4 rounded-lg" to="/">Go back home</Link>
      </div>
     </div>
  );
}
