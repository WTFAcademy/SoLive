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
        100: "#94A0B3", // 普通文字色
        300: "#3F5E7A", // 按钮色
        500: "#3C475B", // 线条色
        700: "#21293A", // 背景主色
      },
      info: {
        500: "#91D1F7"  // 选中文字色
      },
      other: {
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
