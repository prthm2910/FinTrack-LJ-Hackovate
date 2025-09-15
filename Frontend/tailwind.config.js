/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#10b981',  // Your emerald green
                    600: '#059669',
                    700: '#047857',
                    900: '#064e3b'
                },
                secondary: {
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8'
                },
                accent: {
                    500: '#f59e0b',
                    600: '#d97706'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem'
            }
        },
    },
    plugins: [],
}
