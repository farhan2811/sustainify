import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export default defineConfig({
	plugins: [sveltekit()],
	define: {
	    'process.env.VITE_VAPID_PUBLIC_KEY': JSON.stringify(process.env.VITE_VAPID_PUBLIC_KEY),
	    'process.env.VAPID_PRIVATE_KEY': JSON.stringify(process.env.VAPID_PRIVATE_KEY)
	  }
});
