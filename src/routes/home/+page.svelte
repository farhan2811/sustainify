<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, getDoc, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	import ApiController from '../../ApiController'
	// import webpush from 'web-push'
	// import {publicKey, privateKey} from '$lib/keysProduction.js'
	let month_year_list = [];
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let carbon_total;
	let carbon_level;
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let carbon_month = null;
	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let missions_list = [];
	let missions_list_sorted = [];
	let missions_loaded = false;
	let subscription_credentials;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getUserMonthYear = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	    querySnapshot1.forEach((doc) => 
	    	month_year_list.push(doc.id)
	    );
	    if (month_year_list.length != 0) {
	    	for (var i = 0; i < month_year_list.length; i++) {
	    	 	if (month_year_list[i] == monthNames[month]+"-"+year) {
		    		const carbon_data_snapshot = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year));
		    		carbon_total = carbon_data_snapshot.data().carbon_total	
		    		carbon_level = carbon_data_snapshot.data().carbon_level
		    	} else {
		    		carbon_total = "0"
		    		carbon_level = "None"
		    	}
		    }
	    } else {
	    	carbon_total = "0"
		    carbon_level = "None"
	    }
	}

	const getMissions = async() => {
		const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "missions"));
		querySnapshot1.forEach((doc) => 
	    	missions_list.push(doc.data())
	    );
	    missions_list_sorted = missions_list.sort((a,b)=>{
	    	a.state.localeCompare(b.state)
	    })

	    // for (var i = 0; i < missions_list.length; i++) {
	    // 	if (missions_list[i].state == "unfinished") {
	    // 		missions_list.unshift(missions_list[i])
	    // 	}
	    // }
	    missions_list_sorted.reverse()
	    missions_loaded = true;
	}

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
	// 	  password: password
	// 	});
	// }

	// const goToLogin = () => {
	// 	window.location.href = '/'
	// }

	// const requestPermission = () => {
	// 	Notification.requestPermission().then((result)=>{
	// 		if (result === "denied") {
	//           console.log("not allowed.");
	//           return;
	//         } else if (result === "default") {
	//           console.error("dialog closed.");
	//           return;
	//         }
	        
	//         new Notification("allowed.")
	// 		})
	// }

	const subscribeNotif = async (user_id) => {
	    try {
	        const response = await ApiController({
	            method: "GET",
	            endpoint: `api/get-public-key`
	        });

	        const publicKey = response.data.publicKey;

	        console.log(response)

	        if ('serviceWorker' in navigator && 'PushManager' in window) {
	        	alert("service worker is there")
	            const registration = await navigator.serviceWorker.getRegistration('/service-worker.js');

	            if (registration) {
	                const subscription = await registration.pushManager.subscribe({
	                    userVisibleOnly: true,
	                    applicationServerKey: urlBase64ToUint8Array(publicKey)
	                });
	                subscription_credentials = JSON.stringify(subscription)
	                await ApiController({
	                	method: "POST",
	                	endpoint: "api/subscription",
	                	datas: {subscription_credentials, user_id:user_id}
	                }).then((resp) => {
	                	console.log(resp)
	                })
	            } else {
	                console.warn('Service worker registration not found.');
	                alert("service worker is not there")
	            }
	        } else {
	            console.warn('Push notifications or service workers are not supported.');
	        }
	    } catch (error) {
	        console.error('Error subscribing to push notifications:', error);
	    }
	};


	function urlBase64ToUint8Array(base64String) {
	    const padding = '='.repeat((4 - base64String.length % 4) % 4);
	    const base64 = (base64String + padding)
	      .replace(/-/g, '+')
	      .replace(/_/g, '/');

	    const rawData = window.atob(base64);
	    const outputArray = new Uint8Array(rawData.length);

	    for (let i = 0; i < rawData.length; ++i) {
	      outputArray[i] = rawData.charCodeAt(i);
	    }
	    return outputArray;
	}

	const sendNotif = async () => {
		const ref = doc(frdb, "users", "cobadulu")
		const docSnap = await getDoc(ref)
		if (docSnap.exists()) {
	      await ApiController({
	        	method: "POST",
	        	endpoint: "api/sendNotif",
	        	datas: {endpoint: docSnap.data().endpoint, keys : {auth: docSnap.data().keys.auth, p256dh: docSnap.data().keys.p256dh}}
	        }).then((resp) => {
	        	console.log(resp)
	        })
	    } else {
	      console.log('No such document!');
	      return null;
	    }
	}

	onMount(async() => {
		
		// if("Notification" in window){
		// 	requestPermission();
		// }
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		await subscribeNotif(localStorage.getItem("username"))
		await getUserMonthYear()
		await getMissions();
	})

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Home Page" />
</svelte:head>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<Navbar pagePointer="home"/>
	<div class="vw-100 h-10 flex flex-direction-col page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-bell arrow-back"></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 vh-37 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home">
		{#if carbon_total && carbon_level}
			<div class="sub-home">This Month's Carbon Footprint</div>
			<div class="carbon-count">{carbon_total} Kg CO2</div>
			<div class="sub-home">Emission Level : 
				{#if carbon_level == "Low"}
					<span class="carbon-level-low">
						{carbon_level}
					</span>
				{:else if carbon_level == "Average"}
					<span class="carbon-level-average">
						{carbon_level}
					</span>
				{:else if carbon_level == "High"}
					<span class="carbon-level-high">
						{carbon_level}
					</span>
				{:else}
					<span class="carbon-level-low">
						None
					</span>
				{/if}
			</div>
		{:else}
			<img src="{loading}" class="w-30">
		{/if}
	</div>
	<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large missions-home">
		<button on:click={sendNotif}>test send notif</button>
		<div class="title-card-home">
			Monthly Missions 
		</div>
		<div class="w-100 flex flex-direction-col flex-gap-semi-large {missions_loaded == true ? "h-fit" : "vh-75"} flex-center-vertical {missions_loaded == false ? "flex-center-horizontal" : "flex-center-vertical"}">
			{#if missions_loaded != false}
				{#each missions_list_sorted as mission, index}
					<div class="card card-mission w-100 {mission.state == "finished" ? "disabled-card" : ""}">
						<div class="flex flex-center-vertical flex-gap-semi-large">
							<i class="fa-solid fa-star star-missions"></i>
							<div class="flex flex-direction-col flex-gap-semi-small">
								<div class="mission-title">{mission.title}</div>
								<div class="mission-points">{mission.points} pts</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<img src="{loading}" class="w-30">
			{/if}
		</div>
	</div>
</section>
