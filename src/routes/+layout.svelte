<script>
	import "../app.css";
	import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition'
  import Logo from '$lib/svgs/logo.svelte';
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  

  export let data;

  $: ({ supabase, session } = data);

  $: isStoryReview = data.pathname.includes('story-review');

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {

      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => subscription.unsubscribe()
  })

  async function logout() {
    
    await supabase.auth.signOut();
    goto('/');
  }
</script>

<div class="md:max-w-[717px] cardwidth:w-[450px] md:w-[717px] mx-auto p-3 flex flex-col">
	<header class="navbar bg-base-10 mb-3 bg-neutral rounded-md justify-between">
    <div class="flex">
      <a class="btn btn-ghost normal-case text-xl">Archipelago Club</a>
    </div>
    {#if isStoryReview}
      <a href="/story-list" class="btn btn-secondary">Leave</a>
    {/if}
	</header>
  {#key data.pathname}
    <main
      class="w-100 max-h-full bg-neutral rounded-[50px] md:rounded mb-3 overflow-hidden"
      in:fade={{ duration: 300, delay: 300 }}
      out:fade={{ duration: 300,  delay: 0}}
    >
      <slot></slot>
    </main>
  {/key}
  <footer class="flex justify-between items-center footer items-center p-4 bg-neutral text-neutral-content rounded">
    <div class="flex items-center">
      <Logo class="fill-current h-[36px] w-[36px]"/>
      <span class="text-center">Archipelago Club </span>
    </div> 
    <div class="flex gap-4">
      {#if session?.user?.id}
        <button class="btn btn-ghost m-0 p-1" on:click={logout}>
          <Icon icon="majesticons:logout-line" class="inline-block fill-current text-lg" width="30" height="30" />
        </button>
      {/if}
    </div>
  </footer>
</div>
