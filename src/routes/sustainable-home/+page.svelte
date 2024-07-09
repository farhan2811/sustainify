<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {rldb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection,} from "firebase/firestore"; 
    import {ref, set, update } from "firebase/database"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let lamp_state = 0;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let D5_state = 0
	let D6_state = 0
	let D7_state = 0
	let D8_state = 0
	let D5 = 1
	let D6 = 1
	let D7 = 1
	let D8 = 1
	let updates1 = {};
	let updates2 = {};
	let updates3 = {};
	let updates4 = {};

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
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
				<div class="flex flex-gap-regular w-100">
					<button class="btn-modal-danger w-50" on:click={() => {
					messageModal = 0
					}}>No</button>
					<button class="btn-modal w-50" on:click={() => {
					
					}}>Yes</button>
				</div>
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
					<img src="{loading}" class="w-30" alt="">
				</div>
			</div>
		</div>
	</div>
{/if}

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad" >
	<Navbar pagePointer="sustainable-home"/>
	<div class="vw-100 h-10 flex flex-direction-col page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-bell arrow-back"></i>
			<img src="{logo}" alt="" class="w-50" alt="">
		</div>
	</div>
	<div class="vw-100 vh-25 flex flex-center-vertical flex-between-horizontal carbon-status-home">
		<div class="title-page-sh">Sustainable Home</div>
		<a href="/sustainable-home/add-device" class="btn-add no-decoration" aria-label="Add Button">
			<i class="fa-solid fa-plus"></i>
		</a>
	</div>
	<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
		<a href="/sustainable-home/schedule-device">
			<button class="btn-secondary w-100">Scheduling</button>
		</a>
		<div class="title-card-home">
			Priority Device
		</div>
		<div class="flex w-100 flex-between-horizontal flex-gap-semi-large">
			<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
				<div class="flex flex-center-vertical flex-center-horizontal">
					<img src="{lamp}" class="w-30" alt="">
				</div>
				<div class="title-device">Lampu Teras</div>
				<div class="flex flex-between-horizontal">
					<div class="switch-button flex">
						<div class="on-button {D5_state == 1 ? "on-button-active" : "on-button-inactive"} w-50 flex flex-center-vertical h-100" on:click={() => {
							if (D5 == 1) {
								D5 = 0
								D5_state = 1
								updates1["LED_STATUS"] = "OFF"
								if (D5 == 0) {
									update(ref(rldb), updates1)
								}
							}
						}}>
							<div class="icon-on"></div>
						</div>
						<div class="off-button {D5_state == 0 ? "off-button-active" : "off-button-inactive"} w-50 flex flex-center-vertical flex-end-horizontal h-100" on:click={() => {
							if (D5 == 0) {
								D5 = 1
								D5_state = 0
								updates1["LED_STATUS"] = "ON"
								if (D5 == 1) {
								  update(ref(rldb), updates1)
								}
							}
						}}>
							<div class="icon-off"></div>
						</div>
					</div>
					<div class="padding-right-setting">
						<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
							messageModal = 1;
							messagePayload = "Do you want to change this device to non-priority?"
						}}></i>
					</div>
				</div>
			</div>
			<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
				<div class="flex flex-center-vertical flex-center-horizontal">
					<img src="{lamp}" class="w-30" alt="">
				</div>
				<div class="title-device">Lampu RT</div>
				<div class="flex flex-between-horizontal">
					<div class="switch-button flex">
						<div class="on-button {D6_state == 1 ? "on-button-active" : "on-button-inactive"} w-50 flex flex-center-vertical h-100" on:click={() => {
							if (D6 == 1) {
								D6 = 0
								D6_state = 1
								updates1["LED_STATUS2"] = "OFF"
								if (D6 == 0) {
									update(ref(rldb), updates1)
								}
							}
						}}>
							<div class="icon-on"></div>
						</div>
						<div class="off-button {D6_state == 0 ? "off-button-active" : "off-button-inactive"} w-50 flex flex-center-vertical flex-end-horizontal h-100" on:click={() => {
							if (D6 == 0) {
								D6 = 1
								D6_state = 0
								updates2["LED_STATUS2"] = "ON"
								if (D6 == 1) {
									update(ref(rldb), updates2)
								}
							}
						}}>
							<div class="icon-off"></div>
						</div>
					</div>
					<div class="padding-right-setting">
						<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
							messageModal = 1;
							messagePayload = "Do you want to change this device to non-priority?"
						}}></i>
					</div>
				</div>
			</div>
		</div>
		<div class="title-card-home">
			Non-Priority Device
		</div>
		<div class="flex w-100 flex-between-horizontal flex-gap-semi-large">
			<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
				<div class="flex flex-center-vertical flex-center-horizontal">
					<img src="{lamp}" class="w-30" alt="">
				</div>
				<div class="title-device">Lampu KT1</div>
				<div class="flex flex-between-horizontal">
					<div class="switch-button flex">
						<div class="on-button {D7_state == 1 ? "on-button-active" : "on-button-inactive"} w-50 flex flex-center-vertical h-100" on:click={() => {
							if (D7 == 1) {
								D7 = 0
								D7_state = 1
								updates3["LED_STATUS3"] = "ON"
								if (D7 == 0) {
									update(ref(rldb), updates3)
								}
							}
						}}>
							<div class="icon-on"></div>
						</div>
						<div class="off-button {D7_state == 0 ? "off-button-active" : "off-button-inactive"} w-50 flex flex-center-vertical flex-end-horizontal h-100" on:click={() => {
							if (D7 == 0) {
								D7 = 1
								D7_state = 0
								updates3["LED_STATUS3"] = "OFF"
								if (D7 == 1) {
									update(ref(rldb), updates3)
								}
							}
						}}>
							<div class="icon-off"></div>
						</div>
					</div>
					<div class="padding-right-setting">
						<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
							messageModal = 1;
							messagePayload = "Do you want to change this device to priority?"
						}}></i>
					</div>
				</div>
			</div>
			<div class="card flex flex-direction-col card-mission card-device w-100 flex-gap-regular">
				<div class="flex flex-center-vertical flex-center-horizontal">
					<img src="{lamp}" class="w-30" alt="">
				</div>
				<div class="title-device">Lampu KT2</div>
				<div class="flex flex-between-horizontal">
					<div class="switch-button flex">
						<div class="on-button {D8_state == 1 ? "on-button-active" : "on-button-inactive"} w-50 flex flex-center-vertical h-100" on:click={() => {
							if (D8 == 1) {
								D8 = 0
								D8_state = 1
								updates4["LED_STATUS4"] = "OFF"
								if (D8 == 0) {
									update(ref(rldb), updates4)
								}
							}
						}}>
							<div class="icon-on"></div>
						</div>
						<div class="off-button {D8_state == 0 ? "off-button-active" : "off-button-inactive"} w-50 flex flex-center-vertical flex-end-horizontal h-100" on:click={() => {
							if (D8 == 0) {
								D8 = 1
								D8_state = 0
								updates3["LED_STATUS4"] = "ON"
								if (D8 == 1) {
									update(ref(rldb), updates4)
								}
							}
						}}>
							<div class="icon-off"></div>
						</div>
					</div>
					<div class="padding-right-setting">
						<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
							messageModal = 1;
							messagePayload = "Do you want to change this device to priority?"
						}}></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
