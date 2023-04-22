<script>
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  export let isFlipped;
</script>


<div class=" flex items-center rounded-md w-full h-full">
  <div class="perspective-1000 card" style="width: 100%; height: 100%;">
    <div class:rotate-y-180={isFlipped} class="rotate-y-0 relative w-full h-full transform-60ms preserve-3d">
      <div class="absolute w-full h-full backface-visibility-hidden  overflow-hidden">
        <slot name="front" {isFlipped} />
      </div>
      <div class="absolute w-full h-full rotate-y-180 backface-visibility-hidden overflow-hidden">
        <slot name="back"/>
      </div>
    </div>
  </div>
</div>