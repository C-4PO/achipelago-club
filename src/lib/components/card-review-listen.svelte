<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import TextSizer from '$lib/components/text-sizer.svelte'
  import SpeechButton from '$lib/components/speech-button.svelte'
  import RecordButton from '$lib/components/record-button.svelte'

  import { gradeCardSpeak } from '$lib/features/lessons/api.js'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let card

  let submitPromise = null
  let voiceOverAudio = null
  let voiceOverAudioFile = null
  let voiceOverAudioType = null
  let playSuccess = false
  let recordSuccess = false
  let speechSuccess = false
  let audioIsPlaying = false

  const next = (response) => {
    dispatch('next', {
      SPEAK: response,
    })
  }

  function handleAudioPlaying() {
    audioIsPlaying = true;
  }

  function handleAudioFinished() {
    playSuccess = true
    audioIsPlaying = false;
  }

  function setVoiceOver({ audioUrl, audioType, audioFile }) {
    recordSuccess = true
    handleAudioFinished()
    voiceOverAudio = audioUrl
    voiceOverAudioType = audioType
    voiceOverAudioFile = audioFile
  }

  function handleAudioSubmit() {
    submitPromise = gradeCardSpeak({
      audioFile: voiceOverAudioFile,
      audioType: voiceOverAudioType,
      cardId: card.id
    })
    .then((response) => {
      console.log(response)
      next(response)
    })
    .catch((error) => {
      submitPromise = null
      throw error
    })
  }
</script>

<div class="p-5 flex flex-col gap-4 h-full">
  <div class="h-full flex items-center justify-center flex-col gap-2 rounded-lg" style="flex-grow: 0; overflow-y: auto;">
    <p class="text-white flex flex-wrap justify-center text-3xl">
      <ReviewerWords words={card.words}/>
    </p>
    <div class="flex gap-2">
      <SpeechButton
        playIcon="mingcute:play-fill"
        label="Listen"
        bind:audio={card.audio}
        audioType="mp3"
        on:audioPlaying={handleAudioPlaying}
        on:audioFinished={handleAudioFinished}
        disabled={audioIsPlaying}
      />
      {#if playSuccess}
        <RecordButton
          on:startedRecording={() => handleAudioPlaying()}
          on:stoppedRecording={({ detail }) => {
            setVoiceOver(detail)
          }}
          disabled={audioIsPlaying}
        />
      {/if}
      {#if recordSuccess}
        {#key voiceOverAudio}
          <SpeechButton
            label="Check"
            bind:audio={voiceOverAudio}
            audioType={voiceOverAudioType}
            on:audioPlaying={handleAudioPlaying}
            on:audioFinished={() => {
              handleAudioFinished()
              speechSuccess = true
            }}
            disabled={audioIsPlaying}
            playIcon="icomoon-free:bubble"
          />
        {/key}
      {/if}
    </div>
  </div>
  {#if !submitPromise}
    <button type="submit" class="btn btn-primary rounded-full" on:click={handleAudioSubmit} disabled={audioIsPlaying || !speechSuccess}>Next</button>
  {:else}
    {#await submitPromise}
      <button type="submit" class="btn btn-primary rounded-full" disabled>Submitting...</button>
    {:catch error}
      <button type="submit" class="btn btn-primary rounded-full" on:click={handleAudioSubmit} disabled={audioIsPlaying || !speechSuccess}>Retry</button>
    {/await}
  {/if}
</div>
