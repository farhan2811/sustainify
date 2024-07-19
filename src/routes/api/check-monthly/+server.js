import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
import { config as dotenvConfig } from 'dotenv';
import webPush from "web-push"
let month_year_list = [];
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let dateObj = new Date();
let month = dateObj.getUTCMonth();
let day = dateObj.getUTCDate();
let year = dateObj.getUTCFullYear();
let currentMonthYear = ""

const getUserMonthYearBefore = async () => {
    // 
}

const getCurrentMonthYear = async () => {
     for (var i = 0; i < monthNames.length; i++) {
        currentMonthYear = monthNames[month]+"-"+year
     }
}

dotenvConfig();

export async function GET({ request }) {
  await getCurrentMonthYear();
  try {
     const queryUser = await getDocs(collection(frdb, 'users'));
     const documentsUser = queryUser.docs;
     const documentsLengthUser = documentsUser.length;

     if (documentsLengthUser > 0) {
        for (var i = 0; i < documentsLengthUser; i++) {
          let username = documentsUser[i].id
          const queryCarbon = await getDocs(collection(frdb, "users", username, "carbon-record"));
          const queryMission = await getDocs(collection(frdb, "users", username, "missions"));
          const documentsCarbon = queryCarbon.docs;
          const documentsLengthCarbon = documentsCarbon.length;
          let user_datas = documentsUser[i].data();
          if (user_datas.endpoint != undefined) {
            console.log(user_datas.endpoint)
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
            const payload = JSON.stringify({ title: 'test', body: `${currentMonthYear}` });
            webPush.sendNotification({endpoint: user_datas.endpoint, keys : {auth: user_datas.keys.auth, p256dh: user_datas.keys.p256dh}}, payload).then(response => {
              console.log('Push notification sent:', response);   
            }).catch(error => {
              console.error('Error sending push notification:', error);
            })
          }
          // const vapidKeys = {
          //   publicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
          //   privateKey: "hUf1juDtj3g0w7GZMYbfPZhZRTX7BgN3J8mmQhYeSJo"
          // };
          // console.log(subscription)
          // console.log(vapidKeys)
          // webPush.setVapidDetails(
          //   'mailto:farhan.naufaldy2811@gmail.com',
          //   vapidKeys.publicKey,
          //   vapidKeys.privateKey
          // );
          // const payload = JSON.stringify({ title: 'test', body: `${currentMonthYear}` });
          // webPush.sendNotification(subscription, payload).then(response => {
          //   console.log('Push notification sent:', response);   
          // }).catch(error => {
          //   console.error('Error sending push notification:', error);
          // });
          // return json(subscription);
          // if (DocumentsLengthCarbon > 0) {

          // }
        }
     }
     return json({ success: false, error: 'Failed to save subscription' });


      // const queryCarbon = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
      // const documentsCarbon = queryCarbon.docs;
      // const documentsLengthCarbon = documentsCarbon.length;

    // const subscription = await request.json();
    // const vapidKeys = {
    //   publicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    //   privateKey: "hUf1juDtj3g0w7GZMYbfPZhZRTX7BgN3J8mmQhYeSJo"
    // };
    // console.log(vapidKeys)
    // webPush.setVapidDetails(
    //   'mailto:farhan.naufaldy2811@gmail.com',
    //   vapidKeys.publicKey,
    //   vapidKeys.privateKey
    // );
    // const payload = JSON.stringify({ title: 'test', body: `${currentMonthYear}` });
    // webPush.sendNotification(subscription, payload).then(response => {
    //   console.log('Push notification sent:', response);   
    // }).catch(error => {
    //   console.error('Error sending push notification:', error);
    // });
    // return json(subscription);
  } catch (error) {
    return json({ success: false, error: 'Failed to save subscription' });
    // console.error('Error saving subscription:', error);
    // return json({ success: false, error: 'Failed to save subscription' });
  }
}