<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb, strg} from "$lib/firebaseConfig.js";
	import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import { writable } from 'svelte/store';
	import {fly, scale} from 'svelte/transition';

	// let hidden_state = 0;
	// let overflow = null;
	// let email = null;
	// let full_name = null;
	// let username = null;
	// let password = null;
	// let confirm_password = null;
	// let messageModal = 0;
	// let messageModalSuccess = 0;
	// let messagePayload = null;
	// let username_list = [];
	// let email_list = [];
	// let dateObj = new Date();
	// let month = dateObj.getUTCMonth();
	// let day = dateObj.getUTCDate();
	// let year = dateObj.getUTCFullYear();
	// const monthNames = ["January", "February", "March", "April", "May", "June",
	//   "July", "August", "September", "October", "November", "December"
	// ];
	// const missions = [
	//   {
	//     id: 'reduce_electricity',
	//     title: 'Reduce Electricity by 5%',
	//     description: 'Reduce your home electricity usage by 5% this month compared to last month.',
	//     category: 'Energy Efficiency',
	//     points: 50,
	//     goal: 0,
	//     state: "finished"
	//   },
	//   {
	//     id: 'reduce_vehicle_mileage',
	//     title: 'Reduce Vehicle Mileage by 5%',
	//     description: 'Reduce your vehicle mileage by 5% this month compared to last month.',
	//     category: 'Transportation',
	//     points: 50,
	//     goal: 0,
	//     state: "finished"
	//   },
	//   {
	//     id: 'make_posts',
	//     title: 'Make 3 Posts in Community',
	//     description: 'Make 2 posts in the community this month.',
	//     category: 'Community Engagement',
	//     points: 30,
	//     goal: 3,
	//     state: "unfinished"
	//   },
	//   {
	//     id: 'comment_on_posts',
	//     title: 'Comment on 5 Other People Posts',
	//     description: 'Comment on 5 posts from other people in the community this month.',
	//     category: 'Community Engagement',
	//     points: 25,
	//     goal: 5,
	//     state: "unfinished"
	//   }
	// ];

	// function isOverflowY(element) {
	//   return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	// }

	// // access the db collection
	// const getUserIds = async () => {
	//     const querySnapshot1 = await getDocs(collection(frdb, "users"));
	//     const querySnapshot2 = await getDocs(collection(frdb, "users"));
	//     querySnapshot1.forEach((doc) => 
	//     	username_list.push(doc.id)
	//     );
	//     querySnapshot2.forEach((doc) => 
	//     	email_list.push(doc.data().email)
	//     );
	// }

	// const setUserData = async (email, full_name, username, password) => {
	// 	await setDoc(doc(frdb, "users", username), {
	// 	  email: email,
	// 	  full_name: full_name,
	// 	  password: password,
	// 	  points: 0,
	// 	  profile_picture: "https://firebasestorage.googleapis.com/v0/b/sustainify-67c1e.appspot.com/o/profile_images%2Fdummy-profile.png?alt=media&token=954cfca5-fdbc-49cd-9477-c172b6202f62",
	// 	  post_count: 0,
	// 	  comment_count: 0,
	// 	  previous_month: monthNames[month]+"-"+year
	// 	});
	// 	await setDoc(doc(frdb, "users", username, "missions", "mission_1"), missions[0])
	// 	await setDoc(doc(frdb, "users", username, "missions", "mission_2"), missions[1])
	// 	await setDoc(doc(frdb, "users", username, "missions", "mission_3"), missions[2])
	// 	await setDoc(doc(frdb, "users", username, "missions", "mission_4"), missions[3])
	// }

	// const goToLogin = () => {
	// 	window.location.href = '/'
	// }

	const setTest = async () => {
		await setDoc(doc(frdb, "tests", "test"), {
		  test: "test"
		});
	}

	onMount(async() => {
		// getUserIds();
		console.log("test")
		setTest();
	})

</script>


