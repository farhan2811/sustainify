<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

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

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
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
		<div class="sub-home">Last Month Carbon Footprint</div>
		<div class="carbon-count">3321 Kg CO2</div>
		<div class="sub-home">Emission Level : <span class="carbon-level">Average</span></div>
	</div>
	<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
		<div class="title-card-home">
			Your Missions 
		</div>
		<div class="card card-mission w-100">
			<div class="flex flex-center-vertical flex-gap-semi-large">
				<i class="fa-solid fa-star star-missions"></i>
				<div class="flex flex-direction-col flex-gap-semi-small">
					<div class="mission-title">Reduce this month carbon emission by 10%</div>
					<div class="mission-points">5 pts</div>
				</div>
			</div>
		</div>
		<div class="card card-mission w-100">
			<div class="flex flex-center-vertical flex-gap-semi-large">
				<i class="fa-solid fa-star star-missions"></i>
				<div class="flex flex-direction-col flex-gap-semi-small">
					<div class="mission-title">Reduce this month carbon emission by 10%</div>
					<div class="mission-points">5 pts</div>
				</div>
			</div>
		</div>
		<div class="card card-mission w-100">
			<div class="flex flex-center-vertical flex-gap-semi-large">
				<i class="fa-solid fa-star star-missions"></i>
				<div class="flex flex-direction-col flex-gap-semi-small">
					<div class="mission-title">Reduce this month carbon emission by 10%</div>
					<div class="mission-points">5 pts</div>
				</div>
			</div>
		</div>
		<div class="card card-mission w-100">
			<div class="flex flex-center-vertical flex-gap-semi-large">
				<i class="fa-solid fa-star star-missions"></i>
				<div class="flex flex-direction-col flex-gap-semi-small">
					<div class="mission-title">Reduce this month carbon emission by 10%</div>
					<div class="mission-points">5 pts</div>
				</div>
			</div>
		</div>
		<div class="card card-mission w-100">
			<div class="flex flex-center-vertical flex-gap-semi-large">
				<i class="fa-solid fa-star star-missions"></i>
				<div class="flex flex-direction-col flex-gap-semi-small">
					<div class="mission-title">Reduce this month carbon emission by 10%</div>
					<div class="mission-points">5 pts</div>
				</div>
			</div>
		</div>
	</div>
</section>
