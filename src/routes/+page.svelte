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

	onMount(() => {
		overflow = isOverflowY(document.getElementById("form-login"))
		console.log(overflow)
	})
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login Page" />
</svelte:head>

<section class="bg-primary vw-100 vh-100 flex flex-direction-col">
	<div class="vw-100 vh-25">
		<img src="{vector_login}" alt="" class="vw-100 h-100 img-login">
	</div>
	<div class="vw-100 {overflow == true ? "h-fit" : "mh-75"} bg-secondary login-form-bg flex flex-direction-col flex-gap-large" id="form-login">
		<div class="flex flex-direction-col flex-center-vertical flex-gap-small">
			<div class="sub-header-login">Welcome to</div>
			<img src="{logo}" alt="" class="header-login">
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large">
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input">Email</div>
				<input type="text" name="" class="input-field w-100" placeholder="input email..">
			</div>
			<div class="flex flex-direction-col flex-gap-regular">
				<div class="head-input">Password</div>
				<input type="password" name="" class="input-field w-100" placeholder="input password..">
			</div>
		</div>
		<div class="flex flex-direction-col flex-gap-semi-large padding-btn-login">
			<button class="btn-primary w-100">Log In</button>
			<div class="flex flex-between-horizontal">
				<a href="" class="link-login">Sign Up</a>
				<a href="" class="link-login">Forgot Password</a>
			</div>
		</div>
	</div>
</section>
