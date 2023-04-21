<script>
  export let title = `Section`
</script>


<div class="rounded-3xl bg-white p-2 cardwidth:p-3 text-black">
  {#if title}
    <h3 class="text-sm font-bold text-center pb-1">{title}</h3>
  {/if}
  <slot/>
</div>