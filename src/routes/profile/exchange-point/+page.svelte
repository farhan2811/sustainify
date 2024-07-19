<script>
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import lamp from '$lib/images/lamp-example.png';
	import loading from '$lib/images/loading.gif';
	import telkomsel from '$lib/images/telkomsel.png';
	import xl from '$lib/images/xl.png';
	import axis from '$lib/images/axis.png';
	import tri from '$lib/images/tri.png';
	import shopeepay from '$lib/images/shopeepay.png';
	import dana from '$lib/images/dana.png';
	import gopay from '$lib/images/gopay.png';
	import ovo from '$lib/images/ovo.png';
	import { onMount } from 'svelte';
	import {rldb} from "$lib/firebaseConfig.js";
	import {doc, setDoc, getDocs, collection,} from "firebase/firestore"; 
    import { getDatabase, ref , update, set, onValue, remove } from 'firebase/database';
	import {fly, scale} from 'svelte/transition'
	import Navbar from '$lib/components/navbar.svelte';

	let hidden_state = 0;
	let overflow = null;
	let email = null;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}

	onMount(async() => {
		// getUserIds();
		if (localStorage.getItem("email") == "" || localStorage.getItem("email") == null) {
			window.location.href = '/'
		} else if (localStorage.getItem("username") == "" || localStorage.getItem("username") == null) {
			window.location.href = '/'
		}
	})
</script>

<svelte:head>
	<title>Exchange Point</title>
	<meta name="description" content="Exchange Point Page" />
</svelte:head>


<div class="mobile">
	<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad" >
		<Navbar pagePointer="profile"/>
		<div class="vw-100 h-10 flex flex-direction-col page-top">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
					history.back();
				}}></i>
				<img src="{logo}" class="w-50" alt="">
			</div>
		</div>
		<div class="vw-100 vh-25 flex flex-center-vertical flex-center-horizontal carbon-status-home">
			<div class="title-page-sh text-center">Exchange Point</div>
		</div>
		<div class="bg-primary vw-100 vh-100 card-bg template-home-bg flex flex-direction-col flex-gap-large">
			<div class="title-card-home">
				Pulsa
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{telkomsel}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">Telkomsel</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{xl}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">XL</div>
					</div>
				</div>
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{axis}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">Axis</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{tri}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">Tri</div>
					</div>
				</div>
			</div>
			<div class="title-card-home">
				E-Wallet
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{gopay}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">Gopay</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{dana}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">Dana</div>
					</div>
				</div>
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{ovo}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">OVO</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{shopeepay}" class="w-100 image-device" alt="" width="30" height="100">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">Shopeepay</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
<div class="desktop flex flex-center-horizontal">
	<section class="bg-secondary w-30 vh-100 flex flex-direction-col page-pad relative" >
		<Navbar pagePointer="profile"/>
		<div class="w-100 h-10 flex flex-direction-col page-top missions-home">
			<div class="flex flex-between-horizontal flex-center-vertical">
				<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
					history.back();
				}}></i>
				<img src="{logo}" class="w-50" alt="">
			</div>
		</div>
		<div class="w-100 h-25 flex flex-center-vertical flex-center-horizontal carbon-status-home missions-home">
			<div class="title-page-sh text-center">Exchange Point</div>
		</div>
		<div class="bg-primary w-100 h-100 card-bg template-home-bg flex flex-direction-col flex-gap-large missions-home">
			<div class="title-card-home">
				Pulsa
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{telkomsel}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">Telkomsel</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{xl}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">XL</div>
					</div>
				</div>
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{axis}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">Axis</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{tri}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">Tri</div>
					</div>
				</div>
			</div>
			<div class="title-card-home">
				E-Wallet
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{gopay}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">Gopay</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal ">
							<img src="{dana}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class=" flex flex-direction-col flex-gap-regular">
						<div class="title-device">Dana</div>
					</div>
				</div>
			</div>
			<div class="flex flex-gap-regular">
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{ovo}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">OVO</div>
					</div>
				</div>
				<div class="flex flex-direction-col card-device w-50 card-body flex-gap-large">
					<a href="exchange-point/exchange-form">
						<div class="flex flex-center-vertical flex-center-horizontal">
							<img src="{shopeepay}" class="w-100 image-device" alt="" width="30" height="80">
						</div>
					</a>
					<div class="flex flex-direction-col flex-gap-regular">
						<div class="title-device">Shopeepay</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
