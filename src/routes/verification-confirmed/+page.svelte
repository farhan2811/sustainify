<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb, strg, rldb} from "$lib/firebaseConfig.js";
	import { getDatabase, ref as ref_database , update, set, onValue, remove } from 'firebase/database';
	import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import { writable } from 'svelte/store';
	import {fly, scale} from 'svelte/transition';

	let hidden_state = 0;
	let overflow = null;
	let new_password = null;
	let confirm_new_password = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let username_list = [];
	let email_list = [];
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];

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
		  password: password,
		  points: 0,
		  profile_picture: "https://firebasestorage.googleapis.com/v0/b/sustainify-67c1e.appspot.com/o/profile_images%2Fdummy-profile.png?alt=media&token=954cfca5-fdbc-49cd-9477-c172b6202f62",
		  post_count: 0,
		  comment_count: 0,
		  previous_month: monthNames[month]+"-"+year
		});
		await setDoc(doc(frdb, "users", username, "missions", "mission_1"), missions[0])
		await setDoc(doc(frdb, "users", username, "missions", "mission_2"), missions[1])
		await setDoc(doc(frdb, "users", username, "missions", "mission_3"), missions[2])
		await setDoc(doc(frdb, "users", username, "missions", "mission_4"), missions[3])
		create_user_state[`devices/${username}/status`] = "unsuspended";
		update(ref_database(rldb), create_user_state)
	}

	const goToLogin = () => {
		window.location.href = '/'
	}

	onMount(async() => {
		getUserIds();
	})

</script>

<svelte:head>
	<title>Verification Confirmed</title>
	<meta name="description" content="Verification Confirmed Page" />
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
		<div class="flex flex-end-horizontal flex-center-vertical">
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 vh-100 template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
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
				<button class="btn-secondary w-100">Change Password</button>
			</div>
		</div>
	</div>
</section>
