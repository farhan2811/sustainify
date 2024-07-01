import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {frdb, strg} from "$lib/firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 

export async function GET({request}) {	
try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    // Fetch new comments for the post from Firestore
    // const commentsSnapshot = await db.collection('comments')
    //   .where('post_id', '==', postId)
    //   .orderBy('timestamp', 'desc')
    //   .get();

    // const newComments = commentsSnapshot.docs.map(doc => doc.data());

    // Fetch new likes for the post from Firestore
    // const likesSnapshot = await db.collection('likes')
    //   .where('post_id', '==', postId)
    //   .orderBy('timestamp', 'desc')
    //   .get();

    // const newLikes = likesSnapshot.docs.map(doc => doc.data());

    // Perform actions based on new comments and likes
    // For example, send notifications

    // In this example, we'll just log the new comments and likes
    // console.log('New Comments:', newComments);
    // console.log('New Likes:', newLikes);

    return json({
      status: 200
      // body: {
      //   params: queryString
      // }
    });
  } catch (error) {
    console.error('Error checking updates:', error);
    return json({
      status: 500,
      body: { error: 'Internal Server Error' }
    });
  }
}