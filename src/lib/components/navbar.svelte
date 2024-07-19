<script type="text/javascript">
	import icon_home from '$lib/images/logo-home.svg';

	export let pagePointer;
</script>
<div class="mobile">
	<div class="navbar w-100 flex flex-between-horizontal flex-center-vertical">
		<a href="/sustainable-home" class="no-decoration" aria-label="Sustainable Home">
			{#if pagePointer == "sustainable-home"}
				<i class="fa-solid fa-house-signal icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-house-signal icon-house-signal"></i>
			{/if}
		</a>
		<a href="/carbon-emission" class="no-decoration" aria-label="Carbon Emission">
			{#if pagePointer == "carbon-emission"}
				<i class="fa-solid fa-chart-column icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-chart-column icon-house-signal"></i>
			{/if}
		</a>
		<a href="/home" class="no-decoration" aria-label="Home">
			<div class="home-button flex flex-center-vertical flex-center-horizontal">
				<img src="{icon_home}" alt="">
			</div>
		</a>
		<a href="/eco-community" class="no-decoration" aria-label="Eco Community">
			{#if pagePointer == "eco-community"}
				<i class="fa-solid fa-earth-americas icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-earth-americas icon-house-signal"></i>
			{/if}
		</a>
		<a href="/profile" class="no-decoration" aria-label="Profile">
			{#if pagePointer == "profile"}
				<i class="fa-solid fa-user icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-user icon-house-signal"></i>
			{/if}
		</a>
	</div>	
</div>
<div class="desktop desktop-navbar">
	<div class="navbar w-100 flex flex-between-horizontal flex-center-vertical">
		<a href="/sustainable-home" class="no-decoration" aria-label="Sustainable Home">
			{#if pagePointer == "sustainable-home"}
				<i class="fa-solid fa-house-signal icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-house-signal icon-house-signal"></i>
			{/if}
		</a>
		<a href="/carbon-emission" class="no-decoration" aria-label="Carbon Emission">
			{#if pagePointer == "carbon-emission"}
				<i class="fa-solid fa-chart-column icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-chart-column icon-house-signal"></i>
			{/if}
		</a>
		<a href="/home" class="no-decoration" aria-label="Home">
			<div class="home-button flex flex-center-vertical flex-center-horizontal">
				<img src="{icon_home}" alt="" class="w-60">
			</div>
		</a>
		<a href="/eco-community" class="no-decoration" aria-label="Eco Community">
			{#if pagePointer == "eco-community"}
				<i class="fa-solid fa-earth-americas icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-earth-americas icon-house-signal"></i>
			{/if}
		</a>
		<a href="/profile" class="no-decoration" aria-label="Profile">
			{#if pagePointer == "profile"}
				<i class="fa-solid fa-user icon-house-signal active"></i>
			{:else}
				<i class="fa-solid fa-user icon-house-signal"></i>
			{/if}
		</a>
	</div>	
</div>