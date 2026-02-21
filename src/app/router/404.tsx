import { useNavigate } from "react-router";
import { Button } from "@/shared/ui/Button";

export function NotFoundRoute() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/");
  };

  return (
     <div>
      <div className="w-full px-6 text-center">
        <h1 className="mb-5 text-3xl lg:text-[40px] lg:leading-[40px]">
          Oops! <br /> Looks like a turtle <br className="sm:hidden" /> got lost...
        </h1>
        <p className="mb-10 lg:text-xl">Took the wrong path. Wandered off the chain.</p>
        <img src="/images/404.svg" alt="404" className="mx-auto w-[340px] md:w-[450px] lg:w-[650px]" />
        <div className="flex translate-y-[-20px] flex-col items-center gap-10 md:translate-y-[-50px] lg:translate-y-[-80px]">
          <Button onClick={onClick} variant="reversed">
            Go back home
          </Button>
        </div>
      </div>
     </div>
  );
}
