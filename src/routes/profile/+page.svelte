<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, getDoc,  query, where, orderBy } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	import dummy_profile from '$lib/images/dummy-profile.png';

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let name = "";
	let username = "";
	let points = "";
	let profile_pic = "";
	let profile_pic2 = "";
	let users = [];
	let notifModal = 0;
	let new_notif_count = 0
	let old_notif_count = 0
	let notifList = [];
	let device_switcher = 0;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getUserInfo = async () => {
		const querySnapshot3 = await getDoc(doc(frdb, "users", localStorage.getItem("username")));
		name = querySnapshot3.data().full_name;
		username = localStorage.getItem("username")
		points = querySnapshot3.data().points;
		profile_pic = localStorage.getItem("profile_pic");
		profile_pic2 = localStorage.getItem("profile_pic");
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

	let logOut = () => {
			localStorage.removeItem("email");
			localStorage.removeItem("username");
			localStorage.removeItem("profile_pic");
			localStorage.removeItem("notification_count");
			window.location.href = '/'
	}

	onMount(async() => {
		await getNotificationCount();
		await getNotificationList();
		await getUserInfo();
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		document.getElementById("profilePhoto").style.backgroundImage = `url(${profile_pic})`
		document.getElementById("profilePhoto2").style.backgroundImage = `url(${profile_pic2})`
	})

</script>

<svelte:head>
	<title>Profile</title>
	<meta name="description" content="Profile Page" />
	<style type="text/css">


		@media screen and (max-width: 1000px) {
			#profilePhoto {
				width: 170px;
				height: 170px;
				background-size: cover;
			}
		}
		@media screen and (min-width: 1001px) {
			#profilePhoto2 {
				width: 100px;
				height: 100px;
				background-size: cover;
			}
		}
	</style>
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
		<Navbar pagePointer="profile"/>
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
		<div class="vw-100 vh-50 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home">
			{#if profile_pic && username && name}
				<div class="rounded-image" id="profilePhoto"></div>
				<div class="username-display">@{username}</div>
				<div class="name-display">{name}</div>
			{:else}
				<img src="{loading}" class="w-30">
			{/if}
		</div>
		<div class="bg-card-profile vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
			<div class="flex flex-between-horizontal flex-center-vertical w-100">
				<div class="title-card-profile">
					Settings
				</div>
				<div class="points-show">{points} pts</div>
			</div>
			<div class=" flex flex-direction-col flex-gap-semi-large">
				<a href="/profile/my-posts" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">My Posts</button>
				</a>
				<a href="/profile/edit-username/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Username</button>
				</a>
				<a href="/profile/edit-email/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Email</button>
				</a>
				<a href="/profile/edit-password/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Password</button>
				</a>
				<a href="/profile/edit-profile-picture/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Profile Picture</button>
				</a>
				<a href="/profile/exchange-point/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Exchange Sustain Points</button>
				</a>	
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large flex-end-vertical">
				<button class="btn-secondary w-50 flex flex-gap-regular flex-center-vertical flex-center-horizontal" on:click={logOut}>Log Out</button>
			</div>	
		</div>
	</section>
</div>
<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad relative">
		<Navbar pagePointer="profile"/>
		<div class="w-100 h-10 flex flex-direction-col page-top missions-home">
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
						<div class="small-red-dot"  id="red-dot2"></div>
					{/if}
				</div>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="w-100 h-40 flex flex-direction-col flex-center-vertical flex-gap-semi-small carbon-status-home missions-home">
			{#if profile_pic && username && name}
				<div class="rounded-image" id="profilePhoto2"></div>
				<div class="username-display">@{username}</div>
				<div class="name-display">{name}</div>
			{:else}
				<img src="{loading}" class="w-30">
			{/if}
		</div>
		<div class="bg-card-profile w-100 {profile_pic && username && name ? "h-fit" : "h-75"} template-home-bg flex flex-direction-col flex-gap-large missions-home">
			<div class="flex flex-between-horizontal flex-center-vertical w-100">
				<div class="title-card-profile">
					Settings
				</div>
				<div class="points-show">{points} pts</div>
			</div>
			<div class=" flex flex-direction-col flex-gap-semi-large">
				<a href="/profile/my-posts" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">My Posts</button>
				</a>
				<!-- <a href="/profile/edit-username/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Username</button>
				</a> -->
				<a href="/profile/edit-email/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Email</button>
				</a>
				<a href="/profile/edit-password/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Password</button>
				</a>
				<a href="/profile/edit-profile-picture/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Profile Picture</button>
				</a>
				<a href="/profile/exchange-point/" class="no-decoration">
					<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Exchange Sustain Points</button>
				</a>	
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large flex-end-vertical">
				<button class="btn-secondary w-50 flex flex-gap-regular flex-center-vertical flex-center-horizontal" on:click={logOut}>Log Out</button>
			</div>	
		</div>
	</section>
</div>
