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

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let full_name = null;
	let username = null;
	let password = null;
	let confirm_password = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let username_list = [];
	let email_list = [];

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	// access the db collection
	const getUserIds = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users"));
	    const querySnapshot2 = await getDocs(collection(frdb, "users"));
	    querySnapshot1.forEach((doc) => 
	    	username_list.push(doc.id)
	    );
	    querySnapshot2.forEach((doc) => 
	    	email_list.push(doc.data().email)
	    );
	}

	const setUserData = async (email, full_name, username, password) => {
		await setDoc(doc(frdb, "users", username), {
		  email: email,
		  full_name: full_name,
		  password: password
		});
	}

	const goToLogin = () => {
		window.location.href = '/'
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
	<div class="modal-backdrop">
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
	<div class="modal-backdrop">
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
				<div class="head-input-secondary">Email</div>
				<input type="email" name="" class="input-field w-100" placeholder="input email.." bind:value={email}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Full Name</div>
				<input type="text" name="" class="input-field w-100" placeholder="input full name.." bind:value={full_name}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="input username.." bind:value={username}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Password</div>
				<input type="password" name="" class="input-field w-100" placeholder="input password.." bind:value={password}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Confirm Password</div>
				<input type="password" name="" class="input-field w-100" placeholder="input confirm password.." bind:value={confirm_password}>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100" on:click={() => {
					if (email == "" || email == null) {
						messageModal = 1;
						messagePayload = "Please fill your email";
					} else if(full_name == "" || full_name == null) {
						messageModal = 1;
						messagePayload = "Please fill your full name";
					} else if(username == "" || username == null) {
						messageModal = 1;
						messagePayload = "Please fill your username";
					} else if(password == "" || password == null) {
						messageModal = 1;
						messagePayload = "Please fill your password";
					} else if(confirm_password == "" || confirm_password == null) {
						messageModal = 1;
						messagePayload = "Please confirm your password";
					} else {
						if (password != confirm_password) {
							messageModal = 1;
							messagePayload = "Your password doesn't match";
						} else {
							for (var i = 0; i < username_list.length; i++) {
								if (username_list[i] == username) {
									messageModal = 1;
									messagePayload = "The username has been taken";
									break;
								} else if(i == username_list.length - 1) {
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
								}
							}
						}
					}
				}}>Sign Up</button>
			</div>
		</div>
	</div>
</section>
