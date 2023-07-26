<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'

	let hidden_state = 0;
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let overflow = null;
	let home_electricity = null;
	let kitchen_gas = null;
	let vehicle_fuel = null;
	let meat_consumption = null;
	let vegetable_consumption = null;
	let water_usage = null;
	let garbage_disposal = null;
	let airplane_flight = null;
	let real_home_electricity = null;
	let real_kitchen_gas = null;
	let real_vehicle_fuel = null;
	let real_meat_consumption = null;
	let real_vegetable_consumption = null;
	let real_water_usage = null;
	let real_garbage_disposal = null;
	let real_airplane_flight = null;
	let carbon_total = null;
	let carbon_level = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let username_list = [];
	let email_list = [];
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let carbon_data_snapshot = null;
	let carbon_data = null;
	let percentage_carbon_data = [];
	let month_year_avail = false;
	let options = {duration: 1000}


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	// access the db collection
	const getCarbonData = async () => {
	    const carbon_data_snapshot = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year));
	    carbon_data = carbon_data_snapshot.data();
	    percentage_carbon_data[0] = ((carbon_data.home_electricity / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[1] = ((carbon_data.kitchen_gas / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[2] = ((carbon_data.vehicle_fuel / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[3] = ((carbon_data.meat_consumption / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[4] = ((carbon_data.vegetable_consumption / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[5] = ((carbon_data.water_usage / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[6] = ((carbon_data.garbage_disposal / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[7] = ((carbon_data.airplane_flight / carbon_data.carbon_total) * 100).toFixed(1)
	    document.querySelector("#home-electricity").style.width = percentage_carbon_data[0]+"%";
	    document.querySelector("#kitchen-gas").style.width = percentage_carbon_data[1]+"%";
	    document.querySelector("#vehicle-fuel").style.width = percentage_carbon_data[2]+"%";
	    document.querySelector("#meat-consumption").style.width = percentage_carbon_data[3]+"%";
	    document.querySelector("#vegetable-consumption").style.width = percentage_carbon_data[4]+"%";
	    document.querySelector("#water-usage").style.width = percentage_carbon_data[5]+"%";
	    document.querySelector("#garbage").style.width = percentage_carbon_data[6]+"%";
	    document.querySelector("#airplane-flight").style.width = percentage_carbon_data[7]+"%";
	}

	const goToCarbonResult = () => {
		window.location.href = '/carbon-emission/carbon-calculator/carbon-result'
	}

	onMount(async() => {
		await getCarbonData();
		console.log(monthNames[month]+"-"+year)
		console.log(carbon_data);

	})

</script>

<svelte:head>
	<title>Emission Calculator</title>
	<meta name="description" content="Carbon Result Page" />
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
				<div class="flex flex-direction-col flex-gap-large">
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

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				window.location.href = '/carbon-emission'
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
		<div class="title-card-home">
			Emission Detail
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="sub-title-emission">Energy Consumption</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Home Electricity Usage</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="home-electricity"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage"> 
					{#if carbon_data}
						{carbon_data.home_electricity} Kg CO2
					{/if}
					</div>
					<div class="carbon-percentage">
					{#if percentage_carbon_data && percentage_carbon_data[0] != undefined}
						{percentage_carbon_data[0]} %
					{/if}
					</div>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Kitchen Gas Usage</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="kitchen-gas"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage"> 
						{#if carbon_data}
							{carbon_data.kitchen_gas} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[1] != undefined}
							{percentage_carbon_data[1]} %
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="sub-title-emission">Transportation</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Vehicle Fuel</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="vehicle-fuel"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage"> 
						{#if carbon_data}
							{carbon_data.vehicle_fuel} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[2] != undefined}
							{percentage_carbon_data[2]} %
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="sub-title-emission">Food</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Meat Consumption</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="meat-consumption"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage">
						{#if carbon_data}
							{carbon_data.meat_consumption} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[3] != undefined}
							{percentage_carbon_data[3]} %
						{/if}
					</div>
				</div>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Vegetable Consumption</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="vegetable-consumption"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage">
						{#if carbon_data}
							{carbon_data.vegetable_consumption} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[4] != undefined}
							{percentage_carbon_data[4]} %
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="sub-title-emission">Water Consumption</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Water Usage</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="water-usage"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage">
						{#if carbon_data}
							{carbon_data.water_usage} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[5] != undefined}
							{percentage_carbon_data[5]} %
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="sub-title-emission">Waste Disposal</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Garbage</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="garbage"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage">
						{#if carbon_data}
							{carbon_data.garbage_disposal} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[6] != undefined}
							{percentage_carbon_data[6]} %
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="sub-title-emission">Air Travel</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="accent-title-emission">Airplane Flight</div>
			</div>
			<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
				<div class="carbon-level-bar">
					<div class="carbon-bar-count" id="airplane-flight"></div>
				</div>
				<div class="flex flex-between-horizontal">
					<div class="carbon-percentage">
						{#if carbon_data}
							{carbon_data.airplane_flight} Kg CO2
						{/if}
					</div>
					<div class="carbon-percentage">
						{#if percentage_carbon_data && percentage_carbon_data[7] != undefined}
							{percentage_carbon_data[7]} %
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="card-2 flex flex-direction-col flex-center-vertical flex-center-horizontal flex-gap-semi-large">	
			<div class="sub-home">CO2 Emission Total</div>
			<div class="carbon-count-2">
				{#if carbon_data}
					{carbon_data.carbon_total} Kg CO2
				{/if}
			</div>
			<div class="sub-home">Emission Level : <span class="carbon-level">
				{#if carbon_data}
					{carbon_data.carbon_level}
				{/if}
			</span></div>
		</div>
	</div>
</section>
