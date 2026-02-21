import { useLockBodyScroll } from "@/shared/hooks";
import { cn } from "@/shared/utils";

export function BurgerMenuButton({
  isOpen,
  setIsOpen,
  className,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  className?: string;
}) {
  useLockBodyScroll(isOpen);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const buttonClassName = "h-px w-[18px] bg-neon-green transition duration-300 ease-in-out";

  return (
    <button
      type="button"
      className={cn(
        "gradient-border gradient-border-green-vertical gradient-radius-full relative z-50 size-10 px-[10px] text-neon-green shadow-[0px_0px_4px_0px_#73F36C] focus:outline-none",
        className,
      )}
      onClick={handleButtonClick}
      aria-label="Toggle menu"
    >
      <div className={cn("absolute top-[14px]", buttonClassName, isOpen ? "translate-y-[5px] rotate-45" : "")} />
      <div className={cn("", buttonClassName, isOpen ? "invisible" : "visible")} />
      <div className={cn("absolute bottom-[14px]", buttonClassName, isOpen ? "-translate-y-[4px] -rotate-45" : "")} />
    </button>
  );
}
