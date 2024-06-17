<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'

	let hidden_state = 0;
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let overflow = null;
	// let home_electricity = null;
	// let kitchen_gas = null;
	// let vehicle_fuel = null;
	// let meat_consumption = null;
	// let vegetable_consumption = null;
	// let water_usage = null;
	// let garbage_disposal = null;
	// let airplane_flight = null;
	// let real_home_electricity = null;
	// let real_kitchen_gas = null;
	// let real_vehicle_fuel = null;
	// let real_meat_consumption = null;
	// let real_vegetable_consumption = null;
	// let real_water_usage = null;
	// let real_garbage_disposal = null;
	// let real_airplane_flight = null;
	// let carbon_total = null;
	// let carbon_level = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let watchId;
	let startTime = "-";
	let endTime = "-";
	let previousPosition = null;
	let totalDistance = 0;
	let totalEmissions = 0;
	const carEmissionFactor = 2.31; // kg CO2 per liter of gasoline
	const motorcycleEmissionFactor = 0.103; // kg CO2 per km
	const averageFuelEfficiencyCar = 12; // km per liter
	// let username_list = [];
	// let email_list = [];
	let vehicle_state = "Car"
	let track_state = "stop"
	// let dateObj = new Date();
	// let month = dateObj.getUTCMonth();
	// let day = dateObj.getUTCDate();
	// let year = dateObj.getUTCFullYear();
	// let month_year_list = [];
	// let month_year_avail = false;


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}


	function updatePosition(position) {
	    const { latitude, longitude } = position.coords;
	    if (previousPosition) {
	        const distance = calculateDistance(previousPosition.latitude, previousPosition.longitude, latitude, longitude);
	        totalDistance += distance;
	        const emissions = calculateEmissions(distance, vehicle_state);
        	totalEmissions += emissions;
        	console.log(totalDistance)
        	console.log(totalEmissions)
	    }
	    previousPosition = { latitude, longitude };
	}

	function showError(error) {
	    console.error("Error getting location: ", error);
	}

	function calculateDistance(lat1, lon1, lat2, lon2) {
	    const R = 6371;
	    const dLat = degreesToRadians(lat2 - lat1);
	    const dLon = degreesToRadians(lon2 - lon1);
	    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	              Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
	              Math.sin(dLon / 2) * Math.sin(dLon / 2);
	    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    return R * c;
	}

	function degreesToRadians(degrees) {
	    return degrees * (Math.PI / 180);
	}

	function calculateEmissions(distance, vehicleType) {
	    if (vehicleType === "Car") {
	        return distance * (carEmissionFactor / averageFuelEfficiencyCar);
	    } else if (vehicleType === "Motorcycle") {
	        return distance * motorcycleEmissionFactor;
	    } else {
	        return 0;
	    }
	}

	// // access the db collection
	// const getUserMonthYear = async () => {
	//     const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	//     querySnapshot1.forEach((doc) => 
	//     	month_year_list.push(doc.id)
	//     );
	//     for (var i = 0; i < month_year_list.length; i++) {
	//     	if (month_year_list[i] == monthNames[month]+"-"+year) {
	//     		month_year_avail = true;
	//     		break;
	//     	} else {
	//     		month_year_avail = false;
	//     	}
	//     }
	// }

	// const setCarbonData = async (electricity, gas, fuel, meat, vegetable, water, garbage, flight, total, level) => {
	// 	try {
	// 		await setDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year), {
	// 		  home_electricity: electricity,
	// 		  kitchen_gas: gas,
	// 		  meat_consumption: meat,
	// 		  vegetable_consumption: vegetable,
	// 		  water_usage: water,
	// 		  garbage_disposal: garbage,
	// 		  airplane_flight: flight,
	// 		  carbon_total : total,
	// 		  carbon_level : level
	// 		});
	// 	} catch(error) {
	// 		console.log(error)
	// 	}
	// }

	// const goToCarbonResult = () => {
	// 	window.location.href = '/carbon-emission/emission-calculator/carbon-result'
	// }

	onMount(async() => {
		// getUserMonthYear();
		// console.log(monthNames[month]+"-"+year)

	})

</script>

<svelte:head>
	<title>Vehicle Tracker</title>
	<meta name="description" content="Emission Calculator Page" />
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

<!-- {#if month_year_avail == true}
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-80 flex flex-direction-col flex-gap-semi-large flex-center-vertical flex-center-horizontal">
				<div class="head-input-primary text-center">You've filled this month emission data</div>
				<button class="btn-modal w-100" on:click={() => {
					history.back();
				}}>Close</button>
			</div>
		</div>
	</div>
{/if} -->

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
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 h-fit flex flex-direction-col flex-center-vertical page-top flex-gap-extra-large-double">
		<div class="flex w-100 flex-between-horizontal flex-center-vertical flex-gap-regular">
			<select class="select-track w-50" bind:value={vehicle_state}>
				<option>Car</option>
				<option>Motorcycle</option>
			</select>
			{#if track_state == "start"}
				<button class="btn-stop-track w-50" on:click={() => {
					track_state = "stop"
					endTime = new Date().toLocaleTimeString('it-IT');
					navigator.geolocation.clearWatch(watchId);
				}}>Stop</button>	
			{:else}
				<button class="btn-track w-50" on:click={() => {
					track_state = "start"
					startTime = new Date().toLocaleTimeString('it-IT');
					totalDistance = 0; 
					totalEmissions = 0; 
				    previousPosition = null; 
				    watchId = navigator.geolocation.watchPosition(updatePosition, showError, { enableHighAccuracy: true });
				}}>Start</button>
			{/if}
		</div>
		<div class="flex flex-direction-col flex-gap-extra-large-double w-100 bg-primary card-track">
			<div class="flex w-100 flex-between-horizontal flex-center-vertical flex-gap-regular">
				<div class="flex w-50 flex-direction-col flex-gap-small flex-center-vertical">
					<div class="sub-track">Start Time</div>
					<div class="time-track">{startTime}</div>
				</div>
				<div class="flex w-50 flex-direction-col flex-gap-small flex-center-vertical">
					<div class="sub-track">End Time</div>
					<div class="time-track">{endTime}</div>
				</div>
			</div>
			<div class="flex w-100 flex-between-horizontal flex-center-vertical flex-gap-regular">
				<div class="flex w-50 flex-direction-col flex-gap-small flex-center-vertical">
					<div class="sub-track">Distance</div>
					<div class="time-track">{totalDistance.toFixed(1)}</div>
				</div>
				<div class="flex w-50 flex-direction-col flex-gap-small flex-center-vertical">
					<div class="sub-track">CO<sub>2</sub></div>
					<div class="time-track">{totalEmissions.toFixed(1)} KGs</div>
				</div>
			</div>
		</div>
	</div>
	<!-- <div class="bg-primary vw-100 h-fit template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Home Electricity Usage (Kwh)</div>
				<input type="email" name="" class="input-field w-100" placeholder="input home electricity usage.." bind:value={home_electricity}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="flex flex-direction-col flex-gap-small">
					<div class="head-input-secondary">Kitchen Gas Usage (m3)</div>
					<div class="head-input-accent">1 kg = 1.25 (m3)</div>
				</div>
				<input type="text" name="" class="input-field w-100" placeholder="input kitchen gas usage.." bind:value={kitchen_gas}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Meat Consumption (Kg)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input meat consumption.." bind:value={meat_consumption}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Vegetable Consumption (Kg)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input vegetable consumption.." bind:value={vegetable_consumption}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Water Usage (liter)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input water usage.." bind:value={water_usage}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Garbage/Waste Disposal (Kg)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input garbage/waste disposal.." bind:value={garbage_disposal}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Airplane Flight (Number of Flights)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input airplane flight.." bind:value={airplane_flight}>
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100" on:click={() => {
					if (home_electricity == "" || home_electricity == null) {
						messageModal = 1;
						messagePayload = "Please fill your home electricity usage";
					} else if(kitchen_gas == "" || kitchen_gas == null) {
						messageModal = 1;
						messagePayload = "Please fill kitchen gas usage";
					} else if(meat_consumption == "" || meat_consumption == null) {
						messageModal = 1;
						messagePayload = "Please fill your meat consumption";
					} else if(vegetable_consumption == "" || vegetable_consumption == null) {
						messageModal = 1;
						messagePayload = "Please fill your vegetable consumption";
					} else if(water_usage == "" || water_usage == null) {
						messageModal = 1;
						messagePayload = "Please fill your water usage";
					} else if(garbage_disposal == "" || garbage_disposal == null) {
						messageModal = 1;
						messagePayload = "Please fill your garbage disposal usage";
					} else if(airplane_flight == "" || airplane_flight == null) {
						messageModal = 1;
						messagePayload = "Please fill your airplane flight";
					} else {
						real_home_electricity = Math.round(home_electricity * 0.5);
						real_kitchen_gas = Math.round(kitchen_gas * 0.2);
						real_meat_consumption = Math.round(meat_consumption * 27);
						real_vegetable_consumption = Math.round(vegetable_consumption * 1.5);
						real_water_usage = Math.round(water_usage * 0.3);
						real_garbage_disposal = Math.round(garbage_disposal * 0.4);
						real_airplane_flight = Math.round((airplane_flight * 1155) * 0.2);
						carbon_total = real_home_electricity+real_kitchen_gas+real_meat_consumption+real_vegetable_consumption+real_water_usage+real_garbage_disposal+real_airplane_flight;
						if (carbon_total < 1000) {
							carbon_level = "Low"
						} else if (carbon_total >= 1000 && carbon_total <= 5000) {
							carbon_level = "Average"
						} else {
							carbon_level = "High"
						}
						setCarbonData(real_home_electricity, real_kitchen_gas, real_meat_consumption, real_vegetable_consumption, real_water_usage, real_garbage_disposal, real_airplane_flight,carbon_total,carbon_level);
						messagePayload = "Calculating your data"
						messageModalSuccess = 1;
						setTimeout(goToCarbonResult, 3000);
					}
				}}>Calculate</button>
			</div>
		</div>
	</div> -->
</section>
