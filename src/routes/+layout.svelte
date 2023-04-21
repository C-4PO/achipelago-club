<script>
	import "../app.css";
	import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;

  $: ({ supabase, session } = data);

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
</script>

<div class="md:max-w-[717px] cardwidth:w-[450px] md:w-[717px] mx-auto p-3 flex flex-col">
	<header class="navbar bg-base-10 mb-3 bg-neutral rounded-md" >
		<a class="btn btn-ghost normal-case text-xl">Archipelago Club</a>
	</header>

	<main class="w-100 max-h-full bg-neutral rounded-[50px] md:rounded mb-3 overflow-hidden">
		<slot></slot>
	</main>
</div>
