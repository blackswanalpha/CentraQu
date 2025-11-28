import type { SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;

/**
 * Revenue Icon - Dollar sign in a circle
 */
export function RevenueIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c0 .83-.67 1.5-1.5 1.5H12v2h-2v-2H9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5H11V9h2v2h1.5c.83 0 1.5.67 1.5 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Audits Icon - Checkmark in a circle
 */
export function AuditsIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Invoices Icon - Document with lines
 */
export function InvoicesIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-8-6z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M14 2v6h6M9 13h6M9 17h6M9 9h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * License Icon - Shield with checkmark
 */
export function LicenseIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Utilization Icon - Gauge/meter
 */
export function UtilizationIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="currentColor"
      />
      <path
        d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Quality Icon - Star
 */
export function QualityIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21 12 17.27z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Satisfaction Icon - Smiley face
 */
export function SatisfactionIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Billed Icon - Receipt
 */
export function BilledIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.44-.53-1.25-.58-1.78-.15-.53.44-.58 1.25-.15 1.78l3 3.67c.25.31.61.5 1.02.5.4 0 .77-.19 1.02-.5l4-5.15c.44-.53.39-1.34-.15-1.78-.53-.44-1.34-.39-1.78.15z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Collected Icon - Wallet
 */
export function CollectedIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-1h18zM19 3H5c-1.1 0-2 .9-2 2v12h18V5c0-1.1-.9-2-2-2zm0 11h-8v-2h8v2z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Accounts Receivable Icon - Chart
 */
export function ARIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Completion Icon - Flag
 */
export function CompletionIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14.4 14.67l2.41 2.41 4.8-8.04L19.6 7l-5.2 7.67z"
        fill="currentColor"
      />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}

/**
 * Performance Icon - Trending up
 */
export function PerformanceIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18 9.41 12l4 4 6.3-6.29L21 12v-6z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Certification Icon - Badge
 */
export function CertificationIcon(props: SVGPropsType) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.44-.53-1.25-.58-1.78-.15-.53.44-.58 1.25-.15 1.78l3 3.67c.25.31.61.5 1.02.5.4 0 .77-.19 1.02-.5l4-5.15c.44-.53.39-1.34-.15-1.78-.53-.44-1.34-.39-1.78.15z"
        fill="currentColor"
      />
    </svg>
  );
}

