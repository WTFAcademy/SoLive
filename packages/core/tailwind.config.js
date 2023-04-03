module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false, // 禁用基础样式（预设）
    container:false, // 禁用容器
  },
  important: "#solive-tailwind",
  theme: {
    extend: {},
  },
  plugins: [],
}
