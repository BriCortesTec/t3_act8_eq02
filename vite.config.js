import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


const BASE_PATH = '/t3_act8_eq02/';

export default defineConfig(({ command }) => ({
  plugins: [react()],

  base: command === 'build' ? BASE_PATH : '/t3_act8_eq02/',
}));
