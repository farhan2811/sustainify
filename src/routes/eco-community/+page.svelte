<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import example from '$lib/images/example.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let lamp_state = 0;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;

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
	<title>Sustainable Home</title>
	<meta name="description" content="Sustainable Home Page" />
</svelte:head>


{#if messageModal == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-gap-regular w-100">
					<button class="btn-modal-danger w-50" on:click={() => {
					messageModal = 0
					}}>No</button>
					<button class="btn-modal w-50" on:click={() => {
					
					}}>Yes</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if messageModalSuccess == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-direction-col flex-gap-semi-large flex-center-vertical">
					<div class="loading-text text-center">Please wait a moment</div>
					<img src="{loading}" class="w-30">
				</div>
			</div>
		</div>
	</div>
{/if}

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad" >
	<Navbar pagePointer="eco-community"/>
	<div class="vw-100 h-10 flex flex-direction-col page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-bell arrow-back"></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 vh-15 flex flex-center-vertical flex-between-horizontal carbon-status-home">
		<div class="title-page-sh">Community</div>
		<a href="/eco-community/add-post" class="btn-add no-decoration">
			<i class="fa-solid fa-plus"></i>
		</a>
	</div>
	<div class="bg-primary vh-85 vh-75 card-bg template-home-bg flex flex-direction-col flex-gap-large">
		<a href="/eco-community/post-content" class="no-decoration">
			<div class="card-post w-100">
				<img src="{example}">
				<div class="card-body flex flex-direction-col flex-gap-semi-small">
					<div class="title-card">Carbon Emission</div>
					<div class="content-card">Near the end of 2020, as the covid-19 pandemic continued to rage, a few climate scientists and energy experts made a prediction. They estimated that emissions from fossil fuels... more</div>
					<div class="flex flex-gap-regular">
						<div class="flex flex-center-vertical">
							<i class="fa-regular fa-heart icon-post"></i>
							<div class="text-icon-post">537</div>
						</div>
						<div class="flex flex-center-vertical">
							<i class="fa-regular fa-comment icon-post"></i>
							<div class="text-icon-post">1.2K</div>
						</div>
					</div>
				</div>
			</div>
		</a>
	</div>
</section>
