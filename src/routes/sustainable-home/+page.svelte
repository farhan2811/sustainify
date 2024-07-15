<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {rldb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection,} from "firebase/firestore"; 
    import { getDatabase, ref , update, set, onValue, remove } from 'firebase/database';
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let lamp_state = 0;
	let messageModalPriority = 0;
	let messageModalDeleteDevice = 0;
	let messageModalResetSchedule = 0;
	let messageModalNonPriority = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let priority_devices = [];
	let nonpriority_devices = [];
	let priority_loaded = 0;
	let nonpriority_loaded = 0;
	const toggle = {};
	const priority_state = {};
	const delete_device = {};
	const reset_schedule = {};
	let device_id;
	let user_state;

	let getAllDevice = async () => {
		const refList = ref(rldb, `devices/${localStorage.getItem("username")}`);
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
				}
				if (groupedObjects['Non Priority']) {
					nonpriority_devices = groupedObjects['Non Priority'];
				}
				priority_loaded = 1;
				nonpriority_loaded = 1;
			} else {
				priority_loaded = 1;
				nonpriority_loaded = 1;
			}
		})
	}

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
		await getAllDevice()
	})
</script>

<svelte:head>
	<title>Sustainable Home</title>
	<meta name="description" content="Sustainable Home Page" />
</svelte:head>


{#if messageModalDeleteDevice == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-gap-regular w-100">
					<button class="btn-modal w-50" on:click={() => {
					messageModalDeleteDevice = 0
					}}>No</button>
					<button class="btn-modal-danger w-50" on:click={() => {
					delete_device[`devices/${localStorage.getItem("username")}/${device_id}`] = null
					update(ref(rldb), delete_device)
					let ind_1 = priority_devices.findIndex(obj => obj.keys === device_id);
					let ind_2 = nonpriority_devices.findIndex(obj => obj.keys === device_id);
					if (ind_1 !== -1) {
					    priority_devices.splice(ind_1, 1);
					} else if(ind_2 !== -1){
						nonpriority_devices.splice(ind_2, 1);
					}
					messageModalDeleteDevice = 0
					}}>Yes</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if messageModalResetSchedule == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-gap-regular w-100">
					<button class="btn-modal w-50" on:click={() => {
					messageModalResetSchedule = 0
					}}>No</button>
					<button class="btn-modal-danger w-50" on:click={() => {
					reset_schedule[`devices/${localStorage.getItem("username")}/${device_id}/on_hour`] = null
					update(ref(rldb), reset_schedule)
					reset_schedule[`devices/${localStorage.getItem("username")}/${device_id}/off_hour`] = null
					update(ref(rldb), reset_schedule)
					messageModalResetSchedule = 0
					}}>Yes</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if messageModalPriority == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-gap-regular w-100">
					<button class="btn-modal-danger w-50" on:click={() => {
					messageModalPriority = 0
					}}>No</button>
					<button class="btn-modal w-50" on:click={() => {
					priority_state[`devices/${localStorage.getItem("username")}/${device_id}/category`] = "Non Priority"
					update(ref(rldb), priority_state)
					let ind = priority_devices.findIndex(obj => obj.keys === device_id);
					if (ind !== -1) {
					    priority_devices.splice(ind, 1);
					}
					messageModalPriority = 0
					}}>Yes</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if messageModalNonPriority == 1}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-gap-regular w-100">
					<button class="btn-modal-danger w-50" on:click={() => {
					messageModalNonPriority = 0
					}}>No</button>
					<button class="btn-modal w-50" on:click={() => {
					priority_state[`devices/${localStorage.getItem("username")}/${device_id}/category`] = "Priority"
					update(ref(rldb), priority_state)
					let ind = nonpriority_devices.findIndex(obj => obj.keys === device_id);
					if (ind !== -1) {
					    nonpriority_devices.splice(ind, 1);
					}
					messageModalNonPriority = 0
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
			<img src="{logo}" class="w-50" alt="">
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
		<div class="flex flex-direction-col flex-gap-regular {priority_loaded == 0  ? "flex-center-vertical" : ""}">
			{#if priority_loaded == 1}
				{#if priority_devices.length > 0}
					{#each priority_devices as item, index}
						<div class="flex flex-direction-col card-device w-100">
							<div class="flex flex-center-vertical flex-center-horizontal">
								<img src="{item.image}" class="w-100 image-device" alt="">
							</div>
							<div class="card-body flex flex-direction-col flex-gap-regular">
								<div class="title-device">{item.name}</div>
								<div class="flex flex-between-horizontal">
									<div class="switch-button flex">
										<div class="on-button {item.state == "on" ? "on-button-active" : "on-button-inactive"} w-50 flex flex-center-vertical h-100" on:click={() => {
											toggle[`devices/${localStorage.getItem("username")}/${item.keys}/state`] = "on"
											update(ref(rldb), toggle)
										}}>
											<div class="icon-on"></div>
										</div>
										<div class="off-button {item.state == "off" ? "off-button-active" : "off-button-inactive"} w-50 flex flex-center-vertical flex-end-horizontal h-100" on:click={() => {
											toggle[`devices/${localStorage.getItem("username")}/${item.keys}/state`] = "off"
											update(ref(rldb), toggle)
										}}>
											<div class="icon-off"></div>
										</div>
									</div>
									<div class="padding-right-setting flex flex-gap-regular">
										<i class="fa-solid fa-clock-rotate-left settings-device blue-icon" on:click={() => {
											device_id = item.keys
											messageModalResetSchedule = 1;
											messagePayload = "Do you want to delete the schedule on this device?"
										}}></i>
										<i class="fa-solid fa-trash settings-device red-icon" on:click={() => {
											device_id = item.keys
											messageModalDeleteDevice = 1;
											messagePayload = "Do you want to delete this device?"
										}}></i>
										<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
											device_id = item.keys
											messageModalPriority = 1;
											messagePayload = "Do you want to change this device to non-priority?"
										}}></i>
									</div>
								</div>
							</div>
						</div>
						<!-- {#if index % 2 == 0}
							<div class="break"> </div>
						{/if} -->
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
							<div class="flex flex-direction-col card-device w-100">
								<div class="flex flex-center-vertical flex-center-horizontal">
									<img src="{item.image}" class="w-100 image-device" alt="">
								</div>
								<div class="card-body flex flex-direction-col flex-gap-regular">
									<div class="title-device">{item.name}</div>
									<div class="flex flex-between-horizontal">
										<div class="switch-button flex">
											<div class="on-button {item.state == "on" ? "on-button-active" : "on-button-inactive"} w-50 flex flex-center-vertical h-100" on:click={() => {
												toggle[`devices/${localStorage.getItem("username")}/${item.keys}/state`] = "on"
												update(ref(rldb), toggle)
											}}>
												<div class="icon-on"></div>
											</div>
											<div class="off-button {item.state == "off" ? "off-button-active" : "off-button-inactive"} w-50 flex flex-center-vertical flex-end-horizontal h-100" on:click={() => {
												toggle[`devices/${localStorage.getItem("username")}/${item.keys}/state`] = "off"
												update(ref(rldb), toggle)
											}}>
												<div class="icon-off"></div>
											</div>
										</div>
										<div class="padding-right-setting flex flex-gap-regular">
											<i class="fa-solid fa-clock-rotate-left settings-device blue-icon" on:click={() => {
												device_id = item.keys
												messageModalResetSchedule = 1;
												messagePayload = "Do you want to delete the schedule on this device?"
											}}></i>
											<i class="fa-solid fa-trash settings-device red-icon" on:click={() => {
												device_id = item.keys
												messageModalDeleteDevice = 1;
												messagePayload = "Do you want to delete this device?"
											}}></i>
											<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
												device_id = item.keys
												messageModalPriority = 1;
												messagePayload = "Do you want to change this device to non-priority?"
											}}></i>
										</div>
									</div>
								</div>
							</div>
							<!-- {#if index % 2 == 0}
								<div class="break"> </div>
							{/if} -->
						{/each}
					{:else}
						{#each nonpriority_devices as item, index}
							<div class="flex flex-direction-col card-device w-100">
								<div class="flex flex-center-vertical flex-center-horizontal">
									<img src="{item.image}" class="w-100 image-device" alt="">
								</div>
								<div class="card-body flex flex-direction-col flex-gap-regular">
									<div class="title-device">{item.name}</div>
									<div class="flex flex-between-horizontal flex-center-vertical">
										<div class="label-restrict">Control not allowed</div>
										<div class="padding-right-setting flex flex-gap-semi-small">
											<i class="fa-solid fa-trash settings-device red-icon" on:click={() => {
												device_id = item.keys
												messageModalDeleteDevice = 1;
												messagePayload = "Do you want to delete this device?"
											}}></i>
											<i class="fa-solid fa-ellipsis-vertical settings-device" on:click={() => {
												device_id = item.keys
												messageModalNonPriority = 1;
												messagePayload = "Do you want to change this device to priority?"
											}}></i>
										</div>
									</div>
								</div>
							</div>
							<!-- {#if index % 2 == 0}
								<div class="break"> </div>
							{/if} -->
						{/each}
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
	</div>
</section>
