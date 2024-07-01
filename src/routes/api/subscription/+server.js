import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export async function POST({ request }) {
  try {
    const subscription = await request.json();
    const ref = doc(frdb, "users", subscription.user_id)
    const subscriptionObject = JSON.parse(subscription.subscription_credentials);
    await setDoc(ref, subscriptionObject, {merge:true})
    return json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return json({ success: false, error: 'Failed to save subscription' });
  }
}