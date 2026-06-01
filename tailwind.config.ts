import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
            './src/components/**/*.{js,ts,jsx,tsx,mdx}',
            './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // EconoLens brand colours
        brand: {
          navy:    '#1e3a5f',
          blue:    '#2563eb',
          light:   '#dbeafe',
          gold:    '#f59e0b',
          green:   '#16a34a',
          red:     '#dc2626',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'Georgia', 'serif'],
        mono:  ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
