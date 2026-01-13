/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "./index.html", // Added from updates
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "minimal-background": "hsl(var(--minimal-background))",
        "minimal-surface": "hsl(var(--minimal-surface))",
        "minimal-card": "hsl(var(--minimal-card))",
        "minimal-border": "hsl(var(--minimal-border))",
        "minimal-border-hover": "hsl(var(--minimal-border-hover))",
        "minimal-accent": "hsl(var(--minimal-accent))",
        "minimal-accent-foreground": "hsl(var(--minimal-accent-foreground))",
        "minimal-text-primary": "hsl(var(--minimal-text-primary))",
        "minimal-text-secondary": "hsl(var(--minimal-text-secondary))",
        "minimal-destructive": "hsl(var(--minimal-destructive))",
        "minimal-destructive-foreground": "hsl(var(--minimal-destructive-foreground))",
        "minimal-success": "hsl(var(--minimal-success))",
        "minimal-success-foreground": "hsl(var(--minimal-success-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        "vercel-bg": "#000000", // Added from updates
        "vercel-card-bg": "#111111", // Added from updates
        "vercel-text-primary": "#FFFFFF", // Added from updates
        "vercel-text-secondary": "#999999", // Lighter than #888 for better contrast on black, Added from updates
        "vercel-border": "#333333", // Added from updates
        "vercel-accent": "#FFFFFF", // Using white as accent for buttons/links for Vercel's minimal dark style, Added from updates
        "vercel-accent-hover": "#EAEAEA", // Added from updates
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "border-beam": { "100%": { "offset-distance": "100%" } },
        "pulse-glow": {
          "0%, 100%": { opacity: 0.7, boxShadow: "0 0 10px 2px hsl(var(--minimal-accent) / 0.5)" },
          "50%": { opacity: 1, boxShadow: "0 0 20px 5px hsl(var(--minimal-accent) / 0.7)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-beam": "border-beam calc(var(--duration) * 1s) infinite linear",
        "pulse-glow": "pulse-glow 3s infinite ease-in-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // Updated from updates
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.075em",
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.1em",
        wider: "0.2em",
        widest: "0.3em",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // The custom plugin for .alias-* classes has been removed.
  ],
}
