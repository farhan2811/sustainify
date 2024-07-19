<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, getDoc, updateDoc } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition';
	
	let email = "";
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;

	const sendEmail = async () => {
		const queryUser = await getDocs(collection(frdb, 'users'));
     	const documentsUser = queryUser.docs;
     	const documentsLengthUser = documentsUser.length;
     	if (documentsLengthUser > 0) {
        	for (var i = 0; i < documentsLengthUser; i++) {
        		 let username = documentsUser[i].id;
        		 let user_datas = documentsUser[i].data();
        		 if (i != documentsLengthUser-1) {
        		 	if (email == user_datas.email) {
	        		 	let templateParams = {
						  link_recovery: `http://localhost:5173/verification-confirmed?username=${username}`,
						  user_email: email,
						  reply_to: 'sustainify.auto@gmail.com'
						};
						 emailjs.send("service_irj4qaq","template_i3ydnnj", templateParams).then(
						  (response) => {
						    console.log('SUCCESS!', response.status, response.text);
						  },
						  (error) => {
						    console.log('FAILED...', error);
						  },
						);
						 messageModal = 1;
						 messagePayload = "Email has been sent! Check your inbox";
						 email='';
						 break;
	        		}
        		} else if(i == documentsLengthUser-1){
        			if (email == user_datas.email) {
	        		 	let templateParams = {
						  link_recovery: `https://sustainify.vercel.app/verification-confirmed?username=${username}`,
						  user_email: email,
						  reply_to: 'sustainify.auto@gmail.com'
						};
						 emailjs.send("service_irj4qaq","template_i3ydnnj", templateParams).then(
						  (response) => {
						    console.log('SUCCESS!', response.status, response.text);
						  },
						  (error) => {
						    console.log('FAILED...', error);
						  },
						);
						 messageModal = 1;
						 messagePayload = "Email has been sent! Check your inbox";
						 email='';
						 break;
	        		} else {
	        			messageModal = 1;
						messagePayload = "Please fill registered email";
	        		}
        		}
        	}
        }
	}

	onMount(async() => {
		emailjs.init({
          publicKey: "Mxolr0cjEBnNbXvB1",
        });
	})

</script>

<svelte:head>
	<title>Forgot Password</title>
	<meta name="description" content="Forgot Password Page" />
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
		<div class="bg-primary vw-100 vh-100 template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Email</div>
					<div class="head-input-accent">Input email registered to your account</div>
					<input type="email" name="" class="input-field w-100" placeholder="input email.." bind:value={email}>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
					<button class="btn-secondary w-100" on:click={() => {
						if (email == "" || email == null) {
							messageModal = 1;
							messagePayload = "Please fill your email";
						} else {
							sendEmail()
						}
					}}>Submit</button>
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
		<div class="bg-primary w-100 h-100 template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
			<div class="flex flex-direction-col flex-gap-semi-large">
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="head-input-secondary">Email</div>
					<div class="head-input-accent">Input email registered to your account</div>
					<input type="email" name="" class="input-field w-100" placeholder="input email.." bind:value={email}>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
					<button class="btn-secondary w-100" on:click={() => {
						if (email == "" || email == null) {
							messageModal = 1;
							messagePayload = "Please fill your email";
						} else {
							sendEmail()
						}
					}}>Submit</button>
				</div>
			</div>
		</div>
	</section>
</div>