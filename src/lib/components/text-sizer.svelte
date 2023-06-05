<script>
  import { onMount } from 'svelte';
  let fontSize = 16; // Initial font size
  const maxFontSize = 30; // Maximum font size

  // Function to update the font size based on container width
  function fitText(node, options) {
    const { compressor = 1, minFontSize = Number.NEGATIVE_INFINITY, maxFontSize = Number.POSITIVE_INFINITY } = options;

    function resize() {
      const containerWidth = node.clientWidth;
      const desiredFontSize = Math.max(Math.min(containerWidth / (10 * compressor), parseFloat(maxFontSize)), parseFloat(minFontSize));
      node.style.fontSize = `${desiredFontSize}px`;
    }

    resize(); // Initial font size adjustment

    const observer = new ResizeObserver(resize);
    observer.observe(node);

    // Dispatch a custom 'resize' event when the node's font size changes
    afterUpdate(() => {
      const fontSize = parseFloat(node.style.fontSize);
      // dispatch('resize', { fontSize });
    });

    return {
      destroy() {
        observer.unobserve(node);
      },
    };
  }

  // Update the font size on mount and whenever the window is resized
  onMount(updateFontSize);
  window.addEventListener('resize', updateFontSize);
</script>

<div id="container" class="h-full w-full" use:fitText={{ compressor: 1, minFontSize: '16px', maxFontSize: '30px' }}>
Hey
  <slot />
</div>