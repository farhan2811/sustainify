<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import placeholder from '$lib/images/image-placeholder.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount, afterUpdate } from 'svelte';
	import {frdb, strg} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection, deleteDoc, getDoc, updateDoc } from "firebase/firestore"; 
	import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

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
    let title;
    let caption;
    let file;
    let uploadProgress = 0;	
    let uploaded = 0;
    let done_all_progress = 0;


	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const setPost = async (title,caption,file,user_id) => {
		uploaded = 1;	
		const postId = doc(collection(frdb, 'posts')).id;
		const storageRef = ref(strg, `posts_images/${file.name}`);
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
					await setDoc(doc(frdb, 'posts', `post_${postId}`), {
				        user_id: localStorage.getItem('username'),
				        title : title,
				        caption : caption,
				        photo : downloadURL,
				        timestamp : Date.now(),
				        like_count: 0,
				        comment_count: 0,
				      });
				done_all_progress = 1;
		        });
			})
		} catch(error) {
			console.log(error)
		}
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

	const goToPosts = () => {
		window.location.href = '/eco-community'
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

	$: progress = uploadProgress;
	$: if (progress != 100 && uploaded == 1) messageModalSuccess = 1
	$: if (progress != 100 && uploaded == 1) messagePayload = "Uploading post"
	$: if (progress == 100 && uploaded == 1) messagePayload = "Post uploaded succesfully"
	$: if (progress == 100 && uploaded == 1 && done_all_progress == 1) goToPosts();
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

<Navbar pagePointer="sustainable-home"/>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 h-fit template-home-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Post Title</div>
				<input type="text" name="" class="input-field w-100" placeholder="input post title.." bind:value={title}>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Post Caption</div>
				<textarea name="" class="input-field-capt w-100" placeholder="input post caption.." bind:value={caption}></textarea>
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Post Photo</div>
				<input type="file" hidden="hidden" name="" id="add-device-pic" on:change={(e) => {
					 file = e.target.files[0]
       				 readURLA(realButton);
       				 overflow = isOverflowY(document.getElementById("form-login"))
					console.log(overflow)
				}}>	
				<button class="btn-secondary w-100" id="btn-device-pic">Add Media</button>
				<img src="{placeholder}" class="w-100 img-device-preview" id="img-device-preview">
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100" on:click={() => {
					if (title == "" || title == null) {
						messageModal = 1;
						messagePayload = "Please fill the title";
					} else if (caption == "" || caption == null) {
						messageModal = 1;
						messagePayload = "Please fill your caption";
					} else if (file == "" || file == null) {
						messageModal = 1;
						messagePayload = "Please insert post photo";
					} else {
						setPost(title,caption,file,localStorage.getItem("username"));
					}
				}}>Add Post</button>
			</div>
		</div>
	</div>
</section>
