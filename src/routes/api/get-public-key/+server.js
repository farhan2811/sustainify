import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export async function GET({request}) {	
try {
    return json({
      publicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });
  } catch (error) {
    console.error('Error checking updates:', error);
    return json({
      status: 500,
      body: { error: 'Internal Server Error' }
    });
  }
}