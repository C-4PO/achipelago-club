<script>
	import { writable } from 'svelte/store';
	import Logo from '$lib/svgs/logo.svelte';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { authService } from '$lib/features/accounts/services'
	import Reviewer from '$lib/components/reviewer.svelte';
	import ReviewerCard from '$lib/components/reviewer-card.svelte';
	import { goto } from '$app/navigation';

	import AccountsSignupForm from '$lib/components/accounts-signup-form.svelte';
	import AccountsLoginForm from '$lib/components/accounts-login-form.svelte';

	const {
		login,
    signup,
    submit,
		states,
		retry,
		step,
		send,
		stageIndex,
	} = authService()

	const slides = writable([
		{ key: 0, id: 0, type:  `ChooseOption`},
		// { key: 1, id: 1, type: `LoginForm` },
		// { key: 2, id: 2, type: `LoginLoading` },
		// { key: 3, id: 3, type: `LoginSuccess` },
		// { key: 4, id: 4, type: `SignupForm` },
		// { key: 5, id: 5, type: `SignupLoading` },
		// { key: 6, id: 6, type: `SignupSuccess` },
		// { key: 7, id: 7, type: `TermsAndConditions` }
	])
	const index = writable(0)

	$: {
		if ($step[states.login.id]?.[states.login.success]) {
			goto(`/story-list`)
		}
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Achipelago Language Learning Flashcards" />

</svelte:head>

<Reviewer
  bind:cardIndex={$index}
  bind:slides={$slides}
  enableReview={false}
  let:slide={slide}
  let:index={index}
>

	{#if $step[states.chooseOption]}
		<ReviewerCard isFlipped={true}>
			<div slot="back" class="w-full rounded-[50px] overflow-hidden h-full bg-secondary flex flex-col items-center justify-center ">
				<Logo class="fill-neutral w-[50%] mb-4 sm:mb-8 hover:fill-primary transition duration-300 ease-in-out"/>
				<div class="flex gap-3">
					<button on:click={() => signup()} class="btn btn-sm sm:btn-md btn-neutral">Sign Up</button>
					<button on:click={() => login()} class="btn btn-sm sm:btn-md btn-neutral">Login</button>
				</div>
			</div>
		</ReviewerCard>
	{/if}
	{#if $step[states.signup.id]?.[states.signup.form] || $step[states.signup.id]?.[states.signup.error]}
		<ReviewerCard isFlipped={true}>
			<div slot="back" class="overflow-auto w- bg-secondary rounded-[50px] min-h-[400px] h-full flex flex-col md:justify-center md:items-center p-10">
				<AccountsSignupForm on:submit={(e) => {submit(e.detail)}} on:goToLogin={login}/>
			</div>
		</ReviewerCard>
	{/if}
	{#if $step[states.signup.id]?.[states.signup.loading] || $step[states.login.id]?.[states.login.loading]}
		<ReviewerCard isFlipped={true}>
			<div slot="back" class="w-full h-full bg-secondary rounded-[50px] bg-secondary flex flex-col justify-center items-center p-10 text-white">
				<h1 class="text-2xl sm:text-3xl text-center">Loading...</h1>
			</div>
		</ReviewerCard>
	{/if}
	{#if $step[states.signup.id]?.[states.signup.success]}
		<ReviewerCard isFlipped={true}>
			<div class="w-full h-full bg-secondary rounded-[50px] bg-secondary flex flex-col justify-center items-center p-10 text-white">
				<h1 class="text-2xl sm:text-3xl text-center">Success!</h1>
				<p class="text-center">Check your email for a confirmation link.</p>
			</div>
		</ReviewerCard>
	{/if}
	{#if $step[states.login.id]?.[states.login.form] || $step[states.login.id]?.[states.login.error]}
		<ReviewerCard isFlipped={true}>
			<div slot="back" class="w-full h-full bg-secondary rounded-[50px] p-10 flex flex-col justify-center items-center">
				<h1 class="text-2xl sm:text-3xl text-center text-primary">Login</h1>
				<AccountsLoginForm on:submit={(e) => {submit(e.detail)}} on:goToSignin={signup}/>
			</div>
		</ReviewerCard>
	{/if}
		{#if $step[states.login.id]?.[states.login.success]}
		<ReviewerCard isFlipped={true}>
			<div slot="back" class="w-full h-full bg-secondary rounded-[50px] bg-secondary flex flex-col justify-center items-center p-10 text-white">
				<h1 class="text-2xl sm:text-3xl text-center">Success!</h1>
			</div>
		</ReviewerCard>
	{/if}
</Reviewer>