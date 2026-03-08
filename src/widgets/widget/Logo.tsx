import { cn } from "@/shared/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";

const logoVariants = cva(
  "text-2xl font-bold tracking-tight",
  {
    variants: {
      color: {
        default: "",
        white: "text-wise-white",
      },
      size: {
        default: "text-2xl",
        sm: "text-xl",
        lg: "text-3xl",
        xl: "text-4xl",
      },
    },
    defaultVariants: {
      color: "default",
      size: "default",
    },
  },
);

interface LogoProps extends VariantProps<typeof logoVariants> {
  isLink?: boolean;
}

export function Logo({ isLink = true, color, size }: LogoProps) {
  const font = { fontFamily: "'Caveat', cursive" };

  return isLink ? <Link
    to="/"
    className={cn(logoVariants({ color, size }))}
    style={font}
  >
    Memento
  </Link> : <span
    className={cn(logoVariants({ color, size }))}
    style={font}
  >
    Memento
  </span>
}