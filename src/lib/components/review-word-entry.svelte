<script>
  import { Sveltik, Form, Field, ErrorMessage } from 'sveltik'
  import { createEventDispatcher } from 'svelte'
  import Icon from '@iconify/svelte';
  const dispatchEvent = createEventDispatcher()

  export let wordAdded
  export let cantAdd
  export let selectedWords
  export let selectedTranslations

  const initialValues = {
    sentence: ``,
    translation: ``,
    type: ``,
  }

  const onSubmit = (values) => {
    dispatchEvent(`createConcept`, values)
  }
</script>

<Sveltik {initialValues} {onSubmit}>
  <Form class="rounded-3xl bg-white p-3 text-black">
    <h3 class="text-sm font-bold text-center pb-1">Create Card</h3>
    <div class="flex justify-spacebetween">
      <div class="select-none p-1 w-full">
        <h4 class="text-xs text-center">🇪🇸</h4>
        {#if selectedWords.length > 0}
          <p class="text-center p-1">{selectedWords.map(word => word.word).join(' ')}</p>
        {:else}
          <Field name="sentence" type="text" placeholder="Type here" class="input text-center input-bordered input-sm w-full max-w-xs bg-white" />
        {/if}
      </div>
      <div class="select-none p-1 w-full text-left">
        <h4 class="text-xs text-center">🇬🇧</h4>
        {#if selectedTranslations.length > 0}
          <p class="text-center p-1">{selectedTranslations.map(word => word.word).join(' ')}</p>
        {:else}
          <Field type="text" name="translation" placeholder="Type here" class="input text-center input-bordered input-sm w-full max-w-xs bg-white" />
        {/if}
      </div>
    </div>
    <button type="submit" class="btn btn-sm btn-primary block mt-1 btn-block rounded-full" disabled={wordAdded || cantAdd}>
      {#if wordAdded}
        <Icon icon="mingcute:check-fill" class="inline-block" width="30" height="30" />
      {:else if cantAdd}
        <Icon icon="mingcute:close-fill" class="inline-block" width="30" height="30" />
      {:else}
        Add
      {/if}</button>
  </Form>
</Sveltik>