<svelte:head>
	<title>Archipela - Match Vesus Christopher</title>
	<meta name="description" content="2 Play Match" />
</svelte:head>

<script>
  import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { supermemo } from 'supermemo';
  import { cards, cardsWithStatistics } from '../../features/board/stores.js';

  let cardIdex = 0
  let cardState = {
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      dueDate: dayjs(Date.now()).toISOString(),
  }

  let cardItem = null
  let displayItem = null
  let flashcard = $cardsWithStatistics[0]

  function practice(flashcard, grade){
    const { interval, repetition, efactor } = supermemo(flashcard, grade);
    const dueDate = dayjs(Date.now()).add(interval, 'day').valueOf();
  
    return { ...flashcard, interval, repetition, efactor, dueDate };
  }

  onMount(() => {
    const practicedCard = practice(flashcard, 5)
  })

</script>

<style>
  .board-wrapper {
    height: 1000px;
    width: 100%;
    background-color: white;
    border-radius: 5px;
    position: relative;
  }
</style>

<section>
  <h1>Match Vesus Christopher</h1>

  <div class="board-wrapper">
  </div>
</section>
