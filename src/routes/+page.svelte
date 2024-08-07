<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, getDocs, getDoc, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition';

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let password = null;
	let profile_pic = null;
	let emails_list = [];
	let passwords_list = [];
	let usernames_list = [];
	let profile_pic_list = [];
	let verify_list = [];
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	// access the db collection
	const getUserIds = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users"));
	    const querySnapshot2 = await getDocs(collection(frdb, "users"));
	    const querySnapshot3 = await getDocs(collection(frdb, "users"));
	    const querySnapshot4 = await getDocs(collection(frdb, "users"));
	    const querySnapshot5 = await getDocs(collection(frdb, "users"));
	    querySnapshot1.forEach((doc) => 
	    	emails_list.push(doc.data().email)
	    );
	    querySnapshot2.forEach((doc) => 
	    	passwords_list.push(doc.data().password)
	    );
	    querySnapshot3.forEach((doc) => 
	    	usernames_list.push(doc.id)
	    );
	    querySnapshot4.forEach((doc) => 
	    	profile_pic_list.push(doc.data().profile_picture)
	    );
	      querySnapshot5.forEach((doc) => 
	    	verify_list.push(doc.data().verified)
	    );
	      console.log(emails_list)
	}

	const goToHome = () => {
		window.location.href = '/home'
	}

	const loginFlow = async () => {
		if (email == "" || email == null) {
			messageModal = 1;
			messagePayload = "Please fill your email";
		} else if(password == "" || password == null) {
			messageModal = 1;
			messagePayload = "Please fill your password";
		} else {
			for (var i = 0; i < emails_list.length; i++) {
				if (i != emails_list.length-1) {
					if (emails_list[i] == email || usernames_list[i] == email) {
						if (passwords_list[i] == password) {
							if (verify_list[i] == "yes") {
								messageModal = 0;
								localStorage.setItem("email", email);
								localStorage.setItem("username", usernames_list[i]);
								localStorage.setItem("profile_pic", profile_pic_list[i]);
								const userRef = await doc(frdb, 'users', usernames_list[i]);
			    				const getDataUser = await getDoc(userRef);
			    				localStorage.setItem("notification_count", getDataUser.data().notification_count);
								messageModalSuccess = 1;
								messagePayload = "Login successful";
								setTimeout(goToHome, 3000);
								break;
							} else {
								messageModal = 1;
								messagePayload = "Verify your email first";
								break;
							}
						} else {
							messageModal = 1;
							messagePayload = "Your email/username and password doesn't match";
							break;
						}
					}
				} else {
					if (emails_list[i] == email || usernames_list[i] == email) {
						if (passwords_list[i] == password) {
							if (verify_list[i] == "yes") {
								messageModal = 0;
								localStorage.setItem("email", email);
								localStorage.setItem("username", usernames_list[i]);
								localStorage.setItem("profile_pic", profile_pic_list[i]);
								const userRef = await doc(frdb, 'users', usernames_list[i]);
			    				const getDataUser = await getDoc(userRef);
			    				localStorage.setItem("notification_count", getDataUser.data().notification_count);
								messageModalSuccess = 1;
								messagePayload = "Login successful";
								setTimeout(goToHome, 3000);
								break;
							} else {
								messageModal = 1;
								messagePayload = "Verify your email first";
								break;
							}
						} else {
							messageModal = 1;
							messagePayload = "Your email/username and password doesn't match";
							break;
						}
					} else {
						messageModal = 1;
						messagePayload = "Your email/username and password doesn't match";
					}
				}
			}
		}
	}

	onMount(async () => {
		await getUserIds();
		overflow = isOverflowY(document.getElementById("form-login"))
		if (localStorage.getItem("email") != null) {
			if (localStorage.getItem("username") != null) {
				window.location.href = '/home'
			}
		}
	})
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login Page" />
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
	<section class="bg-primary vw-100 vh-100 flex flex-direction-col">
		<div class="vw-100 vh-25">
			<img src="{vector_login}" alt="" class="vw-100 h-100 img-login">
		</div>
		<div class="vw-100 {overflow == true ? "h-fit" : "mh-75"} bg-secondary login-form-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-center-vertical flex-gap-small">
				<div class="sub-header-login">Welcome to</div>
				<img src="{logo}" alt="header login image" class="header-login">
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-primary">Email/Username</div>
					<input type="text" name="" class="input-field w-100" placeholder="input email/username.." bind:value={email} on:keypress={(e) => { if (e.key === 'Enter') loginFlow(); }}>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-primary">Password</div>
					<input type="password" name="" class="input-field w-100" placeholder="input password.." bind:value={password} on:keypress={(e) => { if (e.key === 'Enter') loginFlow(); }}>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-primary w-100" on:click={() => {loginFlow()}}>Log In</button>
				<div class="flex flex-between-horizontal">
					<a href="/register" class="link-login">Sign Up</a>
					<a href="/forgot-password" class="link-login">Forgot Password</a>
				</div>
			</div>
		</div>
	</section>
</div>

<div class="desktop flex flex-center-horizontal">
	<section class="bg-primary w-30 vh-100 flex flex-direction-col">
		<div class="w-100 h-25">
			<img src="{vector_login}" alt="" class="w-100 h-100 img-login">
		</div>
		<div class="w-100 h-75 bg-secondary login-form-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-center-vertical flex-gap-small">
				<div class="sub-header-login">Welcome to</div>
				<img src="{logo}" alt="header login image" class="header-login">
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-primary">Email</div>
					<input type="text" name="" class="input-field w-100" placeholder="input email/username.." bind:value={email} on:keypress={(e) => { if (e.key === 'Enter') loginFlow(); }}>
				</div>
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-primary">Password</div>
					<input type="password" name="" class="input-field w-100" placeholder="input password.." bind:value={password} on:keypress={(e) => { if (e.key === 'Enter') loginFlow(); }}>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-primary w-100" on:click={() => {loginFlow()}}>Log In</button>
				<div class="flex flex-between-horizontal">
					<a href="/register" class="link-login">Sign Up</a>
					<a href="/forgot-password" class="link-login">Forgot Password</a>
				</div>
			</div>
		</div>
	</section>
</div>
