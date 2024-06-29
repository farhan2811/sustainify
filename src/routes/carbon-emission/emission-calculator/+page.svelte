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
	import {fly, scale} from 'svelte/transition'

	let hidden_state = 0;
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let overflow = null;
	let home_electricity = null;
	let kitchen_gas = null;
	let meat_consumption = null;
	let vegetable_consumption = null;
	let grains_consumption = null;
	let garbage_disposal = null;
	let airplane_flight = null;
	let real_home_electricity = null;
	let real_kitchen_gas = null;
	let real_meat_consumption = null;
	let real_vegetable_consumption = null;
	let real_grains_consumption = null;
	let real_garbage_disposal = null;
	let real_airplane_flight = null;
	let home_electricity_emission_factor = 0.233;
    let kitchen_gas_emission_factor= 2.95;
    let meat_consumption_emission_factor = 27;
    let vegetable_consumption_emission_factor = 2;
    let grains_consumption_emission_factor = 1.2;
    let garbage_disposal_emission_factor = 0.45;
    let airplane_flight_emission_factor = 0.15;
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
	let month_year_list = [];
	let month_year_avail = false;
	let done_calculate = "";
	let carbon_data = null;


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	// access the db collection
	const getUserMonthYear = async () => {
	    const querySnapshot1 = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year));
	    querySnapshot1.forEach((doc) => 
	    	month_year_list.push(doc.id)
	    );
	    for (var i = 0; i < month_year_list.length; i++) {
	    	if (month_year_list[i] == monthNames[month]+"-"+year) {
	    		month_year_avail = true;
	    		const querySnapshot2 = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record", monthNames[month]+"-"+year));
	    		if (querySnapshot2.data().is_calculator == "no") {
	    			done_calculate = "no";
	    		} else {
	    			done_calculate = "yes"
	    		}
	    		break;
	    	} else {
	    		month_year_avail = false;
	    	}
	    }
	}

	const setCarbonData = async (electricity, gas, meat, vegetable, grains, garbage, flight, total, level) => {
		if (month_year_avail == false) {
			try {
				await setDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year), {
				  home_electricity: parseFloat(electricity.toFixed(1)),
				  kitchen_gas: parseFloat(gas.toFixed(1)),
				  meat_consumption: parseFloat(meat.toFixed(1)),
				  vegetable_consumption: parseFloat(vegetable.toFixed(1)),
				  grains_consumption: parseFloat(grains.toFixed(1)),
				  garbage_disposal: parseFloat(garbage.toFixed(1)),
				  airplane_flight: parseFloat(flight.toFixed(1)),
				  carbon_total : parseFloat(total.toFixed(1)),
				  carbon_level : level,
				  vehicle_fuel : 0,
				  is_calculator : "yes"
				});
			} catch(error) {
				console.log(error)
			}
		} else {
			try {
				const querySnapshot3 = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record", monthNames[month]+"-"+year));
				carbon_data = querySnapshot3.data();
				carbon_data.carbon_total = parseFloat(carbon_data.carbon_total);
				total = parseFloat(total);
				total += carbon_data.carbon_total;
				if (carbon_data.carbon_total < 1000) {
					carbon_data.carbon_level = "Low"
				} else if (carbon_data.carbon_total >= 1000 && carbon_data.carbon_total <= 2000) {
					carbon_data.carbon_level = "Average"
				} else {
					carbon_data.carbon_level = "High"
				}
				updateDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record", monthNames[month]+"-"+year), {
						home_electricity: parseFloat(electricity.toFixed(1)),
						kitchen_gas: parseFloat(gas.toFixed(1)),
						meat_consumption: parseFloat(meat.toFixed(1)),
						vegetable_consumption: parseFloat(vegetable.toFixed(1)),
						grains_consumption: parseFloat(grains.toFixed(1)),
						garbage_disposal: parseFloat(garbage.toFixed(1)),
						airplane_flight: parseFloat(flight.toFixed(1)),
						carbon_total : parseFloat(total.toFixed(1)),
					  	carbon_level : carbon_data.carbon_level
					})
			} catch(error) {
				console.log(error)
			}
		}
	}

	const goToCarbonResult = () => {
		window.location.href = '/carbon-emission/emission-calculator/carbon-result'
	}

	onMount(async() => {
		getUserMonthYear();
		console.log(monthNames[month]+"-"+year)
	})

</script>

<svelte:head>
	<title>Emission Calculator</title>
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

{#if done_calculate == "yes"}
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
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 h-fit template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Home Electricity Usage (Kwh)</div>
				<input type="email" name="" class="input-field w-100" placeholder="input home electricity usage.." bind:value={home_electricity}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="flex flex-direction-col flex-gap-small">
					<div class="head-input-secondary">Kitchen Gas Usage (Kg)</div>
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
				<div class="head-input-secondary">Grains Consumption (Kg)</div>
				<div class="head-input-accent">(Rice, Corn, Wheat, Quinoa, etc.)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input grains consumption.." bind:value={grains_consumption}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Garbage/Waste Disposal (Kg)</div>
				<input type="text" name="" class="input-field w-100" placeholder="input garbage/waste disposal.." bind:value={garbage_disposal}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Airplane Flight (Km)</div>
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
					} else if(grains_consumption == "" || grains_consumption == null) {
						messageModal = 1;
						messagePayload = "Please fill your grains consumption";
					} else if(garbage_disposal == "" || garbage_disposal == null) {
						messageModal = 1;
						messagePayload = "Please fill your garbage disposal usage";
					} else if(airplane_flight == "" || airplane_flight == null) {
						messageModal = 1;
						messagePayload = "Please fill your airplane flight";
					} else {
						real_home_electricity = home_electricity * home_electricity_emission_factor;
						real_kitchen_gas = kitchen_gas * kitchen_gas_emission_factor;
						real_meat_consumption = meat_consumption * meat_consumption_emission_factor;
						real_vegetable_consumption = vegetable_consumption * vegetable_consumption_emission_factor;
						real_grains_consumption = grains_consumption * grains_consumption_emission_factor;
						real_garbage_disposal = garbage_disposal * garbage_disposal_emission_factor;
						real_airplane_flight = airplane_flight * airplane_flight_emission_factor;
						carbon_total = real_home_electricity+real_kitchen_gas+real_meat_consumption+real_vegetable_consumption+real_grains_consumption+real_garbage_disposal+real_airplane_flight;
						if (carbon_total < 1000) {
							carbon_level = "Low"
						} else if (carbon_total >= 1000 && carbon_total <= 2000) {
							carbon_level = "Average"
						} else {
							carbon_level = "High"
						}
						setCarbonData(real_home_electricity, real_kitchen_gas, real_meat_consumption, real_vegetable_consumption, real_grains_consumption, real_garbage_disposal, real_airplane_flight,carbon_total,carbon_level);
						messagePayload = "Calculating your data"
						messageModalSuccess = 1;
						setTimeout(goToCarbonResult, 3000);
					}
				}}>Calculate</button>
			</div>
		</div>
	</div>
</section>
