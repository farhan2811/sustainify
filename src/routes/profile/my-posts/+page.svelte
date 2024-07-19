<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import example from '$lib/images/example.svg';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import { onMount } from 'svelte';
	import { frdb } from "$lib/firebaseConfig.js";
	import { doc, setDoc, getDocs, collection, query, orderBy, where, deleteDoc, updateDoc, increment, getDoc } from "firebase/firestore"; 
	import { fly, scale } from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let email = null;
	let lamp_state = 0;
	let dateObj = new Date();
	let month = dateObj.getUTCMonth();
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let messageModal = 0;
	let messageModalSuccess = 0;
	let messagePayload = null;
	let posts = [];
	let posts_real = [];
	let posts_loaded = false;
	let notifModal = 0;
	let new_notif_count = 0
	let old_notif_count = 0
	let notifList = [];
	let device_switcher = 0;

	function isOverflowY(element) {
		return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	const getAllPosts = async () => {
		const postsCollection = collection(frdb, 'posts');
	    const postsQuery = query(postsCollection, where('user_id', '==', localStorage.getItem("username")), orderBy('timestamp', 'desc'));
	    const snapshot = await getDocs(postsQuery);
	    posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

	    for (let post of posts) {
			const likesCollection = collection(frdb, 'likes');
			const likeQuery = query(likesCollection, where('post_id', '==', post.id.split("_")[1]), where('user_id', '==', localStorage.getItem("username")));
			const likeSnapshot = await getDocs(likeQuery);
			post.has_liked = !likeSnapshot.empty;
		}

		posts_real = [...posts]; // Spread the posts array to trigger reactivity
		posts_loaded = true;
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

	async function handle_like(post) {
		const postRef = doc(frdb, 'posts', post.id);
		const likesCollection = collection(frdb, 'likes');
		const likeQuery = query(likesCollection, where('post_id', '==', post.id.split("_")[1]), where('user_id', '==', localStorage.getItem("username")));
		const likeSnapshot = await getDocs(likeQuery);

		if (likeSnapshot.empty) {
			// Add like
			const likeId = doc(likesCollection).id;
			await setDoc(doc(likesCollection, likeId), {
				post_id: post.id.split("_")[1],
				user_id: localStorage.getItem("username"),
			});

			// Increment like_count
			await updateDoc(postRef, {
				like_count: increment(1)
			});
			post.like_count++;
		} else {
			// Remove like
			await deleteDoc(likeSnapshot.docs[0].ref);

			// Decrement like_count
			await updateDoc(postRef, {
				like_count: increment(-1)
			});
			post.like_count--;
		}
		post.has_liked = !post.has_liked;

		// Trigger reactivity for the specific post
		posts = posts.map(p => p.id === post.id ? { ...post } : p);
	}

	onMount(async () => {
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
		await getNotificationCount();
		await getNotificationList();
		await getAllPosts()
	});
</script>

<svelte:head>
	<title>My Posts</title>
	<meta name="description" content="My Posts Page" />
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
		<Navbar pagePointer="profile"/>
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
		<div class="vw-100 vh-15 flex flex-center-vertical flex-between-horizontal carbon-status-home">
			<div class="title-page-sh">My Posts</div>
			<a href="/eco-community/add-post" class="btn-add no-decoration" aria-label="Add Button">
				<i class="fa-solid fa-plus"></i>
			</a>
		</div>

		<div class="bg-primary {posts_loaded == true && posts_real.length != 0 ? "h-fit" : "vh-75"} card-bg template-home-bg flex flex-direction-col flex-gap-large flex-center-vertical {posts_loaded == false ? "flex-center-horizontal" : "flex-center-vertical"}" id="bg-posts">
			{#if posts_loaded}
				{#if posts_real != 0}
					{#each posts_real as post (post.id)}
						<div class="card-post w-100">
							<a href="/eco-community/{post.id.split('_')[1]}" class="no-decoration" aria-label="Link Post">
								<img src="{post.photo}" class="w-100 image-post" alt="">
							</a>
							<div class="card-body flex flex-direction-col flex-gap-semi-small">
								<div class="title-card">{post.title}</div>
								<div class="content-card">{post.caption}</div>
								<div class="flex flex-gap-regular">
									<div class="flex flex-center-vertical" on:click={() => { handle_like(post) }}>
										{#if post.has_liked}
											<i class="fa-solid fa-heart icon-post"></i>
											<div class="text-icon-post">{post.like_count}</div>
										{:else}
											<i class="fa-regular fa-heart icon-post"></i>
											<div class="text-icon-post">{post.like_count}</div>
										{/if}
									</div>
									<div class="flex flex-center-vertical">
										<i class="fa-regular fa-comment icon-post"></i>
										<div class="text-icon-post">{post.comment_count}</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="title-card-home mt-no-posts">
						No posts yet
					</div>
				{/if}
			{:else}
				<img src="{loading}" class="w-30" alt="">
			{/if}
		</div>
	</section>
</div>

<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 h-100 flex flex-direction-col page-pad relative">
		<Navbar pagePointer="profile"/>
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
		<div class="w-100 h-15 flex flex-center-vertical flex-between-horizontal carbon-status-home missions-home">
			<div class="title-page-sh">My Posts</div>
			<a href="/eco-community/add-post" class="btn-add no-decoration" aria-label="Add Button">
				<i class="fa-solid fa-plus"></i>
			</a>
		</div>

		<div class="bg-primary {posts_loaded == true && posts_real.length != 0 ? "h-fit" : "h-75"} card-bg template-home-bg flex flex-direction-col flex-gap-large flex-center-vertical {posts_loaded == false ? "flex-center-horizontal" : "flex-center-vertical"} missions-home" id="bg-posts">
			{#if posts_loaded}
				{#if posts_real != 0}
					{#each posts_real as post (post.id)}
						<div class="card-post w-100">
							<a href="/eco-community/{post.id.split('_')[1]}" class="no-decoration" aria-label="Link Post">
								<img src="{post.photo}" class="w-100 image-post" alt="">
							</a>
							<div class="card-body flex flex-direction-col flex-gap-semi-small">
								<div class="title-card">{post.title}</div>
								<div class="content-card">{post.caption}</div>
								<div class="flex flex-gap-regular">
									<div class="flex flex-center-vertical" on:click={() => { handle_like(post) }}>
										{#if post.has_liked}
											<i class="fa-solid fa-heart icon-post"></i>
											<div class="text-icon-post">{post.like_count}</div>
										{:else}
											<i class="fa-regular fa-heart icon-post"></i>
											<div class="text-icon-post">{post.like_count}</div>
										{/if}
									</div>
									<div class="flex flex-center-vertical">
										<i class="fa-regular fa-comment icon-post"></i>
										<div class="text-icon-post">{post.comment_count}</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="title-card-home mt-no-posts">
						No posts yet
					</div>
				{/if}
			{:else}
				<img src="{loading}" class="w-30" alt="">
			{/if}
		</div>
	</section>
</div>