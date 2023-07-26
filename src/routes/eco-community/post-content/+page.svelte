<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import placeholder from '$lib/images/image-placeholder.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount, afterUpdate } from 'svelte';
	import {frdb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection } from "firebase/firestore"; 
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';
	import profile_pic from '$lib/images/profile-pic-post.svg'
	import profile_pic_comment from '$lib/images/profile-pic-comment.svg'
	import example_post_content from '$lib/images/example-post-content.svg'

	let hidden_state = 0;
	let overflow = null;
	let device_name = null;
	let device_category = "Priority";
	let device_picture = null;
	let lamp_state = 0;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let realButton = null;
    let copyButton = null;
    let imgReal = null;


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
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

	function readURLA(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            window.$('#img-device-preview').attr('src', e.target.result);
	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		realButton = document.querySelector("#add-device-pic");
    	copyButton = document.querySelector("#btn-device-pic");
    	if (copyButton) {
		     copyButton.addEventListener("click", function(event) {
		      realButton.click();
		    })
	 	}
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
				<div class="head-input-primary text-center">{messagePayload}</div>
				<div class="flex flex-direction-col flex-gap-semi-large flex-center-vertical">
					<div class="loading-text text-center">Please wait a moment</div>
					<img src="{loading}" class="w-30">
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="comment-input flex flex-direction-col flex-gap-regular">
	<div class="title-comment-input">Comment</div>
	<div class="flex flex-gap-regular w-100">
		<input type="text" class="input-field w-80" placeholder="input comment..">
		<button class="btn-add-comment no-decoration w-20">
			<i class="fa-solid fa-paper-plane"></i>
		</button>
	</div>
</div>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 h-fit template-post-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-gap-regular flex-center-vertical">
			<img src="{profile_pic}" alt="">
			<div class="user-name-poster">@farhanaufaldy</div>
		</div>
		<img src="{example_post_content}" class="w-100">
		<div class="title-card-content">Carbon Emission</div>
		<div class="content-card-detail">Near the end of 2020, as the covid-19 pandemic continued to rage, a few climate scientists and energy experts made a prediction. They estimated that emissions from fossil fuels — which had just plummeted thanks to the global pandemic — might never again reach the heights of 2019. Perhaps, they speculated, after over a century of ever more carbon dioxide flowing into the atmosphere, the world had finally reached “peak” emissions.</div>
		<div class="content-card-detail">According to a report released last month by the Global Carbon Project, carbon emissions from fossil fuels in 2022 are expected to reach 37.5 billion tons of carbon dioxide, the highest ever recorded. That means that despite the continued fallout from the coronavirus pandemic — which caused emissions to drop by over 5 percent in 2020 — CO2 emissions are back and stronger than ever. #carbonemission</div>
		<div class="flex flex-gap-regular">
			<div class="flex flex-center-vertical">
				<i class="fa-regular fa-heart icon-detail-post"></i>
				<div class="text-icon-detail-post">537</div>
			</div>
			<div class="flex flex-center-vertical">
				<i class="fa-regular fa-comment icon-detail-post"></i>
				<div class="text-icon-detail-post">1.2K</div>
			</div>
		</div>
		<div class="divider"></div>
		<div class="flex flex-direction-col flex-gap-regular">
			<div class="flex flex-gap-regular flex-center-vertical w-100">
				<img src="{profile_pic_comment}" alt="" class="w-10">
				<div class="user-name-commenter w-90">@farhanaufaldy</div>
			</div>
			<div class="flex flex-gap-regular flex-center-vertical">
				<div class="w-10"></div>
				<div class="comment w-90">What an insightful post!</div>
			</div>
			<div class="flex flex-gap-regular flex-center-vertical">
				<div class="w-10"></div>
				<div class="reply w-90">Reply</div>
			</div>
		</div>
	</div>
</section>
