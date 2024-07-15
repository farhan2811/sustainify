<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import placeholder from '$lib/images/image-placeholder.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount, afterUpdate } from 'svelte';
	import {rldb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection,} from "firebase/firestore"; 
    import { getDatabase, ref , update, set, onValue, remove } from 'firebase/database';
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let lamp_state = 0;
	let messageModal = 0;
	let messageModalConfirm = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let priority_devices = [];
	let nonpriority_devices = [];
	let priority_loaded = 0;
	let nonpriority_loaded = 0;
	const include_time = {};
    let on_hour = null;
    let off_hour = null;
    let schedule_text = "Schedule"
    let state_button_priority = [];
    let state_button_nonpriority = [];
    let scheduled_devices = [];
    let user_state;


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	let getAllDevice = async () => {
		const refList = ref(rldb, `devices/${localStorage.getItem("username")}/`);
		onValue(refList, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				user_state = data.status;
				const values = Object.values(data);
				const index1 = values.indexOf("suspended");
				const index2 = values.indexOf("unsuspended");
				if (index1 > -1) { 
				  values.splice(index1, 1); 
				}
				if (index2 > -1) {
				  values.splice(index2, 1);
				}
				const keys = Object.keys(data);
				const index3 = keys.indexOf("status");
				if (index3 > -1) { 
				  keys.splice(index3, 1); 
				}
				keys.forEach((key) => {
					values.forEach((val) => {
						val.keys = key;
					})
				})
				const groupedObjects = values.reduce((result, obj) => {(			
				result[obj.category] = result[obj.category] || []).push(obj);
				return result;
				}, {});

				if (groupedObjects.Priority) {
					priority_devices = groupedObjects.Priority;
					priority_devices.forEach(() => {
						state_button_priority.push(0)
					})
				}
				if (groupedObjects['Non Priority']) {
					nonpriority_devices = groupedObjects['Non Priority'];
					nonpriority_devices.forEach(() => {
						state_button_nonpriority.push(0)
					})
				}
				priority_loaded = 1;
				nonpriority_loaded = 1;
			} else {
				priority_loaded = 1;
				nonpriority_loaded = 1;
			}
		})
	}

	const goToSustainableHome = () => {
		window.location.href = '/sustainable-home'
	}

	let scheduleDevice = async (on, off, scheduled, uid) => {
		for (var i = 0; i < scheduled_devices.length; i++) {
			include_time[`devices/${uid}/${scheduled[i]}/on_hour`] = on;
			include_time[`devices/${uid}/${scheduled[i]}/off_hour`] = off;
			update(ref(rldb), include_time)
		}
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		await getAllDevice();
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
					messageModal = 0;
				}}>Close</button>
			</div>
		</div>
	</div>
{/if}

{#if messageModalConfirm == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<button class="btn-modal w-100" on:click={() => {
					messageModal = 0;
					goToSustainableHome();
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
				<div class="head-input-secondary">On Hour</div>
				<div class="flex w-100 flex-gap-regular">
					<input type="time" name="" id="on-hour" class="input-field w-50" on:change={() => {
						on_hour = document.querySelector('#on-hour').value;
					}}>
					<div class="time-text flex flex-center-vertical flex-center-horizontal w-50" id="on-hour">
						{#if on_hour == null}
							Insert time
						{:else}
							{on_hour}
						{/if}
					</div>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Off Hour</div>
				<div class="flex w-100 flex-gap-regular">
					<input type="time" name="" id="off-hour" class="input-field w-50" on:change={() => {
						off_hour = document.querySelector('#off-hour').value;
					}}>
					<div class="time-text flex flex-center-vertical flex-center-horizontal w-50" id="on-hour">
						{#if off_hour == null}
							Insert time
						{:else}
							{off_hour}
						{/if}
					</div>
				</div>
			</div>
			<div class="title-card-home">
				Priority Device
			</div>
			<div class="flex flex-direction-col flex-gap-regular {priority_loaded == 0  ? "flex-center-vertical" : ""}">
				{#if priority_loaded == 1}
					{#if priority_devices.length > 0}
						{#each priority_devices as item, index}
							<div class="flex flex-direction-col card-device w-50">
								<div class="flex flex-center-vertical flex-center-horizontal">
									<img src="{item.image}" class="w-100 image-device" alt="">
								</div>
								<div class="card-body flex flex-direction-col flex-gap-regular">
									<div class="title-device">{item.name}</div>
									<div class="flex flex-between-horizontal">
										<div class="padding-right-setting flex flex-gap-semi-small">
											<button class="{state_button_priority[index] == 0 ? "btn-schedule-item" : "btn-schedule-item-danger"}" on:click={() => {
												if(state_button_priority[index] == 0){
													state_button_priority[index] = 1
													scheduled_devices.push(item.keys)
												} else {
													state_button_priority[index] = 0
													let ind = scheduled_devices.indexOf(item.keys);
													if (ind !== -1) {
													    scheduled_devices.splice(ind, 1);
													}
												}
											}}>
												{#if state_button_priority[index] == 0}
													Schedule
												{:else}
													Unschedule
												{/if}
											</button>
										</div>
									</div>
								</div>
							</div>
							{#if index % 2 == 0}
								<div class="break"> </div>
							{/if}
						{/each}
					{:else}
						<div class="no-device text-center">
							No device yet
						</div>
					{/if}
				{:else}
					<img src="{loading}" class="w-30">
				{/if}
			</div>
			<div class="title-card-home">
				Non-Priority Device
			</div>
			<div class="flex flex-direction-col flex-gap-regular {nonpriority_loaded == 0  ? "flex-center-vertical" : ""}">
				{#if nonpriority_loaded == 1}
					{#if nonpriority_devices.length > 0}
						{#if user_state != "suspended"}
							{#each nonpriority_devices as item, index}
								<div class="flex flex-direction-col card-device w-50">
									<div class="flex flex-center-vertical flex-center-horizontal">
										<img src="{item.image}" class="w-100 image-device" alt="">
									</div>
									<div class="card-body flex flex-direction-col flex-gap-regular">
										<div class="title-device">{item.name}</div>
										<div class="flex flex-between-horizontal">
											<div class="padding-right-setting flex flex-gap-semi-small">
												<button class="{state_button_nonpriority[index] == 0 ? "btn-schedule-item" : "btn-schedule-item-danger"}" on:click={() => {
													if(state_button_nonpriority[index] == 0){
														state_button_nonpriority[index] = 1
														scheduled_devices.push(item.keys)
														console.log(scheduled_devices)
													} else {
														state_button_nonpriority[index] = 0
														let ind = scheduled_devices.indexOf(item.keys);
														if (ind !== -1) {
														    scheduled_devices.splice(ind, 1);
														}
														console.log(scheduled_devices)
													}
												}}>
													{#if state_button_nonpriority[index] == 0}
														Schedule
													{:else}
														Unschedule
													{/if}
												</button>
											</div>
										</div>
									</div>
								</div>
								{#if index % 2 == 0}
									<div class="break"> </div>
								{/if}
							{/each}
						{:else}
						<div class="form-note w-100">Electricity usage above 50%, not allowed</div>
						{/if}
					{:else}
						<div class="no-device text-center">
							No device yet
						</div>
					{/if}
				{:else}
					<img src="{loading}" class="w-30">
				{/if}
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100" on:click={() => {
					if (on_hour == "" || on_hour == null) {
						messageModal = 1;
						messagePayload = "Please fill the on hour";
					} else if (off_hour == "" || off_hour == null) {
						messageModal = 1;
						messagePayload = "Please fill the off hour";
					} else if (scheduled_devices.length == 0 || scheduled_devices == null) {
						messageModal = 1;
						messagePayload = "Please choose device to schedule";
					} else {
						scheduleDevice(on_hour,off_hour,scheduled_devices,localStorage.getItem("username"));
						messageModalConfirm = 1;
						messagePayload = "Schedule has been set";

					}
				}}>Set Schedule</button>
			</div>
		</div>
	</div>
</section>
