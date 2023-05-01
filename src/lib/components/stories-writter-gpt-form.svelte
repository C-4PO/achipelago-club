<script>
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import { createEventDispatcher } from 'svelte'
  import { Sveltik, Form, Field } from 'sveltik'
  import * as yup from 'yup'
  import { validate } from '$lib/components/utilities'
  import ReviewSpinner from '$lib/svgs/review-spinner.svelte'

  export let isLoading = false
  let innerFlipped = false

  const dispatch = createEventDispatcher();

  const validationSchema = yup.object().shape({
    prompt: yup.string().required('Please enter a story.')
  })

  const initialValues = {
    prompt: 'Write a story about a dog.'
  }

  const onSubmit = (values, { errors }) => {
    innerFlipped = true;
    dispatch('generate', values)
  }

</script>

<div id="form" class="h-full p-6 flex flex-col">
  <div class="flex justify-between w-full mb-3">
    <div class="grow-1 basis-auto flex-none flex items-center">
      <h2 class="text-center text-primary text-4xl ml-4">Generate</h2>
    </div>
    <div class="basis-full flex justify-end items-center">
      <button class="btn btn-secondary ml-3" on:click={() => {}}>Cancel</button>
    </div>
  </div>
  <Sveltik
    initialValues={initialValues}
    validate={validate(validationSchema)}
    onSubmit={onSubmit}
  >
    <Form class="h-full flex flex-col gap-6" label="Story Prompt">
      <Field name="prompt" label="Story Prompt" let:field let:meta>
        <ReviewerCard isFlipped={innerFlipped}>
          <div slot="front" class="h-full p-1">
            <textarea
              placeholder="What story would you like to generate?"
              class="text-area text-black bg-white p-4 h-full w-full rounded-3xl resize-none"
              {...field}
              on:input={field.handleInput}
              on:blur={field.handleBlur}
            />
          </div>
          <div slot="back" class="text-black bg-white p-4 h-full w-full rounded-3xl relative">
            Hey
          </div>
        </ReviewerCard>
      </Field>
      <div class="bg-[#b2d4cc] h-[30%] rounded-3xl p-2">
        <button type="submit" class="btn btn-accent h-full w-[30%] rounded-2xl" disabled={isLoading}>
          {#if isLoading}
            <ReviewSpinner />
          {:else}
            Generate
          {/if}
        </button>
      </div>
    </Form>
  </Sveltik>
</div>