/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
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
			colors: {
				border: "var(--color-border)",
				input: "var(--color-input)",
				ring: "var(--color-ring)",
				background: "var(--color-background)",
				foreground: "var(--color-foreground)",
				primary: {
					DEFAULT: "var(--color-primary)",
					foreground: "var(--color-primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--color-secondary)",
					foreground: "var(--color-secondary-foreground)",
				},
				destructive: {
					DEFAULT: "var(--color-destructive)",
					foreground: "var(--color-destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--color-muted)",
					foreground: "var(--color-muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--color-accent)",
					foreground: "var(--color-accent-foreground)",
				},
				popover: {
					DEFAULT: "var(--color-popover)",
					foreground: "var(--color-popover-foreground)",
				},
				card: {
					DEFAULT: "var(--color-card)",
					foreground: "var(--color-card-foreground)",
				},
				// 42 Projects custom colors using CSS variables
				"42": {
					primary: "var(--color-42-primary)",
					secondary: "var(--color-42-secondary)",
					accent: "var(--color-42-accent)",
					highlight: "var(--color-42-highlight)",
					surface: "var(--color-42-surface)",
					"surface-variant": "var(--color-42-surface-variant)",
				},
			},
			borderRadius: {
				lg: "var(--radius-lg)",
				md: "var(--radius-md)",
				sm: "var(--radius-sm)",
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
				"fade-in": {
					from: { opacity: "0", transform: "translateY(10px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in": {
					from: { transform: "translateX(-100%)" },
					to: { transform: "translateX(0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"slide-in": "slide-in 0.3s ease-out",
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		function({ addUtilities }) {
			addUtilities({
				'.line-clamp-2': {
					display: '-webkit-box',
					'-webkit-line-clamp': '2',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
				},
			})
		}
	],
}
