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
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	const create_user_state = {}
	const missions = [
	  {
	    id: 'reduce_electricity',
	    title: 'Reduce Electricity by 5%',
	    description: 'Reduce your home electricity usage by 5% this month compared to last month.',
	    category: 'Energy Efficiency',
	    points: 50,
	    goal: 0,
	    state: "finished"
	  },
	  {
	    id: 'reduce_vehicle_mileage',
	    title: 'Reduce Vehicle Mileage by 5%',
	    description: 'Reduce your vehicle mileage by 5% this month compared to last month.',
	    category: 'Transportation',
	    points: 50,
	    goal: 0,
	    state: "finished"
	  },
	  {
	    id: 'make_posts',
	    title: 'Make 3 Posts in Community',
	    description: 'Make 3 posts in the community this month.',
	    category: 'Community Engagement',
	    points: 30,
	    goal: 3,
	    state: "unfinished"
	  },
	  {
	    id: 'comment_on_posts',
	    title: 'Comment on 5 Other People Posts',
	    description: 'Comment on 5 posts from other people in the community this month.',
	    category: 'Community Engagement',
	    points: 25,
	    goal: 5,
	    state: "unfinished"
	  }
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

	const validateEmail = (email) => {
	    return emailRegex.test(email);
	}

	const validatePassword = (password) => {
	    return passwordRegex.test(password);
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
		  notification_count:0,
		  previous_month: monthNames[month]+"-"+year,
		  verified: "no"
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
		emailjs.init({
          publicKey: "Mxolr0cjEBnNbXvB1",
        });
	})

</script>

<svelte:head>
	<title>Register</title>
	<meta name="description" content="Register Page" />
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
						} else if (!validateEmail(email)) {
				            messageModal = 1;
				            messagePayload = "Please enter a valid email";
				        }
						 else if(full_name == "" || full_name == null) {
							messageModal = 1;
							messagePayload = "Please fill your full name";
						} else if(username == "" || username == null) {
							messageModal = 1;
							messagePayload = "Please fill your username";
						} else if(password == "" || password == null) {
							messageModal = 1;
							messagePayload = "Please fill your password";
						} else if (!validatePassword(password)) {
				            messageModal = 1;
				            messagePayload = "Password must be at least 8 characters long, contain at least one letter, one number, and one special character";
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
												let templateParams = {
												  link_recovery: `https://sustainify.vercel.app/email-verification?username=${username}`,
												  user_email: email,
												  reply_to: 'sustainify.auto@gmail.com'
												};
												 emailjs.send("service_irj4qaq","template_wahlsjr", templateParams).then(
												  (response) => {
												    console.log('SUCCESS!', response.status, response.text);
												  },
												  (error) => {
												    console.log('FAILED...', error);
												  },
												);
												messageModalSuccess = 1;
												messagePayload = "Registration successful. We've sent you an email to verify your account.";
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
</div>

<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad">
		<div class="w-100 h-10 flex flex-center-vertical page-top">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
					history.back();
				}}></i>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="bg-primary w-100 h-90 template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
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
						} else if (!validateEmail(email)) {
				            messageModal = 1;
				            messagePayload = "Please enter a valid email";
				        }
						 else if(full_name == "" || full_name == null) {
							messageModal = 1;
							messagePayload = "Please fill your full name";
						} else if(username == "" || username == null) {
							messageModal = 1;
							messagePayload = "Please fill your username";
						} else if(password == "" || password == null) {
							messageModal = 1;
							messagePayload = "Please fill your password";
						} else if (!validatePassword(password)) {
				            messageModal = 1;
				            messagePayload = "Password must be at least 8 characters long, contain at least one letter, one number, and one special character";
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
												let templateParams = {
												  link_recovery: `https://sustainify.vercel.app/email-verification?username=${username}`,
												  user_email: email,
												  reply_to: 'sustainify.auto@gmail.com'
												};
												 emailjs.send("service_irj4qaq","template_wahlsjr", templateParams).then(
												  (response) => {
												    console.log('SUCCESS!', response.status, response.text);
												  },
												  (error) => {
												    console.log('FAILED...', error);
												  },
												);
												messageModalSuccess = 1;
												messagePayload = "Registration successful. We've sent you an email to verify your account.";
												// setTimeout(goToLogin, 3000);
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
</div>
