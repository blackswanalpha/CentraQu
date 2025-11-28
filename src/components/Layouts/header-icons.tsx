import type { SVGProps } from "react";

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <circle cx="10" cy="10" r="5" />
      <line x1="10" y1="1" x2="10" y2="3" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="17" x2="10" y2="19" stroke="currentColor" strokeWidth="2" />
      <line x1="1" y1="10" x2="3" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="17" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="3.22" y1="3.22" x2="4.64" y2="4.64" stroke="currentColor" strokeWidth="2" />
      <line x1="15.36" y1="15.36" x2="16.78" y2="16.78" stroke="currentColor" strokeWidth="2" />
      <line x1="3.22" y1="16.78" x2="4.64" y2="15.36" stroke="currentColor" strokeWidth="2" />
      <line x1="15.36" y1="4.64" x2="16.78" y2="3.22" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.18 2.334a7.71 7.71 0 108.485 8.485A6.042 6.042 0 019.18 2.334z"
      />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function LogOutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function SettingsIconSmall(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  );
}

