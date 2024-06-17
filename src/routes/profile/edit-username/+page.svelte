<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
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

	// access the db collection
	const getUserIds = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users"));
	    querySnapshot1.forEach((doc) => 
	    	username_list.push(doc.id)
	    );
	}

	const setUserData = async (username) => {
		await setDoc(doc(frdb, "users", username), {
		  email: email,
		  full_name: full_name,
		  password: password
		});
	}

	onMount(async() => {
		getUserIds();
	})

</script>

<svelte:head>
	<title>Register</title>
	<meta name="description" content="Register Page" />
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
	<div class="bg-primary vw-100 h-fit template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Enter Old Username</div>
				<input type="email" name="" class="input-field w-100" placeholder="input email.." bind:value={old_username}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Enter New Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="input full name.." bind:value={new_username}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Confirm New Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="input username.." bind:value={confirm_username}>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100" on:click={() => {
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
						if (new_username != confirm_username) {
							messageModal = 1;
							messagePayload = "Your new username doesn't match";
						} else {
							for (var i = 0; i < username_list.length; i++) {
								if (username_list[i] == old_username) {
									for (var i = 0; i < email_list.length; i++) {
										if (email_list[i] == email) {
											messageModal = 1;
											messagePayload = "The email has been registered";
											break;
										} else if(i == email_list.length - 1) {
											setUserData(email, full_name, username, password);
											messageModalSuccess = 1;
											messagePayload = "Registration successful";
											setTimeout(goToLogin, 3000);
										}
									}
								} else if (i == username_list.length - 1) {
									messageModal = 1;
									messagePayload = "The old username is incorrect";
									break;
								}
							}
						}
					}
				}}>Sign Up</button>
			</div>
		</div>
	</div>
</section>
