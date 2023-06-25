<script>
    export let words = [];

    export let colorPriorities = {
      "red": 1,
      "blue": 2,
      "green": 3,
      "none": 0
    };
    export let colorIndices = [
      // {index: 0, color: "red"},
      // {index: 1, color: "blue"},
      // {index: 0, color: "green"},
      // {index: 4, color: "red"},
      // {index: 5, color: "green"}
    ];

    let wordColors;
    let spaceColors;

    $: {
    // Sort colorIndices by index and color priority
      colorIndices.sort((a, b) => {
          if (a.index !== b.index) {
              return a.index - b.index;
          } else {
              return colorPriorities[b.color] - colorPriorities[a.color];
          }
      });

      // Remove duplicate indices, keeping only the one with the highest priority
      colorIndices = colorIndices.filter((colorIndex, i) => {
          if (i === 0) return true;
          return colorIndices[i - 1].index !== colorIndex.index;
      });

      wordColors = new Array(words.length).fill("none");

      colorIndices.forEach((colorIndex) => {
          wordColors[colorIndex.index] = colorIndex.color;
      });

      spaceColors = new Array(words.length - 1);

      for (let i = 0; i < words.length - 1; i++) {
          let color1 = wordColors[i];
          let color2 = wordColors[i + 1];
          let priority1 = colorPriorities[color1];
          let priority2 = colorPriorities[color2];
          spaceColors[i] = (priority1 < priority2) ? color1 : color2;
      }
    }
</script>

{#each words as word, i}
  <span style="background-color:{wordColors[i]}; display: inline">{word.displayWord}</span>{#if i < words.length - 1}<span style="background-color:{spaceColors[i]}; display: inline">&nbsp;</span>{/if}
{/each}
