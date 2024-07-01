import { writable } from 'svelte/store';

// Create a writable store for the username
export const username = writable(null);