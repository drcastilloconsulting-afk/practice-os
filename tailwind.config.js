/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                os: {
                    50:  '#EEF2FF',
                    100: '#C7D2FE',
                    200: '#A5B4FC',
                    300: '#818CF8',
                    400: '#6366F1',
                    500: '#4F46E5', // Primary indigo
                    600: '#4338CA',
                    700: '#3730A3',
                    800: '#312E81',
                    900: '#1E1B4B',
                },
                violet: {
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                },
                night: {
                    50:  '#1E2235',
                    100: '#181C2E',
                    200: '#131728',
                    300: '#0F1221',
                    400: '#0B0E1A',
                    500: '#080B15',
                    600: '#050710',
                },
                emerald: {
                    400: '#34D399',
                    500: '#10B981',
                },
                rose: {
                    400: '#FB7185',
                    500: '#F43F5E',
                },
                amber: {
                    400: '#FBBF24',
                    500: '#F59E0B',
                },
                text: {
                    primary:   '#F1F5F9',
                    secondary: '#94A3B8',
                    muted:     '#64748B',
                },
            },
            fontFamily: {
                sans:    ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
                mono:    ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                'os-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            },
            boxShadow: {
                'glass':    '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                'glow':     '0 0 24px rgba(79, 70, 229, 0.35)',
                'glow-v':   '0 0 24px rgba(139, 92, 246, 0.35)',
                'card':     '0 4px 20px rgba(0,0,0,0.3)',
            },
            animation: {
                'fade-in':   'fadeIn 0.4s ease-out',
                'slide-up':  'slideUp 0.4s ease-out',
                'slide-in':  'slideIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float':     'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                slideIn: { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
                float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
            },
        },
    },
    plugins: [],
};
