import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
import { config as dotenvConfig } from 'dotenv';
import webPush from "web-push"

dotenvConfig();

export async function POST({ request }) {
  try {
    const subscription = await request.json();
    const vapidKeys = {
      publicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      privateKey: "hUf1juDtj3g0w7GZMYbfPZhZRTX7BgN3J8mmQhYeSJo"
    };
    console.log(vapidKeys)
    webPush.setVapidDetails(
      'mailto:farhan.naufaldy2811@gmail.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    const payload = JSON.stringify({ title: 'New Comment!', body: 'You got yourself a new comment on one of your post!' });
    webPush.sendNotification(subscription, payload).then(response => {
      console.log('Push notification sent:', response);   
    }).catch(error => {
      console.error('Error sending push notification:', error);
    });
    return json(subscription);
  } catch (error) {
    console.error('Error saving subscription:', error);
    return json({ success: false, error: 'Failed to save subscription' });
  }
}