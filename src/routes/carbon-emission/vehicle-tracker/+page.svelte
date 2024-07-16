<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, getDoc, updateDoc } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'

	let hidden_state = 0;
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let overflow = null;
	let keysCarbonData = null;
	let carbon_data = null;
	let carbon_level = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let watchId;
	let startTime = "-";
	let endTime = "-";
	let previousPosition = null;
	let totalDistance = 0;
	let totalEmissions = 0;
	const carEmissionFactor = 0.17; // kg CO2 per liter of gasoline
	const motorcycleEmissionFactor = 0.114; // kg CO2 per km
	let vehicle_state = "Car"
	let track_state = "stop"
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let month_year_list = [];
	let month_year_avail = false;


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
	        return distance * carEmissionFactor;
	    } else if (vehicleType === "Motorcycle") {
	        return distance * motorcycleEmissionFactor;
	    } else {
	        return 0;
	    }
	}

	const getUserMonthYear = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	    querySnapshot1.forEach((doc) => 
	    	month_year_list.push(doc.id)
	    );
	    for (var i = 0; i < month_year_list.length; i++) {
	    	if (month_year_list[i] == monthNames[month]+"-"+year) {
	    		month_year_avail = true;
	    		break;
	    	} else {
	    		month_year_avail = false;
	    	}
	    }
	    console.log(month_year_avail)
	}

	const setCarbonTrackData = async (carbon) => {
		if (month_year_avail == false) {
			try {
				await setDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year), {
				  vehicle_fuel : parseFloat(carbon),
				  carbon_total : parseFloat(carbon),
				  carbon_level : "Low",
				  home_electricity : 0,
				  kitchen_gas : 0,
				  meat_consumption : 0,
				  vegetable_consumption : 0,
				  grains_consumption : 0,
				  garbage_disposal : 0,
				  airplane_flight : 0,
				  is_calculator : "no"
				});
				getUserMonthYear();
			} catch(error) {
				console.log(error)
			}
		} else {
			try {
				const querySnapshot1 = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record", monthNames[month]+"-"+year));
			    carbon_data = querySnapshot1.data();
			    carbon_data.vehicle_fuel = parseFloat(carbon_data.vehicle_fuel);
			    carbon_data.carbon_total = parseFloat(carbon_data.carbon_total);
			    carbon = parseFloat(carbon)
			    carbon_data.vehicle_fuel += carbon
			    carbon_data.carbon_total += carbon
			    if (carbon_data.carbon_total < 1000) {
					carbon_data.carbon_level = "Low"
				} else if (carbon_data.carbon_total >= 1000 && carbon_data.carbon_total <= 2000) {
					carbon_data.carbon_level = "Average"
				} else {
					carbon_data.carbon_level = "High"
				}
				updateDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record", monthNames[month]+"-"+year), {
					vehicle_fuel : parseFloat(carbon_data.vehicle_fuel.toFixed(1)),
				  	carbon_total : parseFloat(carbon_data.carbon_total.toFixed(1)),
				  	carbon_level : carbon_data.carbon_level
				})
			} catch(error) {
				console.log(error)
			}
		}
	} 


	onMount(async() => {
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		getUserMonthYear();
		console.log(monthNames[month]+"-"+year)

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

{#if messageModalSuccess == 1}
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
					setCarbonTrackData(totalEmissions.toFixed(1))
					messagePayload = "Carbon data has been saved"
					messageModal = 1;
				}}>Stop</button>	
			{:else}
				<button class="btn-track w-50" on:click={() => {
					track_state = "start"
					startTime = new Date().toLocaleTimeString('it-IT');
					totalDistance = 0; 
					totalEmissions = 0; 
					endTime = "-";
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
					<div class="time-track">{totalDistance.toFixed(1)} KM</div>
				</div>
				<div class="flex w-50 flex-direction-col flex-gap-small flex-center-vertical">
					<div class="sub-track">CO<sub>2</sub></div>
					<div class="time-track">{totalEmissions.toFixed(1)} KGs</div>
				</div>
			</div>
		</div>
	</div>
</section>
