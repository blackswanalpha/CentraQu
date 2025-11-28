import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

const baseStyles =
  "rounded-lg px-3.5 font-medium text-dark transition-all duration-200";
const activeStyles =
  "bg-primary-light text-primary hover:bg-primary-light dark:bg-[#FFFFFF1A] dark:text-white";
const inactiveStyles =
  "hover:bg-gray-100 hover:text-dark dark:hover:bg-[#FFFFFF1A] dark:hover:text-white";

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string })
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const combinedClassName = `${baseStyles} ${
    props.isActive ? activeStyles : inactiveStyles
  } ${props.className || ""}`;

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={`${combinedClassName} relative block py-2`}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={`${combinedClassName} flex w-full items-center gap-3 py-3`}
    >
      {props.children}
    </button>
  );
}

