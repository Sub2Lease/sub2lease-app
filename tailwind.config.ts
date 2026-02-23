import animate from "tailwindcss-animate";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'DM Sans Variable'", ...defaultTheme.fontFamily.sans],
        serif: ["'DM Serif Display'", ...defaultTheme.fontFamily.serif],
        montserrat: ["'Montserrat'", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        mobile: { max: "1024px" },
        "wide-screen": { min: "2200px" },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        forestgreen: "hsl(var(--forest-green))",
        orangeweb: "hsl(var(--orange-web))",
        grey: "hsl(var(--grey))",
        lightergrey: "hsl(var(--lighter-grey))",
        "neon-green": "hsl(var(--neon-green))",
        "dark-green": "hsl(var(--dark-green))",
        "ninja-black": "hsl(var(--ninja-black))",
        "wise-white": "hsl(var(--wise-white))",
        "wise-gray": "hsl(var(--wise-gray))",
        "mint-cream": "hsl(var(--mint-cream))",
        "turtle-yellow": "hsl(var(--turtle-yellow))",
        "turtle-red": "hsl(var(--turtle-red))",
        "white-transparent": "hsla(var(--white-transparent))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          active: "hsl(var(--primary-active))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        20: "20px",
      },
      backgroundImage: {
        "white-gradient-border":
          "linear-gradient(175deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 41%, rgba(255, 255, 255, 0) 57%, rgba(255, 255, 255, 0.1) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spinner: {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        dash: {
          "0%": {
            strokeDasharray: "1, 150",
            strokeDashoffset: "0",
          },
          "50%": {
            strokeDasharray: "90, 150",
            strokeDashoffset: "-35",
          },
          "100%": {
            strokeDasharray: "90, 150",
            strokeDashoffset: "-124",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spinner: "spinner 2s linear infinite",
        dash: "dash 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
