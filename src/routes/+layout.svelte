<script>
	import "../app.css";
</script>

<div class="md:max-w-[800px] mx-auto p-3 h-screen flex flex-col">
	<header class="navbar bg-base-10 mb-3 bg-neutral rounded-md" >
		<a class="btn btn-ghost normal-case text-xl">Archipelago Club</a>
	</header>

	<main class="w-100 h-full bg-neutral rounded-md mb-3 overflow-auto">
		<slot></slot>
	</main>
</div>
<style>
</style>
