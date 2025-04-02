module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}', './src/pages/**/*.{js,ts,jsx,tsx,html}'],
    theme: {
        extend: {
            colors: {
                background: {
                    0: '#16325B',
                    1: '#227B94',
                    2: '#78B7D0',
                },
                text: '#ECECEE',
                subtext: '#C2C2C9',
                accent: '#FFDC7F',
            },
        },
    },
    plugins: [],
};