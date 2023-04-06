module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  corePlugins: {
    preflight: false, // 禁用基础样式（预设）
    container:false, // 禁用容器
  },
  important: "#solive-tailwind",
  theme: {
    colors: {
      transparent: "transparent",
      white: "#fff",
      black: "#000",
      primary: {
        100: "#fff9f0",
        200: "#f2ece4",
        300: "#e6d4c1",
        400: "#d9b693",
        500: "#cc986a",
        600: "#be7945",
        700: "#995a2f",
        800: "#733d1e",
        900: "#4d2410",
      }
    },
    extend: {},
  },
  plugins: []
}
