<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	import dummy_profile from '$lib/images/dummy-profile.png';

	let hidden_state = 0;
	let overflow = null;
	let email = null;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
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

	let logOut = () => {
			localStorage.removeItem("email");
			localStorage.removeItem("username");
			window.location.href = '/'
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		document.getElementById("profilePhoto").style.backgroundImage = `url(${dummy_profile})`
	})

</script>

<svelte:head>
	<title>Profile</title>
	<meta name="description" content="Profile Page" />
	<style type="text/css">
		#profilePhoto {
			width: 170px;
			height: 170px;
			background-size: cover;
		}
	</style>
</svelte:head>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<Navbar pagePointer="profile"/>
	<div class="vw-100 h-10 flex flex-direction-col page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-bell arrow-back"></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 vh-50 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home">
		<div class="rounded-image" id="profilePhoto"></div>
		<div class="username-display">@farhanaufaldy</div>
		<div class="name-display">Farhan Naufaldy</div>
	</div>
	<div class="bg-card-profile vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
		<div class="flex flex-between-horizontal flex-center-vertical w-100">
			<div class="title-card-profile">
				Settings
			</div>
			<div class="points-show">1528 pts</div>
		</div>
		<div class=" flex flex-direction-col flex-gap-semi-large">
			<a href="/profile/edit-username/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Username</button>
			</a>
			<a href="/carbon-emission/vehicle-tracker/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Email</button>
			</a>
			<a href="/carbon-emission/vehicle-tracker/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Password</button>
			</a>
			<a href="/carbon-emission/vehicle-tracker/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Edit Profile Picture</button>
			</a>
			<a href="/carbon-emission/vehicle-tracker/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal">Exchange Sustain Points</button>
			</a>	
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large flex-end-vertical">
			<button class="btn-secondary w-50 flex flex-gap-regular flex-center-vertical flex-center-horizontal" on:click={logOut}>Log Out</button>
		</div>	
	</div>
</section>
