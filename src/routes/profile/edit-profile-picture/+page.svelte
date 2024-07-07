<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import {frdb, strg} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, deleteDoc, getDoc, updateDoc } from "firebase/firestore"; 
	import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
	import {fly, scale} from 'svelte/transition'
	import placeholder from '$lib/images/image-placeholder.svg';

	let hidden_state = 0;
	let overflow = null;
	let db_password = null;
	let old_password = null;
	let new_password = null;
	let confirm_password = null;
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let realButton = null;
    let copyButton = null;
    let imgReal = null;
    let file;
    let uploadProgress = 0;	
    let uploaded = 0;
    let done_all_progress = 0;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	function readURLA(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function (e) {
	            window.$('#img-device-preview').attr('src', e.target.result);
	        }
	        reader.readAsDataURL(input.files[0]);
	    }
	}

	const goToProfile = () => {
		window.location.href = '/profile'
	}

	const setUserData = async (file) => {
		uploaded = 1;
		const storageRef = ref(strg, `profile_images/${file.name}`);
    	const uploadTask = uploadBytesResumable(storageRef, file);
		try {
			uploadTask.on(
		      'state_changed',
		      (snapshot) => {
		        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		        uploadProgress = progress
		      },
		      (error) => {
		        console.error('Upload failed', error);
		    },
		    async () => {
				getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
				await updateDoc(doc(frdb, "users", localStorage.getItem("username")), {
					profile_picture : downloadURL
				})
				await localStorage.setItem("profile_pic", downloadURL)
				console.log(downloadURL)
				done_all_progress = 1;
		        });
			})
		} catch(error) {
			console.log(error)
		}
	}

	onMount(async() => {
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

	$: progress = uploadProgress;
	$: if (progress != 100 && uploaded == 1) messageModalSuccess = 1
	$: if (progress != 100 && uploaded == 1) messagePayload = "Changing profile picture"
	$: if (progress == 100 && uploaded == 1) messagePayload = "Update profile picture succesful"
	$: if (progress == 100 && uploaded == 1 && done_all_progress == 1) goToProfile();
</script>

<svelte:head>
	<title>Edit Profile Picture</title>
	<meta name="description" content="Edit Profile Picture Page" />
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

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="vw-100 h-fit template-form-bg flex flex-direction-col flex-gap-large pad-change-pic" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-primary">Change Profile Picture</div>
				<input type="file" hidden="hidden" name="" id="add-device-pic" on:change={(e) => {
					 file = e.target.files[0]
       				 readURLA(realButton);
       				 overflow = isOverflowY(document.getElementById("form-login"))
					console.log(overflow)
				}}>
				<button class="btn-primary w-100" id="btn-device-pic">Add Media</button>
				<img src="{placeholder}" class="w-100 img-device-preview" id="img-device-preview">
			</div>	
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-primary w-100" on:click={() => {
					if (file == "" || file == null) {
						messageModal = 1;
						messagePayload = "Please insert your image";
					} else {
						setUserData(file);
					}
				}}>Update</button>
			</div>
		</div>
	</div>
</section>
