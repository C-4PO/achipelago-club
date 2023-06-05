<script>
  import ReviewerWords from '$lib/components/reviewer-words.svelte'
  import TextSizer from '$lib/components/text-sizer.svelte'
  import SpeechButton from '$lib/components/speech-button.svelte'
  import RecordButton from '$lib/components/record-button.svelte'

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let card

  let voiceOverAudioPromise = null
  let voiceOverAudioType = null
  let playSuccess = false
  let recordSuccess = false
  let speechSuccess = false
  let audioIsPlaying = false;
  let evaluationSuccess = false


  const next = () => {
    evaluationSuccess = true
    //dispatch('next')
  }

  function handleAudioPlaying() {
    audioIsPlaying = true;
  }

  function handleAudioFinished() {
    playSuccess = true
    audioIsPlaying = false;
  }

  function setVoiceOver({ audioUrl, audioType }) {
    recordSuccess = true
    handleAudioFinished()
    voiceOverAudioPromise = Promise.resolve(audioUrl)
    voiceOverAudioType = audioType
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
        <SpeechButton
          bind:audio={voiceOverAudioPromise}
          audioType={voiceOverAudioType}
          on:audioPlaying={handleAudioPlaying}
          on:audioFinished={() => {
            handleAudioFinished()
            speechSuccess = true
          }}
          disabled={audioIsPlaying}
          playIcon="icomoon-free:bubble"
        />
      {/if}
    </div>
    {#if evaluationSuccess}
      <div class="bg-white flex flex-wrap justify-center rounded-lg p-2">
        <ReviewerWords words={card.words}/>
      </div>
    {/if}
  </div>
  <button type="submit" class="btn btn-primary rounded-full" on:click={next} disabled={audioIsPlaying || !speechSuccess}>Next</button>
</div>
