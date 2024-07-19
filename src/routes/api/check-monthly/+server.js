import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection, getDoc, updateDoc } from "firebase/firestore"; 
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
          const missionRef = await doc(frdb, 'users', username, "missions", "mission_2");
          const userRef = await doc(frdb, 'users', username);
          const getDataMission = await getDoc(missionRef);
          const documentsCarbon = queryCarbon.docs;
          const documentsLengthCarbon = documentsCarbon.length;
          const documentsMission = queryMission.docs;
          const documentsLengthMission = documentsMission.length;
          let user_datas = documentsUser[i].data();
          console.log(username)
          if (documentsLengthCarbon == 0) {
           await updateDoc(missionRef, {
              goal: 0
            });
          } else if (documentsLengthCarbon == 1){
            console.log("masuk")
            for (var x = 0; x < documentsLengthCarbon; x++) {
              let carbon_data = documentsCarbon[x].data();
              await updateDoc(missionRef, {
                goal: carbon_data.vehicle_fuel
              });
            }
          } else {
            const getDataCarbon = await getDoc(collection(frdb, "users", username, "carbon-record", monthNames[month-1]+"-"+year));
            if (getDataCarbon.data().vehicle_fuel >= getDataMission.data().goal) {
              await updateDoc(missionRef, {
                goal: getDataCarbon.data().vehicle_fuel
              });
            } else {
              await updateDoc(userRef, {
                  points: increment(getDataMission.data().points)
              });
              await updateDoc(missionRef, {
                  state: "finished",
                  goal: getDataCarbon.data().vehicle_fuel
              });
              const notifCollection = collection(frdb, 'notifications');
                const notifId = doc(notifCollection).id;
                if (user_datas.endpoint != undefined) {
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
                  const payload = JSON.stringify({ title: 'Congratulations!', body: 'You just completed one of your missions!' });
                  webPush.sendNotification({endpoint: user_datas.endpoint, keys : {auth: user_datas.keys.auth, p256dh: user_datas.keys.p256dh}}, payload).then(response => {
                    console.log('Push notification sent:', response);   
                  }).catch(error => {
                    console.error('Error sending push notification:', error);
                  })
                }
                await setDoc(doc(notifCollection, notifId), {
                  user_id: username,
                  message: `You just completed one of your missions!`,
                  page_url: '/home',
                  timestamp : `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
                });
                await updateDoc(userRef, {
                  notification_count: increment(1)
               });
            }
          }
          console.log(documentsLengthMission)
          for (var j = 0; j < documentsLengthMission; j++) {
            let missionUpdateRef = await doc(frdb, 'users', username, "missions", documentsMission[j].id);
            await updateDoc(missionUpdateRef, {
                  state: "unfinished"
              });
            console.log("updated mission" + j)
          }
        }
     }
     return json({ success: true, error: 'succeed' });
  } catch (error) {
    console.log(error)
    return json({ success: false, error: 'failed' });
  }
}