<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import carbon_footprint from '$lib/images/carbon-footprint.jpeg';
	import carbon_footprint2 from '$lib/images/carbon-footprint2.jpeg';
	import carbon_footprint3 from '$lib/images/carbon-footprint3.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, getDoc, collection, query, where, orderBy } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	import ApiController from '../../ApiController'
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
	let notifModal = 0;
	let new_notif_count = 0
	let old_notif_count = 0
	let notifList = [];
	let device_switcher = 0;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getNotificationCount = async () => {
		const userRef = await doc(frdb, 'users', localStorage.getItem("username"));
	    const getDataUser = await getDoc(userRef);
	    old_notif_count = localStorage.getItem("notification_count");
	    new_notif_count = getDataUser.data().notification_count;
	} 

	const getNotificationList = async() => {
		const notifCollection = collection(frdb, 'notifications');
	    const notifQuery = query(notifCollection, where('user_id', '==', localStorage.getItem("username")), orderBy('timestamp', 'desc'));
	    const snapshot = await getDocs(notifQuery);
	    notifList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	    console.log(notifList)
	}

	const setNotifCount = async () => {
		localStorage.setItem("notification_count", new_notif_count);
		if (device_switcher == 0) {
			document.getElementById("red-dot1").style.display = "none"
		} else {
			document.getElementById("red-dot1").style.display = "none"
		}
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
	    console.log(missions_list)
	    missions_list_sorted = missions_list.sort((a,b)=>{
	    	if ( a.state < b.state ){
			    return -1;
			}
			if ( a.state > b.state ){
			    return 1;
			}
			return 0;
	    })
	    missions_list_sorted.reverse()
	    missions_loaded = true;
	}

	const subscribeNotif = async (user_id) => {
	    try {
	        const response = await ApiController({
	            method: "GET",
	            endpoint: `api/get-public-key`
	        });

	        const publicKey = response.data.publicKey;

	        console.log(response)

	        if ('serviceWorker' in navigator && 'PushManager' in window) {
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

	onMount(async() => {
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		await subscribeNotif(localStorage.getItem("username"))
		await getNotificationCount();
		await getNotificationList();
		await getUserMonthYear()
		await getMissions();
	})

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Home Page" />
</svelte:head>

{#if notifModal == 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						notifModal = 0
					}}></i>
					<div class="title-notif">Notifications</div>
				</div>
				<div class="flex flex-direction-col flex-gap-regular h-90 notif-scroll">
					{#each notifList as item, index}
						<a href="{item.page_url}" class="no-decoration">
							<div class="flex flex-direction-col flex-gap-small notif-border">
								<div class="notif-message">{item.message}</div>
								<div class="notif-timestamp">{item.timestamp}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						notifModal = 0
					}}></i>
					<div class="title-notif">Notifications</div>
				</div>
				<div class="flex flex-direction-col flex-gap-regular h-90 notif-scroll">
					{#each notifList as item, index}
						<a href="{item.page_url}" class="no-decoration">
							<div class="flex flex-direction-col flex-gap-small notif-border">
								<div class="notif-message">{item.message}</div>
								<div class="notif-timestamp">{item.timestamp}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
{/if}


<div class="mobile">
	<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
		<Navbar pagePointer="home"/>
		<div class="vw-100 h-10 flex flex-direction-col page-top">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<div class="notif-icon flex flex-center-vertical" on:click={() => {
					if (notifModal == 0) {
						notifModal = 1
						device_switcher = 0;
						setNotifCount();
					} else {
						notifModal = 0
					}
				}}>
					<i class="fa-solid fa-bell arrow-back"></i>
					{#if old_notif_count < new_notif_count}
						<div class="small-red-dot"  id="red-dot1"></div>
					{/if}
				</div>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="vw-100 vh-37 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home">
			<img src="{logo}" alt="header login image" class="header-login">
			<div class="sub-home">Sustainable life for you and for me</div>
		</div>
		<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large missions-home">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="title-card-home">
					What is carbon footprint? 
				</div>
				<img src="{carbon_footprint}" class="w-100 rounded-20">
				<div class="desc-home">A carbon footprint is the total amount of greenhouse gases, primarily carbon dioxide (CO2), that are emitted directly or indirectly by human activities. It is typically measured in units of carbon dioxide equivalents (CO2e), which account for the different global warming potentials of various greenhouse gases. Understanding and managing one's carbon footprint is crucial for reducing the overall impact on climate change.</div>
				<div class="title-card-home">
					Components of carbon footprint
				</div>
				<img src="{carbon_footprint2}" class="w-100 rounded-20">
				<div class="desc-home">A carbon footprint includes emissions from several sources. Energy use covers electricity and heating in buildings. Transportation involves emissions from vehicles. Food production, transport, and waste contribute significantly, with meat and dairy having higher footprints than plants. Goods and services include consumer products and services like healthcare and education. Waste management releases greenhouse gases from landfills.</div>
				<div class="title-card-home">
					Why do we need to reduce carbon footprint?
				</div>
				<img src="{carbon_footprint3}" class="w-100 rounded-20">
				<div class="desc-home">Reducing carbon emissions plays a crucial role in climate change mitigation by slowing the rate of global warming and lessening its adverse effects. It also promotes resource conservation, ensuring more sustainable use of natural resources. Additionally, cutting energy use and waste yields economic benefits, including cost savings for individuals, businesses, and governments. Furthermore, decreasing pollution enhances air quality and public health.</div>
			</div>
		</div>
	</section>
</div>

<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad relative">
		<Navbar pagePointer="home"/>
		<div class="w-100 h-10 flex flex-center-vertical page-top missions-home">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<div class="notif-icon flex flex-center-vertical" on:click={() => {
					if (notifModal == 0) {
						notifModal = 1
						device_switcher = 1;
						setNotifCount();
					} else {
						notifModal = 0
					}
				}}>
					<i class="fa-solid fa-bell arrow-back"></i>
					{#if old_notif_count < new_notif_count}
						<div class="small-red-dot"  id="red-dot2"></div>
					{/if}
				</div>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="w-100 h-30 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home missions-home">
			<img src="{logo}" alt="header login image" class="header-login">
			<div class="sub-home">Sustainable life for you and for me</div>
		</div>
		<div class="bg-primary w-100 card-bg template-home-bg flex flex-direction-col flex-gap-semi-large missions-home">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="title-card-home">
					What is carbon footprint? 
				</div>
				<img src="{carbon_footprint}" class="w-100 rounded-20">
				<div class="desc-home">A carbon footprint is the total amount of greenhouse gases, primarily carbon dioxide (CO2), that are emitted directly or indirectly by human activities. It is typically measured in units of carbon dioxide equivalents (CO2e), which account for the different global warming potentials of various greenhouse gases. Understanding and managing one's carbon footprint is crucial for reducing the overall impact on climate change.</div>
				<div class="title-card-home">
					Components of carbon footprint
				</div>
				<img src="{carbon_footprint2}" class="w-100 rounded-20">
				<div class="desc-home">A carbon footprint includes emissions from several sources. Energy use covers electricity and heating in buildings. Transportation involves emissions from vehicles. Food production, transport, and waste contribute significantly, with meat and dairy having higher footprints than plants. Goods and services include consumer products and services like healthcare and education. Waste management releases greenhouse gases from landfills.</div>
				<div class="title-card-home">
					Why do we need to reduce carbon footprint?
				</div>
				<img src="{carbon_footprint3}" class="w-100 rounded-20">
				<div class="desc-home">Reducing carbon emissions plays a crucial role in climate change mitigation by slowing the rate of global warming and lessening its adverse effects. It also promotes resource conservation, ensuring more sustainable use of natural resources. Additionally, cutting energy use and waste yields economic benefits, including cost savings for individuals, businesses, and governments. Furthermore, decreasing pollution enhances air quality and public health.</div>
			</div>
			<!-- <div class="w-100 flex flex-direction-col flex-gap-semi-large  {missions_loaded == true ? "h-fit" : "vh-75"} flex-center-vertical {missions_loaded == false ? "flex-center-horizontal" : "flex-center-vertical"}">
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
					<img src="{loading}" class="w-30" alt="">
				{/if}
			</div> -->
		</div>
	</section>
</div>
