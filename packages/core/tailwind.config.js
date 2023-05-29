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
        100: "#94A3B8", // 普通文字色
        300: "#3F5E7A", // 按钮色
        400: "#334155", // nav 背景色
        500: "#64748B4d", // 线条色
        700: "#1E293B", // 背景主色
      },
      info: {
        500: "#91D1F7"  // 选中文字色
      },
      red: {
        500: "#F56565", // 警告色
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
