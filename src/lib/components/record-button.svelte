<script>
  import { parseBuffer } from 'music-metadata';
  import { onMount, createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  export let disabled = false
  export let label = 'Record';

  const dispatch = createEventDispatcher();

  let mediaRecorder;
  let chunks = [];
  let audioIsRecording = false;

  let timeRef
  let time = 0

  function startTimer() {
    timeRef = setInterval(() => {
      time = time + 1
    }, 1000)
  }

  function stopTimer() {
    clearInterval(timeRef)
    time = 0
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      startTimer()

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };


      mediaRecorder.onstop = async () => {
        let mimeType = mediaRecorder.mimeType;
        const blob = new Blob(chunks, { 'type' : mimeType }); // Changed here

        const audioType = mimeType.split('/')[1].split(';')[0];;

        const audioUrl = URL.createObjectURL(blob);
        const audioFile = new File([blob], "recordedAudio.${audioType}", { type: blob.type }); // Changed here

        dispatch('stoppedRecording', { audioUrl, audioType: audioType, audioFile}); // Dispatch stoppedRecording event with the audio URL
        stopTimer()

        // Do something with audioUrl, e.g. send to server
      };

      audioIsRecording = true;

      dispatch('startedRecording'); // Dispatch startedRecording event

    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }


  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      audioIsRecording = false;
      chunks = []; // reset chunks for the next recording
    }
  }

  function handleRecordClick() {
    if (audioIsRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }
</script>

<style>
  @keyframes vibrating {
    0% { transform: scaleY(0.9); }
    50% { transform: scaleY(1.1); }
    100% { transform: scaleY(0.9); }
  }
  .speaker {
    animation: vibrating 0.5s infinite;
  }
</style>
<div class="flex flex-col items-center">
  <button class="btn btn-circle btn-primary w-[75px] h-[75px]"  on:click={handleRecordClick} disabled={disabled && !audioIsRecording}>
    {#if audioIsRecording}
      <Icon icon="mingcute:voice-fill" class="speaker inline-block" width="30" height="30" />
    {:else}
      <Icon icon="icon-park-solid:voice" class=" inline-block" width="30" height="30" />
    {/if}
  </button>
  {#if audioIsRecording}
    <p class="text-primary">{time}s</p>
  {:else}
    <p class="text-primary">Speak</p>
  {/if}
</div>
