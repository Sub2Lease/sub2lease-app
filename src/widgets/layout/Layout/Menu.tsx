import { Link, matchPath, useLocation } from "react-router";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { cn } from "@/shared/utils";
import { routes } from "@/app/router";
// import GreenDotIcon from "@/assets/icons/green-dot.svg?react";

const DefaultIcon = ({ letter }: { letter: string }) => (
  <div className="flex size-4 items-center justify-center rounded-full bg-wise-white/10 text-[10px] font-medium text-wise-white">
    {letter}
  </div>
);

export default function Menu({ closeSheet, className }: { closeSheet?: () => void; className?: string }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverOpen, setHoverOpen] = useState<string | null>(null);

  const handleLinkClick = () => {
    if (closeSheet) closeSheet();
    setOpenDropdown(null);
    setHoverOpen(null);
  };

  const renderMenuItem = ({ name, path, target, hidden, disabled, children }: (typeof routes)[0]) => {
    const matches = matchPath(`${path}/*`, location.pathname) !== null;
    const childMatches = children?.some((child) => matchPath(child.path, location.pathname) !== null) ?? false;
    const isActive = matches || childMatches;

    if (hidden || disabled) return null;

    const unhiddenChildren = children?.filter((child) => !child.hidden) ?? [];

    if (unhiddenChildren && unhiddenChildren.length > 0) {
      const trigger = (
        <div className="flex w-full items-center">
          <Link
            to={path}
            className={cn(
              "group flex h-10 w-full items-center justify-between whitespace-nowrap rounded-full px-5 py-1.5 leading-7 text-wise-white/50 transition-colors hover:text-neon-green md:w-auto md:justify-normal md:px-2.5",
              isActive
                ? "gradient-border gradient-border-green-vertical gradient-radius-full flex gap-2.5 border !pl-[25px] text-neon-green shadow-[0px_0px_4px_0px_#73F36C]"
                : "border border-wise-white/10 md:border-transparent",
            )}
            onClick={handleLinkClick}
          >
            <div className="flex items-center gap-1">
              {name}
              <ChevronDownIcon className="hidden size-4 transition-transform duration-200 group-hover:rotate-180 md:block" />
            </div>
            {isActive && (
              <div className="relative size-[18px]">
                {/* <GreenDotIcon className="absolute left-[-15px] top-[-15px] size-12" /> */}
              </div>
            )}
          </Link>
        </div>
      );

      const content = (
        <div className="z-50 min-w-[200px] rounded-[19px] p-1">
          {unhiddenChildren.map((child) => {
            const isChildActive = matchPath(child.path, location.pathname) !== null;
            const Icon = child.icon;
            return (
              <Link
                key={child.name}
                to={child.path}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-full bg-ninja-black p-1.5 text-sm text-wise-white/50 hover:text-neon-green",
                  isChildActive && "text-neon-green",
                )}
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-2">
                  {Icon ? <Icon /> : <DefaultIcon letter={child.name[0]} />}
                  <span>{child.label || child.name}</span>
                </div>
                {isChildActive && (
                  <div className="relative size-[18px]">
                    {/* <GreenDotIcon className="absolute left-[-15px] top-[-15px] size-12" /> */}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      );

      if (isMobile) {
        return (
          <div key={name} className="flex w-full items-center gap-2">
            <Link
              to={path}
              className={cn(
                "group flex h-10 w-full items-center justify-between whitespace-nowrap rounded-full px-5 py-1.5 leading-7 text-wise-white/50 transition-colors hover:text-neon-green md:w-auto md:justify-normal md:px-2.5",
                isActive
                  ? "gradient-border gradient-border-green-vertical gradient-radius-full flex gap-2.5 border !pl-[25px] text-neon-green shadow-[0px_0px_4px_0px_#73F36C]"
                  : "border border-wise-white/10 md:border-transparent",
              )}
              onClick={handleLinkClick}
            >
              <div className="flex items-center gap-1">{name}</div>
              {isActive && (
                <div className="relative size-[18px]">
                  {/* <GreenDotIcon className="absolute left-[-15px] top-[-15px] size-12" /> */}
                </div>
              )}
            </Link>
            <DropdownMenu.Root
              open={openDropdown === name}
              onOpenChange={(open) => setOpenDropdown(open ? name : null)}
            >
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="gradient-border gradient-border-green-vertical gradient-radius-full flex size-10 items-center justify-center rounded-full border text-neon-green shadow-[0px_0px_4px_0px_#73F36C]"
                  aria-label="Toggle dropdown"
                >
                  <ChevronDownIcon className="size-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[200px] rounded-[19px] border border-wise-white/10 bg-ninja-black p-1 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.40)] data-[side=bottom]:animate-in data-[side=top]:animate-in data-[side=bottom]:fade-in-0 data-[side=top]:fade-in-0 data-[side=bottom]:zoom-in-95 data-[side=top]:zoom-in-95"
                  sideOffset={2}
                  align="start"
                >
                  {unhiddenChildren.map((child) => {
                    const isChildActive = matchPath(child.path, location.pathname) !== null;
                    const Icon = child.icon;
                    return (
                      <DropdownMenu.Item key={child.name} asChild>
                        <Link
                          to={child.path}
                          className={cn(
                            "flex cursor-pointer items-center justify-between gap-2 rounded-full bg-ninja-black p-1.5 text-sm text-wise-white/50 hover:text-neon-green",
                            isChildActive && "text-neon-green",
                          )}
                          onClick={handleLinkClick}
                        >
                          <div className="flex items-center gap-2">
                            {Icon ? <Icon /> : <DefaultIcon letter={child.name[0]} />}
                            <span>{child.label || child.name}</span>
                          </div>
                          {isChildActive && (
                            <div className="relative size-[18px]">
                              {/* <GreenDotIcon className="absolute left-[-15px] top-[-15px] size-12" /> */}
                            </div>
                          )}
                        </Link>
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        );
      }

      return (
        <HoverCard.Root
          key={name}
          open={hoverOpen === name}
          onOpenChange={(open) => setHoverOpen(open ? name : null)}
          openDelay={0}
          closeDelay={0}
        >
          <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content
              className="z-50 min-w-[200px] rounded-[19px] border border-wise-white/10 bg-ninja-black p-1 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.40)] data-[side=bottom]:animate-in data-[side=top]:animate-in data-[side=bottom]:fade-in-0 data-[side=top]:fade-in-0 data-[side=bottom]:zoom-in-95 data-[side=top]:zoom-in-95"
              sideOffset={2}
              align="start"
            >
              {content}
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      );
    }

    return (
      <Link
        key={name}
        to={path}
        className={cn(
          "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-full px-5 py-1.5 leading-7 text-wise-white/50 transition-colors hover:text-neon-green md:w-auto md:justify-normal md:px-2.5",
          matches
            ? "gradient-border gradient-border-green-vertical gradient-radius-full flex gap-2.5 border !pl-[25px] text-neon-green shadow-[0px_0px_4px_0px_#73F36C]"
            : "border border-wise-white/10 md:border-transparent",
        )}
        target={target || "_self"}
        onClick={handleLinkClick}
      >
        {name}
        {matches && (
          <div className="relative size-[18px]">
            {/* <GreenDotIcon className="absolute left-[-15px] top-[-15px] size-12" /> */}
          </div>
        )}
      </Link>
    );
  };

  return (
    <nav className={cn("flex flex-col items-start gap-2.5 text-xs font-medium md:flex-row", className)}>
      {routes.map(renderMenuItem)}
    </nav>
  );
}
