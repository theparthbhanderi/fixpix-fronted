/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // iOS System Colors
                ios: {
                    blue: {
                        DEFAULT: '#007AFF',
                        dark: '#0A84FF',
                    },
                    green: {
                        DEFAULT: '#34C759',
                        dark: '#30D158',
                    },
                    red: {
                        DEFAULT: '#FF3B30',
                        dark: '#FF453A',
                    },
                    orange: {
                        DEFAULT: '#FF9500',
                        dark: '#FF9F0A',
                    },
                    yellow: {
                        DEFAULT: '#FFCC00',
                        dark: '#FFD60A',
                    },
                    purple: {
                        DEFAULT: '#AF52DE',
                        dark: '#BF5AF2',
                    },
                    pink: {
                        DEFAULT: '#FF2D55',
                        dark: '#FF375F',
                    },
                    teal: {
                        DEFAULT: '#5AC8FA',
                        dark: '#64D2FF',
                    },
                    indigo: {
                        DEFAULT: '#5856D6',
                        dark: '#5E5CE6',
                    },
                    // Brand Colors
                    twitter: '#1DA1F2',
                    facebook: '#4267B2',
                    linkedin: '#0077B5',
                },
                // Semantic colors mapped to CSS variables
                primary: {
                    DEFAULT: 'rgb(var(--ios-accent) / <alpha-value>)',
                },
                background: 'rgb(var(--ios-bg) / <alpha-value>)',
                'background-secondary': 'rgb(var(--ios-bg-secondary) / <alpha-value>)',
                'background-tertiary': 'rgb(var(--ios-bg-tertiary) / <alpha-value>)',
                surface: 'rgb(var(--ios-surface) / <alpha-value>)',
                'surface-secondary': 'rgb(var(--ios-surface-secondary) / <alpha-value>)',

                // Text colors
                'text-main': 'rgb(var(--ios-label) / <alpha-value>)',
                'text-secondary': 'rgb(var(--ios-label-secondary) / <alpha-value>)',
                'text-tertiary': 'rgb(var(--ios-label-tertiary) / <alpha-value>)',
                'text-quaternary': 'rgb(var(--ios-label-quaternary) / <alpha-value>)',

                // Separator & Fill
                separator: 'rgb(var(--ios-separator) / <alpha-value>)',
                'separator-opaque': 'rgb(var(--ios-separator-opaque) / <alpha-value>)',
                fill: 'rgb(var(--ios-fill) / <alpha-value>)',
                'fill-secondary': 'rgb(var(--ios-fill-secondary) / <alpha-value>)',
                'fill-tertiary': 'rgb(var(--ios-fill-tertiary) / <alpha-value>)',

                // Legacy support
                border: {
                    DEFAULT: 'rgb(var(--ios-separator) / <alpha-value>)',
                    light: 'rgb(var(--ios-separator-opaque) / <alpha-value>)',
                }
            },
            fontFamily: {
                sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            fontSize: {
                // iOS Typography Scale
                'ios-largetitle': ['34px', { lineHeight: '41px', letterSpacing: '0.37px', fontWeight: '700' }],
                'ios-title1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px', fontWeight: '700' }],
                'ios-title2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px', fontWeight: '700' }],
                'ios-title3': ['20px', { lineHeight: '25px', letterSpacing: '0.38px', fontWeight: '600' }],
                'ios-headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.4px', fontWeight: '600' }],
                'ios-body': ['17px', { lineHeight: '22px', letterSpacing: '-0.4px', fontWeight: '400' }],
                'ios-callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.3px', fontWeight: '400' }],
                'ios-subhead': ['15px', { lineHeight: '20px', letterSpacing: '-0.2px', fontWeight: '400' }],
                'ios-footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.1px', fontWeight: '400' }],
                'ios-caption1': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '400' }],
                'ios-caption2': ['11px', { lineHeight: '13px', letterSpacing: '0.06px', fontWeight: '400' }],
            },
            borderRadius: {
                'ios-sm': '8px',
                'ios': '10px',
                'ios-md': '12px',
                'ios-lg': '14px',
                'ios-xl': '16px',
                'ios-2xl': '20px',
                'ios-3xl': '24px',
                'pill': '9999px',
            },
            boxShadow: {
                'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
                'ios': '0 2px 8px rgba(0, 0, 0, 0.12)',
                'ios-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
                'ios-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
                'ios-card': '0 0 0 0.5px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.08)',
            },
            spacing: {
                'ios-inset': '16px',
                'ios-gutter': '20px',
            },
            transitionTimingFunction: {
                'ios': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            transitionDuration: {
                'ios': '300ms',
                'ios-fast': '200ms',
            },
        },
    },
    plugins: [],
}
