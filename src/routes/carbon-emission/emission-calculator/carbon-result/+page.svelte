<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb, rldb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDoc, getDocs, collection, increment, updateDoc } from "firebase/firestore"; 
	import { getDatabase, ref , update, set, onValue, remove } from 'firebase/database';
	import {fly, scale} from 'svelte/transition'
	import ApiController from "../../../../ApiController"

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
	let grains_consumption = null;
	let garbage_disposal = null;
	let airplane_flight = null;
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
	const update_user_status = {};


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
	    percentage_carbon_data[5] = ((carbon_data.grains_consumption / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[6] = ((carbon_data.garbage_disposal / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[7] = ((carbon_data.airplane_flight / carbon_data.carbon_total) * 100).toFixed(1)
	    document.querySelector("#home-electricity").style.width = percentage_carbon_data[0]+"%";
	    document.querySelector("#kitchen-gas").style.width = percentage_carbon_data[1]+"%";
	    document.querySelector("#vehicle-fuel").style.width = percentage_carbon_data[2]+"%";
	    document.querySelector("#meat-consumption").style.width = percentage_carbon_data[3]+"%";
	    document.querySelector("#vegetable-consumption").style.width = percentage_carbon_data[4]+"%";
	    document.querySelector("#grains-consumption").style.width = percentage_carbon_data[5]+"%";
	    document.querySelector("#garbage").style.width = percentage_carbon_data[6]+"%";
	    document.querySelector("#airplane-flight").style.width = percentage_carbon_data[7]+"%";
	    document.querySelector("#home-electricity2").style.width = percentage_carbon_data[0]+"%";
	    document.querySelector("#kitchen-gas2").style.width = percentage_carbon_data[1]+"%";
	    document.querySelector("#vehicle-fuel2").style.width = percentage_carbon_data[2]+"%";
	    document.querySelector("#meat-consumption2").style.width = percentage_carbon_data[3]+"%";
	    document.querySelector("#vegetable-consumption2").style.width = percentage_carbon_data[4]+"%";
	    document.querySelector("#grains-consumption2").style.width = percentage_carbon_data[5]+"%";
	    document.querySelector("#garbage2").style.width = percentage_carbon_data[6]+"%";
	    document.querySelector("#airplane-flight2").style.width = percentage_carbon_data[7]+"%";
	    if (percentage_carbon_data[0] > 50) {
	    	const refList = ref(rldb, `devices/${localStorage.getItem("username")}`);
	    	onValue(refList, (snapshot) => {
	    		const data = snapshot.val();
	    		console.log(data)
	    	})
	    	update_user_status[`devices/${localStorage.getItem("username")}/status`] = "suspended";
			update(ref(rldb), update_user_status)
	    } else {
	    	update_user_status[`devices/${localStorage.getItem("username")}/status`] = "unsuspended";
			update(ref(rldb), update_user_status)
	    }
	   await checkElectricityCount();
	}

	const checkElectricityCount = async () => {
	    const userRef = await doc(frdb, 'users', localStorage.getItem("username"));
	    const getDataUser = await getDoc(userRef);
	    const missionRef = await doc(frdb, 'users', localStorage.getItem("username"), "missions", "mission_1");
	    const getDataMission = await getDoc(missionRef);
	    if (carbon_data.home_electricity >= getDataMission.data().goal) {
	      await updateDoc(missionRef, {
	        goal: carbon_data.home_electricity
	      });
	    } else {
	    	await updateDoc(userRef, {
		        points: increment(getDataMission.data().points)
		    });
		    await updateDoc(missionRef, {
		        state: "finished",
		        goal: carbon_data.home_electricity
		    });
		    const notifCollection = collection(frdb, 'notifications');
		      const notifId = doc(notifCollection).id;
		      await sendNotifMissionElectricity(localStorage.getItem("username"))
		      await setDoc(doc(notifCollection, notifId), {
		        user_id: localStorage.getItem("username"),
		        message: `You just completed one of your missions!`,
		        page_url: '/home',
		        timestamp : `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
		      });
		      await updateDoc(userRef, {
		        notification_count: increment(1)
		     });
	    }
 	}

 	const sendNotifMissionElectricity = async (user_id) => {
	    const ref = doc(frdb, "users", user_id)
	    const docSnap = await getDoc(ref)
	    if (docSnap.exists()) {
	        await ApiController({
	            method: "POST",
	            endpoint: "api/send-notif-mission-comment",
	            datas: {endpoint: docSnap.data().endpoint, keys : {auth: docSnap.data().keys.auth, p256dh: docSnap.data().keys.p256dh}}
	          }).then((resp) => {
	            console.log(resp)
	          })
	      } else {
	        console.log('No such document!');
	        return null;
	      }
	}

	onMount(async() => {
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
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

{#if messageModalSuccess == 1}
<div class="mobile">
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
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card w-25 flex flex-direction-col flex-gap-regular flex-center-vertical flex-center-horizontal">
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

<div class="mobile">
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
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="accent-title-emission">Grains Consumption</div>
				</div>
				<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
					<div class="carbon-level-bar">
						<div class="carbon-bar-count" id="grains-consumption"></div>
					</div>
					<div class="flex flex-between-horizontal">
						<div class="carbon-percentage">
							{#if carbon_data}
								{carbon_data.grains_consumption} Kg CO2
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
				<div class="sub-home">Emission Level : 
				{#if carbon_data}
					{#if carbon_data.carbon_level == "Low"}
						<span class="carbon-level-low">
							{carbon_data.carbon_level}
						</span>
					{:else if carbon_data.carbon_level == "Average"}
						<span class="carbon-level-average">
							{carbon_data.carbon_level}
						</span>
					{:else}
						<span class="carbon-level-high">
							{carbon_data.carbon_level}
						</span>
					{/if}
				{/if}
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
					window.location.href = '/carbon-emission'
				}}></i>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="bg-primary 	w-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
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
						<div class="carbon-bar-count" id="home-electricity2"></div>
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
						<div class="carbon-bar-count" id="kitchen-gas2"></div>
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
						<div class="carbon-bar-count" id="vehicle-fuel2"></div>
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
						<div class="carbon-bar-count" id="meat-consumption2"></div>
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
						<div class="carbon-bar-count" id="vegetable-consumption2"></div>
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
				<div class="flex flex-direction-col flex-gap-regular">
					<div class="accent-title-emission">Grains Consumption</div>
				</div>
				<div class="flex flex-between-horizontal flex-gap-semi-small flex-direction-col">
					<div class="carbon-level-bar">
						<div class="carbon-bar-count" id="grains-consumption2"></div>
					</div>
					<div class="flex flex-between-horizontal">
						<div class="carbon-percentage">
							{#if carbon_data}
								{carbon_data.grains_consumption} Kg CO2
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
						<div class="carbon-bar-count" id="garbage2"></div>
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
						<div class="carbon-bar-count" id="airplane-flight2"></div>
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
				<div class="sub-home">Emission Level : 
				{#if carbon_data}
					{#if carbon_data.carbon_level == "Low"}
						<span class="carbon-level-low">
							{carbon_data.carbon_level}
						</span>
					{:else if carbon_data.carbon_level == "Average"}
						<span class="carbon-level-average">
							{carbon_data.carbon_level}
						</span>
					{:else}
						<span class="carbon-level-high">
							{carbon_data.carbon_level}
						</span>
					{/if}
				{/if}
				</div>
			</div>
		</div>
	</section>
</div>
