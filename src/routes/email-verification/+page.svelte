<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb, strg, rldb} from "$lib/firebaseConfig.js";
	import { getDatabase, ref as ref_database , update, set, onValue, remove } from 'firebase/database';
	import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
	import {doc, setDoc, getDocs, collection, getDoc, updateDoc } from "firebase/firestore"; 
	import { writable } from 'svelte/store';
	import {fly, scale} from 'svelte/transition';

	let hidden_state = 0;
	let overflow = null;
	let new_password = null;
	let confirm_new_password = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;

	const changeEmailStatus = async () => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		let userId = urlParams.get("username")
		const queryUser = await getDocs(collection(frdb, 'users'));
     	const documentsUser = queryUser.docs;
     	const documentsLengthUser = documentsUser.length;
     	if (documentsLengthUser > 0) {
        	for (var i = 0; i < documentsLengthUser; i++) {
        		messageModalSuccess = 1;
				messagePayload = "Email has been verified";
        		let username = documentsUser[i].id;
        		let user_datas = documentsUser[i].data();
        		if (username == userId) {
        			const userRef = await doc(frdb, 'users', userId);
				    await updateDoc(userRef, {
				        verified: "yes"
				    });
        		}
        		setTimeout(goToLogin, 3000);
        	}
        }

	}

	const goToLogin = () => {
		window.location.href = '/'
	}

	onMount(async() => {
		await changeEmailStatus();
	})

</script>

<svelte:head>
	<title>Email Verification</title>
	<meta name="description" content="Email Verification Page" />
</svelte:head>

{#if messageModal == 1}
<div class="mobile">
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
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-25 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<button class="btn-modal w-100" on:click={() => {
					messageModal = 0
				}}>Close</button>
			</div>
		</div>
	</div>
</div>
{/if}

{#if messageModalSuccess == 1}
<div class="mobile">
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
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-25 flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-direction-col flex-gap-semi-large flex-center-vertical">
					<div class="loading-text text-center">Please wait a moment</div>
					<img src="{loading}" class="w-30">
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

<div class="mobile">
	<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
		<div class="vw-100 h-10 flex flex-center-vertical page-top">
			<div class="flex flex-end-horizontal flex-center-vertical">
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<!-- <div class="bg-primary vw-100 vh-100 template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">New Password</div>
					<input type="password" name="" class="input-field w-100" placeholder="input password.." bind:value={new_password}>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Confirm New Password</div>
					<input type="password" name="" class="input-field w-100" placeholder="input confirm password.." bind:value={confirm_new_password}>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
					<button class="btn-secondary w-100" on:click={() => {
						if (new_password == "" || new_password == null) {
							messageModal = 1;
							messagePayload = "Please fill your new password";
						} else if (confirm_new_password == "" || confirm_new_password == null) {
							messageModal = 1;
							messagePayload = "Please confirm your new password";
						} else {
							if (new_password != confirm_new_password) {
								messageModal = 1;
								messagePayload = "Your password doesn't match";
							} else {
								changePassword()
							}
						}
					}}>Change Password</button>
				</div>
			</div>
		</div> -->
	</section>
</div>

<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad">
		<div class="w-100 h-10 flex flex-center-vertical page-top">
			<div class="flex flex-end-horizontal flex-center-vertical">
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<!-- <div class="bg-primary w-100 h-100 template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">New Password</div>
					<input type="password" name="" class="input-field w-100" placeholder="input password.." bind:value={new_password}>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Confirm New Password</div>
					<input type="password" name="" class="input-field w-100" placeholder="input confirm password.." bind:value={confirm_new_password}>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
					<button class="btn-secondary w-100" on:click={() => {
						if (new_password == "" || new_password == null) {
							messageModal = 1;
							messagePayload = "Please fill your new password";
						} else if (confirm_new_password == "" || confirm_new_password == null) {
							messageModal = 1;
							messagePayload = "Please confirm your new password";
						} else {
							if (new_password != confirm_new_password) {
								messageModal = 1;
								messagePayload = "Your password doesn't match";
							} else {
								changePassword()
							}
						}
					}}>Change Password</button>
				</div>
			</div>
		</div> -->
	</section>
</div>
