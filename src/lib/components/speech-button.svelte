<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { Howl } from 'howler';
  import Icon from '@iconify/svelte';
  const dispatch = createEventDispatcher();

  export let audio;
  export let audioType = 'mp3';
  export let playIcon = 'mingcute:play-fill';
  export let label = 'Play';
  export let disabled = false;

  let howl;
  let duration;
  let timerRef;
  let time = 1;
  let loaded = false

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
    if (audio) {
      howl = new Howl({
        src: [audio],
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
        onload: () => {
          howl.play();
          loaded = true
          duration = Math.floor(howl._duration)
          handleAudioPlaying()
        },
        onloaderror: (e) => {
          console.log(howl)
          console.log(e)
        }
      });
    }
  })

  function playAudio() {
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
  {#if !loaded}
    <button class="btn btn-circle btn-primary w-[75px] h-[75px]">
      <span class="loading loading-spinner"></span>
    </button>
  {:else}
    <button class="btn btn-circle btn-primary w-[75px] h-[75px]"  on:click={() => playAudio()} disabled={disabled && !audioIsPlaying}>
      {#if audioIsPlaying}
        <Icon icon="mingcute:pause-fill" class="inline-block" width="30" height="30" />
      {:else}
        <Icon icon={playIcon} class="inline-block" width="30" height="30" />
      {/if}
    </button>
  {/if}
  {#if audioIsPlaying}
    <span class="text-primary time">{time}s / {duration}s</span>
  {:else}
    <span class="text-primary">{label}</span>
  {/if}
</div>