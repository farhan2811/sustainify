<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, getDoc, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let percentage_carbon_data = [];
	let carbon_month = null;
	let carbon_all_data = [];
	let carbon_all_month = [];
	let carbon_all_month_processed_temp
	let carbon_all_month_processed = [];
	let carbon_bundle = [1200, 1543, 1329, 1123, 2342, 3321];
	let newOption = null;
	let select = null;
	let carbon_data = null;
	let carbon_data_snapshot_2 = [];

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getCarbonData = async () => {
	    const carbon_data_snapshot = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	    carbon_data_snapshot.forEach((doc) => 
	    	carbon_all_month.push(doc.id)
	    );
	    // carbon_month = carbon_all_month[0];
	    select = document.querySelector("#select-month");
	    for (var i = 0; i < carbon_all_month.length; i++) {
	    	newOption = new Option(carbon_all_month[i],carbon_all_month[i]);
	    	select.add(newOption,undefined);
	    }
	    // percentage_carbon_data[0] = ((carbon_data.home_electricity / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[1] = ((carbon_data.kitchen_gas / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[2] = ((carbon_data.vehicle_fuel / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[3] = ((carbon_data.meat_consumption / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[4] = ((carbon_data.vegetable_consumption / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[5] = ((carbon_data.water_usage / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[6] = ((carbon_data.garbage_disposal / carbon_data.carbon_total) * 100).toFixed(1)
	    // percentage_carbon_data[7] = ((carbon_data.airplane_flight / carbon_data.carbon_total) * 100).toFixed(1)
	    // document.querySelector("#home-electricity").style.width = percentage_carbon_data[0]+"%";
	    // document.querySelector("#kitchen-gas").style.width = percentage_carbon_data[1]+"%";
	    // document.querySelector("#vehicle-fuel").style.width = percentage_carbon_data[2]+"%";
	    // document.querySelector("#meat-consumption").style.width = percentage_carbon_data[3]+"%";
	    // document.querySelector("#vegetable-consumption").style.width = percentage_carbon_data[4]+"%";
	    // document.querySelector("#water-usage").style.width = percentage_carbon_data[5]+"%";
	    // document.querySelector("#garbage").style.width = percentage_carbon_data[6]+"%";
	    // document.querySelector("#airplane-flight").style.width = percentage_carbon_data[7]+"%";
	}

	const changeCarbonData = async (month) => {
		carbon_month = month
		const carbon_data_snapshot = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  month));
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

	onMount(async() => {
		getCarbonData();
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		const ctx = document.getElementById('myChart');

	  new Chart(ctx, {
	    type: 'bar',
	    data: {
	      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	      datasets: [{
	        label: '# of Carbon Emission (kg)',
	        data: carbon_bundle,
	        borderWidth: 1
	      }]
	    },
	    options: {
	    	maintainAspectRatio : false,
	      scales: {
	        y: {
	          beginAtZero: true
	        }
	      }
	    }
	  });
	})

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Carbon Emission Page" />
</svelte:head>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<Navbar pagePointer="carbon-emission"/>
	<div class="vw-100 h-10 flex flex-direction-col page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-bell arrow-back"></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 vh-30 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home">
		<div class="chart-container w-100">
			<div class="chart-container-body">
				<canvas id="myChart"></canvas>
			</div>
		</div>
	</div>
	<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
		<a href="/carbon-emission/vehicle-tracker/" class="no-decoration">
			<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal"><i class="fa-solid fa-car"></i>Vehicle Tracker</button>
		</a>
		<a href="/carbon-emission/emission-calculator/" class="no-decoration">
			<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal"><i class="fa-solid fa-calculator"></i>Emission Calculator</button>
		</a>
		<div class="title-card-home">
			Emission Detail
		</div>	
		<!-- {#if carbon_data_snapshot2}
			{#each carbon_data_snapshot2 as item, index}
				{item}
			{/each}	
		{/if} -->
		<select class="select-2" id="select-month" on:change={()=>{
			let e = document.getElementById("select-month");
			let value = e.value;
			let text = e.options[e.selectedIndex].text;
			changeCarbonData(text);
		}}>
			<option disabled selected>Select Month-Year</option>
		</select>
		{#if carbon_month == null}
			<div class="sub-title-emission text-center">Please select month & year</div>
		{:else}
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
		{/if}
	</div>
</section>