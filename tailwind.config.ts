import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ["var(--font-manrope)", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },
      fontSize: {
        // Design.md Typography Scale
        "heading-1": ["32px", { lineHeight: "1.5" }],
        "heading-2": ["24px", { lineHeight: "1.5" }],
        "heading-3": ["18px", { lineHeight: "1.5" }],
        "body-lg": ["16px", { lineHeight: "1.5" }],
        "body-base": ["14px", { lineHeight: "1.5" }],
        "body-sm": ["12px", { lineHeight: "1.5" }],
        "button-text": ["14px", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        tight: "-0.02em",
        normal: "0em",
        wide: "0.5px",
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        // Primary Blue - Trust, reliability
        primary: "#137fec",
        "primary-hover": "#1E88E5",
        "primary-light": "#E3F2FD",
        // Accent Orange - Energy and progress
        accent: "#FB8C00",
        "accent-light": "#FFE0B2",
        // Success Green - Growth, success, completion
        success: "#43A047",
        "success-light": "#E8F5E9",
        // Error Red - Errors, failed actions
        error: "#E53935",
        "error-light": "#FFEBEE",
        // Neutral Colors
        stroke: "#B0BEC5",
        "stroke-dark": "#616161",
        "neutral-light": "#F9FAFB",
        // Dark Base - Text and contrast zones
        dark: {
          DEFAULT: "#212121",
          2: "#424242",
          3: "#616161",
          4: "#757575",
          5: "#9E9E9E",
          6: "#BDBDBD",
          7: "#E0E0E0",
          8: "#F5F5F5",
        },
        gray: {
          DEFAULT: "#F9FAFB",
          dark: "#212121",
          1: "#F9FAFB",
          2: "#F5F5F5",
          3: "#E0E0E0",
          4: "#BDBDBD",
          5: "#9E9E9E",
          6: "#757575",
          7: "#616161",
        },
        // Extended color palette for variations
        blue: {
          DEFAULT: "#1565C0",
          dark: "#0D47A1",
          light: {
            DEFAULT: "#1E88E5",
            2: "#42A5F5",
            3: "#64B5F6",
            4: "#90CAF9",
            5: "#BBDEFB",
          },
        },
        orange: {
          DEFAULT: "#FB8C00",
          dark: "#E65100",
          light: {
            DEFAULT: "#FFA726",
            2: "#FFB74D",
            3: "#FFCC80",
            4: "#FFE0B2",
          },
        },
        green: {
          DEFAULT: "#43A047",
          dark: "#2E7D32",
          light: {
            DEFAULT: "#66BB6A",
            2: "#81C784",
            3: "#A5D6A7",
            4: "#C8E6C9",
            5: "#E8F5E9",
          },
        },
        red: {
          DEFAULT: "#E53935",
          dark: "#C62828",
          light: {
            DEFAULT: "#EF5350",
            2: "#F44336",
            3: "#FFCDD2",
            4: "#FFEBEE",
          },
        },
      },
      borderRadius: {
        button: "8px",
        card: "12px",
      },
      boxShadow: {
        card: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        "card-2": "0px 2px 6px rgba(0, 0, 0, 0.08)",
        "card-3": "0px 4px 12px rgba(0, 0, 0, 0.08)",
        "card-4": "0px 6px 16px rgba(0, 0, 0, 0.08)",
        "card-5": "0px 8px 20px rgba(0, 0, 0, 0.08)",
        "card-6": "0px 10px 24px rgba(0, 0, 0, 0.08)",
        "card-7": "0px 12px 28px rgba(0, 0, 0, 0.08)",
        "card-8": "0px 14px 32px rgba(0, 0, 0, 0.08)",
        "card-9": "0px 16px 36px rgba(0, 0, 0, 0.08)",
        "card-10": "0px 18px 40px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        linspin: "linspin 20s linear infinite",
        easespin: "easespin 20s ease-in-out infinite",
        rotating: "rotating 30s linear infinite",
        topbottom: "topbottom 4s ease-in-out infinite",
      },
      keyframes: {
        linspin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        easespin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        rotating: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        topbottom: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

