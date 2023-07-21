<script>
	/*import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';*/
	import vector_login from '$lib/images/vector-login.png';
	import logo from '$lib/images/logo-sustainify.png';
	import { onMount } from 'svelte';

	let hidden_state = 0;
	let overflow = null;

	function isOverflowY(element) {
	  return element.scrollHeight != Math.max(element.offsetHeight, element.clientHeight)
	}
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login Page" />
</svelte:head>

<section class="bg-secondary vw-100 vh-100 flex flex-direction-col page-pad">
	<div class="vw-100 h-10 flex flex-center-vertical page-top">
		<div class="flex flex-between-horizontal flex-center-vertical">
			<i class="fa-solid fa-arrow-left arrow-back" on:click={() => {
				history.back();
			}}></i>
			<img src="{logo}" alt="" class="w-50">
		</div>
	</div>
	<div class="bg-primary vw-100 {overflow == true ? "h-fit" : "mh-90"} template-form-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Email</div>
				<input type="email" name="" class="input-field w-100" placeholder="input email..">
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Full Name</div>
				<input type="text" name="" class="input-field w-100" placeholder="input full name..">
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Username</div>
				<input type="text" name="" class="input-field w-100" placeholder="input username..">
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Password</div>
				<input type="password" name="" class="input-field w-100" placeholder="input password..">
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input-secondary">Confirm Password</div>
				<input type="password" name="" class="input-field w-100" placeholder="input confirm password..">
			</div>
			<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
				<button class="btn-secondary w-100">Sign Up</button>
			</div>
		</div>
	</div>
</section>
