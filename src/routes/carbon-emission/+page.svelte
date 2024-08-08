<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, getDoc, collection, query, where, orderBy } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	let month_year_list = [];
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
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
	let carbon_bundle = [];
	let newOption = null;
	let select = null;
	let select2 = null;
	let carbon_data = null;
	let carbon_data_snapshot_2 = [];
	let notifModal = 0;
	let new_notif_count = 0
	let old_notif_count = 0
	let notifList = [];
	let device_switcher = 0;
	let modalElectricity = 0;
	let modalGas = 0;
	let modalVehicle = 0;
	let modalMeat = 0;
	let modalVegetable = 0;
	let modalGrains = 0;
	let modalWaste = 0;
	let modalAirplane = 0;


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getNotificationCount = async () => {
		const userRef = await doc(frdb, 'users', localStorage.getItem("username"));
	    const getDataUser = await getDoc(userRef);
	    old_notif_count = localStorage.getItem("notification_count");
	    new_notif_count = getDataUser.data().notification_count;
	} 

	const getNotificationList = async() => {
		const notifCollection = collection(frdb, 'notifications');
	    const notifQuery = query(notifCollection, where('user_id', '==', localStorage.getItem("username")), orderBy('timestamp', 'desc'));
	    const snapshot = await getDocs(notifQuery);
	    notifList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	    console.log(notifList)
	}

	const setNotifCount = async () => {
		localStorage.setItem("notification_count", new_notif_count);
		if (device_switcher == 0) {
			document.getElementById("red-dot1").style.display = "none"
		} else {
			document.getElementById("red-dot1").style.display = "none"
		}
	}

	const carbonGraphData = async () => {
		const carbon_data_snapshot = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	    carbon_data_snapshot.forEach((doc) => 
	    	carbon_all_month.push(doc.id)
	    );
	}

	const getUserMonthYear = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	    querySnapshot1.forEach((doc) => 
	    	month_year_list.push(doc.id)
	    );
	    for (var i = 0; i < monthNames.length; i++) {
	    	 for (var j = 0; j < month_year_list.length; j++) {
	    	 	if (month_year_list[j] == monthNames[i]+"-"+year) {
		    		const carbon_data_snapshot = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[i]+"-"+year));
		    		carbon_bundle[i] = carbon_data_snapshot.data().carbon_total	
		    	} else {
		    		carbon_bundle[i] = "0"
		    	}
	    	 }
	    }
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
	    select2 = document.querySelector("#select-month2");
	    for (var i = 0; i < carbon_all_month.length; i++) {
	    	newOption = new Option(carbon_all_month[i],carbon_all_month[i]);
	    	select2.add(newOption,undefined);
	    }
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
	    percentage_carbon_data[5] = ((carbon_data.grains_consumption / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[6] = ((carbon_data.garbage_disposal / carbon_data.carbon_total) * 100).toFixed(1)
	    percentage_carbon_data[7] = ((carbon_data.airplane_flight / carbon_data.carbon_total) * 100).toFixed(1)
	    console.log(carbon_data)
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
	}

	onMount(async() => {
		await getNotificationCount();
		await getNotificationList();
		await getCarbonData();
		// getUserIds();
		await getUserMonthYear();
		console.log(carbon_bundle)
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		const ctx = document.getElementById('myChart');
		const ctx2 = document.getElementById('myChart2');

	  new Chart(ctx, {
	    type: 'bar',
	    data: {
	      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	      datasets: [{
	        label: '# of Carbon Emission (kg)',
	        data: carbon_bundle,
	        borderWidth: 1,
	        backgroundColor : "#105157"
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

	  new Chart(ctx2, {
	    type: 'bar',
	    data: {
	      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	      datasets: [{
	        label: '# of Carbon Emission (kg)',
	        data: carbon_bundle,
	        borderWidth: 1,
	        backgroundColor : "#105157"
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
	<title>Carbon Emission</title>
	<meta name="description" content="Carbon Emission Page" />
</svelte:head>

{#if notifModal == 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						notifModal = 0
					}}></i>
					<div class="title-notif">Notifications</div>
				</div>
				<div class="flex flex-direction-col flex-gap-regular h-90 notif-scroll">
					{#each notifList as item, index}
						<a href="{item.page_url}" class="no-decoration">
							<div class="flex flex-direction-col flex-gap-small notif-border">
								<div class="notif-message">{item.message}</div>
								<div class="notif-timestamp">{item.timestamp}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						notifModal = 0
					}}></i>
					<div class="title-notif">Notifications</div>
				</div>
				<div class="flex flex-direction-col flex-gap-regular h-90 notif-scroll">
					{#each notifList as item, index}
						<a href="{item.page_url}" class="no-decoration">
							<div class="flex flex-direction-col flex-gap-small notif-border">
								<div class="notif-message">{item.message}</div>
								<div class="notif-timestamp">{item.timestamp}</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalElectricity== 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalElectricity = 0
					}}></i>
					<div class="title-notif">Electricity Usage</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.233 kg CO₂ per kWh</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This in an average carbon emission factor from electricity consumption</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Includes a mix of fossil fuels and renewable energy sources</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Emisssion factor is based on the energy grid mix, which varies in different regions and areas</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">UK Government GHG Conversion Factors for Company Reporting 2023</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalElectricity = 0
					}}></i>
					<div class="title-notif">Electricity Usage</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.233 kg CO₂ per kWh</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This in an average carbon emission factor from electricity consumption</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Includes a mix of fossil fuels and renewable energy sources</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Emisssion factor is based on the energy grid mix, which varies in different regions and areas</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">UK Government GHG Conversion Factors for Company Reporting 2023</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalGas == 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalGas = 0
					}}></i>
					<div class="title-notif">Kitchen Gas Usage</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>2.95 kg CO₂ per kg of LPG</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This in an average carbon emission produced from burning 1 kg of LPG</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Reflects the combustion of hydrocarbons in cooking or heating</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Standard conversion factor from IPCC guidelines</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">IPCC (Intergovernmental Panel on Climate Change) Guidelines for National Greenhouse Gas Inventories</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalGas = 0
					}}></i>
					<div class="title-notif">Kitchen Gas Usage</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>2.95 kg CO₂ per kg of LPG</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This in an average carbon emission produced from burning 1 kg of LPG</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Reflects the combustion of hydrocarbons in cooking or heating</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Standard conversion factor from IPCC guidelines</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">IPCC (Intergovernmental Panel on Climate Change) Guidelines for National Greenhouse Gas Inventories</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalVehicle == 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalVehicle = 0
					}}></i>
					<div class="title-notif">Vehicle Fuel</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Emission Factor</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">0.14 kg CO₂ per kilometer traveled (Motorcycle)</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">0.17 kg CO₂ per kilometer traveled (Car)</small>
						</div>
					</div>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">The number of carbon emission showed on this part is an accumulated mix of car and motorcycle travel tracked by the application</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the specific type and efficiency of the motorcycle and the car</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">UK Government GHG Conversion Factors for Company Reporting 2022</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalVehicle = 0
					}}></i>
					<div class="title-notif">Vehicle Fuel</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Emission Factor</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">0.14 kg CO₂ per kilometer traveled (Motorcycle)</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">0.17 kg CO₂ per kilometer traveled (Car)</small>
						</div>
					</div>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">The number of carbon emission showed on this part is an accumulated mix of car and motorcycle travel tracked by the application</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the specific type and efficiency of the motorcycle and the car</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">UK Government GHG Conversion Factors for Company Reporting 2022</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalMeat== 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalMeat = 0
					}}></i>
					<div class="title-notif">Meat Consumption</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>99.48 kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">High emissions due to land use changes and deforestation</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Methane emissions from enteric fermentation in ruminants</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Energy-intensive feed production and transportation</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location of meat production house. Local meat and less larger farms may produce lesser carbon emission</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalMeat = 0
					}}></i>
					<div class="title-notif">Meat Consumption</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>99.48 kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">High emissions due to land use changes and deforestation</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Methane emissions from enteric fermentation in ruminants</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Energy-intensive feed production and transportation</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location of meat production house. Local meat and less larger farms may produce lesser carbon emission</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalVegetable== 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalVegetable = 0
					}}></i>
					<div class="title-notif">Vegetable Consumption</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.43kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Lower emissions due to less intensive agricultural practices</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Minimal use of fertilizers and pesticides</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Shorter supply chains and reduced transportation emissions</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location of the vegetable production. Local vegetables may produce lesser carbon emission</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalVegetable = 0
					}}></i>
					<div class="title-notif">Vegetable Consumption</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.43kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Lower emissions due to less intensive agricultural practices</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Minimal use of fertilizers and pesticides</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Shorter supply chains and reduced transportation emissions</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location of the vegetable production. Local vegetables may produce lesser carbon emission</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalGrains== 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalGrains = 0
					}}></i>
					<div class="title-notif">Grains Consumption</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>4.45 kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Emissions from agricultural processes including plowing and harvesting</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Use of fertilizers and water in crop production</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Processing and transportation energy consumption</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location of the grains production. Local grains may produce lesser carbon emission</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalGrains = 0
					}}></i>
					<div class="title-notif">Grains Consumption</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>4.45 kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Emissions from agricultural processes including plowing and harvesting</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Use of fertilizers and water in crop production</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Processing and transportation energy consumption</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location of the grains production. Local grains may produce lesser carbon emission</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalWaste== 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalWaste = 0
					}}></i>
					<div class="title-notif">Waste Disposal</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.45 kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Emissions from waste decomposition in landfills</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Methane generation during organic waste breakdown</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Energy used in waste collection and processing</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location and the condition of the waste disposal</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">U.S. Environmental Protection Agency (EPA)</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalWaste = 0
					}}></i>
					<div class="title-notif">Waste Disposal</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.45 kg CO₂ per kg</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Emissions from waste decomposition in landfills</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Methane generation during organic waste breakdown</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Energy used in waste collection and processing</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">This emission factor is a generalized estimate and may vary depending on the location and the condition of the waste disposal</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">U.S. Environmental Protection Agency (EPA)</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}

{#if modalAirplane== 1}
<div class="mobile">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-80 h-60 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalAirplane = 0
					}}></i>
					<div class="title-notif">Airplane Flight</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.246 kg CO₂ per km</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Aviation emissions are typically higher due to the fuel-intensive nature of flying, especially at high altitudes where the impact on the atmosphere is greater.</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">The factor varies slightly depending on the flight type (domestic, short-haul, long-haul) and the specific aircraft used.</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">UK Government GHG Conversion Factors for Company Reporting 2022</small>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="desktop desktop-fix">
	<div class="modal-backdrop" in:fly={{ y: -20, duration: 600 }}>
		<div class="flex flex-center-vertical flex-center-horizontal h-100">
			<div class="card-notif w-25 h-70 flex flex-direction-col flex-gap-semi-large flex-center-horizontal">
				<div class="flex flex-between-horizontal flex-center-vertical w-100 h-10">
					<i class="fa-solid fa-xmark arrow-back" on:click={() => {
						modalAirplane = 0
					}}></i>
					<div class="title-notif">Airplane Flight</div>
				</div>
				<div class="flex flex-direction-col flex-gap-semi-small h-90 notif-scroll">
					<small><b>Emission Factor</b></small>
					<small>0.246 kg CO₂ per km</small>
					<div class="flex flex-direction-col flex-gap-semi-small">
						<small><b>Explanations</b></small>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">Aviation emissions are typically higher due to the fuel-intensive nature of flying, especially at high altitudes where the impact on the atmosphere is greater.</small>
						</div>
						<div class="flex flex-gap-small flex-center-vertical">
							<div class="flex flex-start-vertical h-100 p-bullet">
								<div class="bullet-point"></div>
							</div>
							<small class="text-justify line-point">The factor varies slightly depending on the flight type (domestic, short-haul, long-haul) and the specific aircraft used.</small>
						</div>
					</div>
					<small><b>Source</b></small>
					<small class="text-justify line-point">UK Government GHG Conversion Factors for Company Reporting 2022</small>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}


<div class="mobile">
	<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
		<Navbar pagePointer="carbon-emission"/>
		<div class="vw-100 h-10 flex flex-direction-col page-top">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<div class="notif-icon flex flex-center-vertical" on:click={() => {
					if (notifModal == 0) {
						notifModal = 1
						device_switcher = 0;
						setNotifCount();
					} else {
						notifModal = 0
					}
				}}>
					<i class="fa-solid fa-bell arrow-back"></i>
					{#if old_notif_count < new_notif_count}
						<div class="small-red-dot"  id="red-dot1"></div>
					{/if}
				</div>
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
				<div class="flex flex-between-horizontal flex-center-vertical-vertical">
					<div class="accent-title-emission">Home Electricity Usage</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalElectricity = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Kitchen Gas Usage</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalGas = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Vehicle Fuel</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalVehicle = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Meat Consumption</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalMeat = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Vegetable Consumption</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalVegetable = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Grains Consumption</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalGrains = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Garbage</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalWaste = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Airplane Flight</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalAirplane = 1;
					}}></i>
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
			{/if}
		</div>
	</section>
</div>

<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad relative">
		<Navbar pagePointer="carbon-emission"/>
		<div class="w-100 h-10 flex flex-direction-col page-top missions-home">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<div class="notif-icon flex flex-center-vertical" on:click={() => {
					if (notifModal == 0) {
						notifModal = 1
						device_switcher = 0;
						setNotifCount();
					} else {
						notifModal = 0
					}
				}}>
					<i class="fa-solid fa-bell arrow-back"></i>
					{#if old_notif_count < new_notif_count}
						<div class="small-red-dot"  id="red-dot2"></div>
					{/if}
				</div>
				<img src="{logo}" alt="" class="w-50">
			</div>
		</div>
		<div class="w-100 h-30 flex flex-direction-col flex-center-vertical flex-gap-regular missions-home carbon-status-home-desktop">
			<div class="chart-container w-100 missions-home">
				<div class="chart-container-body">
					<canvas id="myChart2"></canvas>
				</div>
			</div>
		</div>
		<div class="bg-primary w-100 card-bg template-home-bg flex flex-direction-col flex-gap-semi-large missions-home">
			<a href="/carbon-emission/vehicle-tracker/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal"><i class="fa-solid fa-car"></i>Vehicle Tracker</button>
			</a>
			<a href="/carbon-emission/emission-calculator/" class="no-decoration">
				<button class="btn-secondary w-100 flex flex-gap-regular flex-center-vertical flex-center-horizontal"><i class="fa-solid fa-calculator"></i>Emission Calculator</button>
			</a>
			<div class="title-card-home">
				Emission Detail
			</div>	
			<select class="select-2" id="select-month2" on:change={()=>{
				let e = document.getElementById("select-month2");
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Home Electricity Usage</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalElectricity = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Kitchen Gas Usage</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalGas = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Vehicle Fuel</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalVehicle = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Meat Consumption</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalMeat = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Vegetable Consumption</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalVegetable = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Grains Consumption</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalGrains = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Garbage</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalWaste = 1;
					}}></i>
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
				<div class="flex flex-between-horizontal flex-center-vertical">
					<div class="accent-title-emission">Airplane Flight</div>
					<i class="fa-solid fa-circle-info icon-info" on:click={() => {
						modalAirplane = 1;
					}}></i>
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
			{/if}
		</div>
	</section>
</div>