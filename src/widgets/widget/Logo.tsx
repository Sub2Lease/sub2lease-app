import { cn } from "@/shared/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";

const logoVariants = cva(
  "font-semibold tracking-tight",
  {
    variants: {
      color: {
        default: "text-foreground",
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
  const className = cn(
    logoVariants({ color, size }),
    "font-sora"
  );

  return isLink ? (
    <Link to="/" className={className}>
      Sub2Lease
    </Link>
  ) : (
    <span className={className}>
      Sub2Lease
    </span>
  );
}