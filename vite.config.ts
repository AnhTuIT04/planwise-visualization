import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        './src/change-task-position.project.ts',
        './src/calendar-integration.project.ts',
        './src/change-task-status.project.ts',
      ],
    }),
    ffmpeg(),
  ],
});
