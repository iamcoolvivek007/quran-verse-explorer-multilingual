
import type { Config } from "tailwindcss";

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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom Quran Explorer colors - Islamic theme
				quran: {
					primary: '#1e3a8a', // Deep blue
					secondary: '#f5b014', // Gold
					accent: '#10b981', // Green
					light: '#f8fafc', // Light background
					dark: '#1e293b', // Dark text
					gold: '#f5b014', // Gold accents
					cream: '#FDF6E3', // Light cream for backgrounds
					maroon: '#800000', // Maroon for accents
					parchment: '#fffcf0', // Parchment color
					royal: '#4B0082', // Royal purple
					sage: '#8D9440', // Sage green
					deepgold: '#B8860B', // Deeper gold
					indigo: '#4B0082', // Royal indigo
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'page-flip': {
					'0%': { transform: 'rotateY(0deg)', transformOrigin: 'left' },
					'100%': { transform: 'rotateY(-180deg)', transformOrigin: 'left' }
				},
				'gentle-float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'shine': {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'page-flip': 'page-flip 1.2s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards',
				'gentle-float': 'gentle-float 3s ease-in-out infinite',
				'shine': 'shine 3s linear infinite'
			},
			fontFamily: {
				arabic: ['Scheherazade New', 'Amiri', 'serif']
			},
			backgroundImage: {
				'islamic-pattern': "url('https://i.imgur.com/1JbVGJY.png')",
				'quran-ornament': "url('https://i.imgur.com/B3Kqkfz.png')",
				'paper-texture': "url('https://i.imgur.com/nSHYktj.png')",
				'islamic-corner': "url('https://i.imgur.com/TZvOgUi.png')",
				'islamic-border': "url('https://i.imgur.com/K3CTYtK.png')",
				'gold-texture': "linear-gradient(90deg, transparent, rgba(245,176,20,0.5), transparent)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
