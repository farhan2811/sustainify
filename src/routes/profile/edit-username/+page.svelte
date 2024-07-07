<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, deleteDoc, getDoc } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'

	let hidden_state = 0;
	let overflow = null;
	let old_username = null;
	let new_username = null;
	let confirm_username = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const goToProfile = () => {
		window.location.href = '/profile'
	}

	const setUserData = async (username) => {
		try {
			const oldDocRef = doc(frdb, "users", localStorage.getItem("username"));
  			const newDocRef = doc(frdb, "users", username);
  			const docSnapshot = await getDoc(oldDocRef);
		    const data = docSnapshot.data();
	
		    await setDoc(newDocRef, data);
		  
		    await deleteDoc(oldDocRef);

		    await localStorage.setItem("username", username)
		} catch(error) {
			console.log(error)
		}
	}

	onMount(async()=>{
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
	})

</script>

<svelte:head>
	<title>Edit Username</title>
	<meta name="description" content="Edit Username Page" />
</svelte:head>

{#if messageModal == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<button class="btn-modal w-100" on:click={() => {
					messageModal = 0
				}}>Close</button>
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

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 h-fit template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-primary">Enter Old Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="input old username.." bind:value={old_username}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-primary">Enter New Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="input new username.." bind:value={new_username}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-primary">Confirm New Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="confirm new username.." bind:value={confirm_username}>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-primary w-100" on:click={() => {
					if (old_username == "" || old_username == null) {
						messageModal = 1;
						messagePayload = "Please fill your old username";
					} else if(new_username == "" || new_username == null) {
						messageModal = 1;
						messagePayload = "Please fill your new username";
					} else if(confirm_username == "" || confirm_username == null) {
						messageModal = 1;
						messagePayload = "Please confirm your username";
					} else {
						if (old_username != localStorage.getItem("username")) {
							messageModal = 1;
							messagePayload = "Your old username is wrong";
						} else if(new_username != confirm_username) {
							messageModal = 1;
							messagePayload = "Your new username doesn't match";
						} else {
							setUserData(new_username);
							messageModalSuccess = 1;
							messagePayload = "Update username successful";
							setTimeout(goToProfile, 3000);
						}
					}
				}}>Update</button>
			</div>
		</div>
	</div>
</section>
