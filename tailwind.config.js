/** @type {import('tailwindcss').Config} */

const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
              'turtle-green': '#6e823a',
            },
          }
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "src/tailwind.css",
                    to: "./",
                },
            ],
        })
    ]
}