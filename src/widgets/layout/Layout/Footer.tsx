import Twitter from "@/assets/icons/x.svg";
import Discord from "@/assets/icons/discord.svg";

export function Footer() {
  return (
    <div className="flex flex-row justify-center">
      <div className="border-r border-wise-white/10 px-4 last-of-type:border-r-0">
        <a
          href="https://twitter.com/turtledotxyz"
          className="flex items-center hover:text-neon-green"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Twitter />
        </a>
      </div>
      <div className="border-r border-wise-white/10 px-4 last-of-type:border-r-0">
        <a
          href="https://discord.turtle.xyz/"
          className="flex items-center hover:text-neon-green"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Discord />
        </a>
      </div>
    </div>
  );
}
