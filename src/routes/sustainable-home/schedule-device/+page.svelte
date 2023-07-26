<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import placeholder from '$lib/images/image-placeholder.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount, afterUpdate } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let device_name = null;
	let device_category = "Priority";
	let device_picture = null;
	let lamp_state = 0;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let realButton = null;
    let copyButton = null;
    let realButton2 = null;
    let copyButton2 = null;
    let imgReal = null;
    let on_hours = null;
    let off_hours = null;


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

	function readURLA(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            window.$('#img-device-preview').attr('src', e.target.result);
	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		realButton = document.querySelector("#real-time");
    	copyButton = document.querySelector("#subs-time");
    	realButton2 = document.querySelector("#real-time2");
    	copyButton2 = document.querySelector("#subs-time2");
    	if (copyButton) {
		     copyButton.addEventListener("click", function(event) {
		      realButton.click();
		    })
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

<Navbar pagePointer="sustainable-home"/>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 h-fit template-home-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">On Hours</div>
				<div class="flex w-100 flex-gap-regular">
					<input type="time" name="" id="on-hours" class="input-field w-50" on:change={() => {
						on_hours = document.querySelector('#on-hours').value;
						console.log(on_hours)
					}}>
					<div class="time-text flex flex-center-vertical flex-center-horizontal w-50" id="on-hour">
						{#if on_hours == null}
							Insert time
						{:else}
							{on_hours}
						{/if}
					</div>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Off Hours</div>
				<div class="flex w-100 flex-gap-regular">
					<input type="time" name="" id="off-hours" class="input-field w-50" on:change={() => {
						off_hours = document.querySelector('#off-hours').value;
						console.log(off_hours)
					}}>
					<div class="time-text flex flex-center-vertical flex-center-horizontal w-50" id="on-hour">
						{#if off_hours == null}
							Insert time
						{:else}
							{off_hours}
						{/if}
					</div>
				</div>
			</div>
			<div class="title-card-home">
				Priority Device
			</div>
			<div class="flex w-100 flex-between-horizontal flex-gap-semi-large">
				<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
					<div class="flex flex-center-vertical flex-center-horizontal">
						<img src="{lamp}" class="w-30">
					</div>
					<div class="title-device">LED Lamp</div>
					<div class="flex flex-between-horizontal">
						<input type="checkbox" name="" class="checkbox">
					</div>
				</div>
				<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
					<div class="flex flex-center-vertical flex-center-horizontal">
						<img src="{lamp}" class="w-30">
					</div>
					<div class="title-device">LED Lamp</div>
					<div class="flex flex-between-horizontal">
						<input type="checkbox" name="" class="checkbox">
					</div>
				</div>
			</div>
			<div class="title-card-home">
				Non-Priority Device
			</div>
			<div class="flex w-100 flex-between-horizontal flex-gap-semi-large">
				<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
					<div class="flex flex-center-vertical flex-center-horizontal">
						<img src="{lamp}" class="w-30">
					</div>
					<div class="title-device">LED Lamp</div>
					<div class="flex flex-between-horizontal">
						<input type="checkbox" name="" class="checkbox">
					</div>
				</div>
				<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
					<div class="flex flex-center-vertical flex-center-horizontal">
						<img src="{lamp}" class="w-30">
					</div>
					<div class="title-device">LED Lamp</div>
					<div class="flex flex-between-horizontal">
						<input type="checkbox" name="" class="checkbox">
					</div>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100">Set Schedule</button>
			</div>
		</div>
	</div>
</section>
