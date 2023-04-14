<script>
	import Logo from '$lib/svgs/logo.svelte';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { authService } from '$lib/features/accounts/services'

	import AccountsSignupForm from '$lib/components/accounts-signup-form.svelte';

	const {
		login,
    signup,
    submit,
		states,
		retry,
		step,
	} = authService()
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Achipelago Language Learning Flashcards" />
</svelte:head>

<section class="flex justify-center items-center h-full p-4" >
	{#if $step[states.chooseOption]}
		<div class="max-w-[500px] w-full aspect-[4/3] bg-secondary rounded-md flex flex-col justify-center items-center">
			<Logo class="fill-neutral w-[50%] mb-4 sm:mb-8 hover:fill-primary transition duration-300 ease-in-out"/>
			<div class="flex gap-3">
				<button on:click={() => signup()} class="btn btn-sm sm:btn-md btn-neutral">Sign Up</button>
				<button class="btn btn-sm sm:btn-md btn-neutral">Login</button>
			</div>
		</div>
	{/if}
	{#if $step[states.signup.id]}
		<div class="max-w-[500px] w-full bg-secondary rounded-md flex flex-col justify-center items-center p-10">
			<AccountsSignupForm on:submit={signup}/>
		</div>
	{/if}
</section>
