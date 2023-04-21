<script>
  import cardBackground from '$lib/features/story-review/images/card-background.png';
  export let isFlipped;
  const onReview = (review) => {
    dispatch('review', review);
  }
</script>

<style>
  .card {
    /* width: 410px;
    height: 650px; */
    width: 100%;
    height: 100%;
  }
  .card-side {
    background-color: #2889a5;
    background-image: linear-gradient(180deg, #2889a5 0%, #2785a1 11%, #114b62 20%, #0a2132 30%, #121521 50%, #121523 100%);
  }

  .rotate {
    transform: rotateY(180deg) !important;
  }
</style>

<div class=" flex items-center rounded-md w-full h-full">
  <div class="perspective-1000 card">
    <div class:rotate-y-180={isFlipped} class="rotate-y-0 relative w-full h-full transform-60ms preserve-3d">
      <div class="rounded-[50px] card-side overflow-hidden absolute w-full h-full backface-visibility-hidden">
        <img src={cardBackground} alt="card background" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col p-5 gap-5 card-side overflow-hidden rounded-[50px] absolute w-full h-full rotate-y-180 backface-visibility-hidden">
        <slot/>
      </div>
    </div>
  </div>
</div>