<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, getDoc, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	let month_year_list = [];
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	let carbon_total;
	let carbon_level;
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let carbon_month = null;
	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let missions_list = [];
	let missions_list_sorted = [];
	let missions_loaded = false;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getUserMonthYear = async () => {
	    const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "carbon-record"));
	    querySnapshot1.forEach((doc) => 
	    	month_year_list.push(doc.id)
	    );
	    if (month_year_list.length != 0) {
	    	for (var i = 0; i < month_year_list.length; i++) {
	    	 	if (month_year_list[i] == monthNames[month]+"-"+year) {
		    		const carbon_data_snapshot = await getDoc(doc(frdb, "users", localStorage.getItem("username"), "carbon-record",  monthNames[month]+"-"+year));
		    		carbon_total = carbon_data_snapshot.data().carbon_total	
		    		carbon_level = carbon_data_snapshot.data().carbon_level
		    	} else {
		    		carbon_total = "0"
		    		carbon_level = "None"
		    	}
		    }
	    } else {
	    	carbon_total = "0"
		    carbon_level = "None"
	    }
	}

	const getMissions = async() => {
		const querySnapshot1 = await getDocs(collection(frdb, "users", localStorage.getItem("username"), "missions"));
		querySnapshot1.forEach((doc) => 
	    	missions_list.push(doc.data())
	    );
	    missions_list_sorted = missions_list.sort((a,b)=>{
	    	a.state.localeCompare(b.state)
	    })

	    // for (var i = 0; i < missions_list.length; i++) {
	    // 	if (missions_list[i].state == "unfinished") {
	    // 		missions_list.unshift(missions_list[i])
	    // 	}
	    // }
	    missions_list_sorted.reverse()
	    missions_loaded = true;
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
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		await getUserMonthYear()
		await getMissions();
	})

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Home Page" />
</svelte:head>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<Navbar pagePointer="home"/>
	<div class="vw-100 h-10 flex flex-direction-col page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-bell arrow-back"></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 vh-37 flex flex-direction-col flex-center-vertical flex-gap-regular carbon-status-home">
		{#if carbon_total && carbon_level}
			<div class="sub-home">This Month's Carbon Footprint</div>
			<div class="carbon-count">{carbon_total} Kg CO2</div>
			<div class="sub-home">Emission Level : 
				{#if carbon_level == "Low"}
					<span class="carbon-level-low">
						{carbon_level}
					</span>
				{:else if carbon_level == "Average"}
					<span class="carbon-level-average">
						{carbon_level}
					</span>
				{:else if carbon_level == "High"}
					<span class="carbon-level-high">
						{carbon_level}
					</span>
				{:else}
					<span class="carbon-level-low">
						None
					</span>
				{/if}
			</div>
		{:else}
			<img src="{loading}" class="w-30">
		{/if}
	</div>
	<div class="bg-primary vw-100 card-bg template-home-bg flex flex-direction-col flex-gap-large missions-home">
		<div class="title-card-home">
			Monthly Missions 
		</div>
		<div class="w-100 flex flex-direction-col flex-gap-semi-large {missions_loaded == true ? "h-fit" : "vh-75"} flex-center-vertical {missions_loaded == false ? "flex-center-horizontal" : "flex-center-vertical"}">
			{#if missions_loaded != false}
				{#each missions_list_sorted as mission, index}
					<div class="card card-mission w-100 {mission.state == "finished" ? "disabled-card" : ""}">
						<div class="flex flex-center-vertical flex-gap-semi-large">
							<i class="fa-solid fa-star star-missions"></i>
							<div class="flex flex-direction-col flex-gap-semi-small">
								<div class="mission-title">{mission.title}</div>
								<div class="mission-points">{mission.points} pts</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<img src="{loading}" class="w-30">
			{/if}
		</div>
	</div>
</section>
