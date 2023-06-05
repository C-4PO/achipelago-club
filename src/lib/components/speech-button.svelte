<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { Howl } from 'howler';
  import Icon from '@iconify/svelte';
  const dispatch = createEventDispatcher();

  export let audio;
  export let audioType = 'mp3';
  export let playIcon = 'mingcute:play-fill';
  export let disabled = false;

  let howl;
  let duration;
  let timerRef;
  let time = 1;

  let audioIsPlaying = false;

  function handleAudioPlaying() {
    dispatch('audioPlaying')
    audioIsPlaying = true;
  }

  function handleAudioFinished() {
    dispatch('audioFinished')
    audioIsPlaying = false;
  }

  onMount(() => {
    audio.then(async (audioUrl) => {
      howl = new Howl({
        src: [audioUrl],
        format: [audioType],
        onplay: () => {
          time = 0
          timerRef = setInterval(() => {
            time = time + 1
          }, 1000)
          handleAudioPlaying()
        }, // Dispatch event when audio starts playing
        onend: () => {
          time = 0
          clearInterval(timerRef)
          handleAudioFinished()
        }, // Dispatch event when audio finishes playing
        onstop: () => {
          time = 0
          clearInterval(timerRef)
          handleAudioFinished()
        }, // Dispatch event when audio finishes playing
        onload: () => duration = Math.floor(howl._duration),
      });

      howl.play();
    })
  })

  function playAudio(audioUrl) {
    if (audioIsPlaying) {
      howl.stop();
      return;
    }
    howl.play();
  }
</script>

<style>
  .circular-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
</style>
<div class="flex flex-col items-center">
{#if audio}
  {#await audio}
    <button class="btn btn-circle btn-primary w-[75px] h-[75px]">
      <span class="loading loading-spinner"></span>
    </button>
  {:then audioUrl}
  <button class="btn btn-circle btn-primary w-[75px] h-[75px]"  on:click={() => playAudio(audioUrl)} disabled={disabled && !audioIsPlaying}>
    {#if audioIsPlaying}
      <Icon icon="mingcute:pause-fill" class="inline-block" width="30" height="30" />
    {:else}
      <Icon icon={playIcon} class="inline-block" width="30" height="30" />
    {/if}
  </button>
  {:catch error}
    <button class="btn btn-circle btn-primary w-[75px] h-[75px]">
      <Icon icon="mingcute:check-fill" class="inline-block" width="30" height="30" />
    </button>
  {/await}
{:else}
  <button class="btn btn-circle btn-primary w-[75px] h-[75px]">
    <span class="loading loading-spinner"></span>
  </button>
{/if}
  <span class="text-primary time">{time}s / {duration}s</span>
</div>