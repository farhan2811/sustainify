<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, deleteDoc, getDoc, updateDoc } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'

	let hidden_state = 0;
	let overflow = null;
	let old_email = null;
	let new_email = null;
	let confirm_email = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const goToProfile = () => {
		window.location.href = '/profile'
	}

	const setUserData = async (email) => {
		try {
			await updateDoc(doc(frdb, "users", localStorage.getItem("username")), {
				email: email
			})
			await localStorage.setItem("email", email)
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
	<title>Edit Email</title>
	<meta name="description" content="Edit Email Page" />
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
				<div class="head-input-primary">Enter Old Email</div>
				<input type="email" name="" class="input-field w-100" placeholder="input old email.." bind:value={old_email}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-primary">Enter New Email</div>
				<input type="email" name="" class="input-field w-100" placeholder="input new email.." bind:value={new_email}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-primary">Confirm New Email</div>
				<input type="email" name="" class="input-field w-100" placeholder="confirm new email.." bind:value={confirm_email}>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-primary w-100" on:click={() => {
					if (old_email == "" || old_email == null) {
						messageModal = 1;
						messagePayload = "Please fill your old email";
					} else if(new_email == "" || new_email == null) {
						messageModal = 1;
						messagePayload = "Please fill your new email";
					} else if(confirm_email == "" || confirm_email == null) {
						messageModal = 1;
						messagePayload = "Please confirm your email";
					} else {
						if (old_email != localStorage.getItem("email")) {
							messageModal = 1;
							messagePayload = "Your old email is wrong";
						} else if(new_email != confirm_email) {
							messageModal = 1;
							messagePayload = "Your new email doesn't match";
						} else {
							setUserData(new_email);
							messageModalSuccess = 1;
							messagePayload = "Update email successful";
							setTimeout(goToProfile, 3000);
						}
					}
				}}>Update</button>
			</div>
		</div>
	</div>
</section>
