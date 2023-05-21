<script>
  import { generateStory } from '$lib/features/story-generate/api';
  import ReviewerCard from "$lib/components/reviewer-card.svelte";
  import { createEventDispatcher } from 'svelte'
  import { Sveltik, Form, Field } from 'sveltik'
  import * as yup from 'yup'
  import { validate } from '$lib/components/utilities'
  import ReviewSpinner from '$lib/svgs/review-spinner.svelte'
  import { saveWords } from '$lib/features/story-generate/api.js';
  import { postSentenceDeck } from '$lib/features/decks/api.js';

  let innerFlipped = false
  let isLoading = false
  let story
  let title

  const dispatch = createEventDispatcher();

  const validationSchema = yup.object().shape({
    prompt: yup.string().required('Please enter a story.')
  })

  const initialValues = {
    prompt: 'Write a story about a dog.'
  }

  async function generate({ prompt }) {
    isLoading = true;
    let { data: { story: _story, title: _title, error } } = await generateStory({ prompt })
    story = _story
    title = _title
    isLoading = false;
    innerFlipped = true
  }

  const onSubmit = (values, { errors }) => {
    generate(values)
  }

  const onAccept = () => {
    isLoading = true
    postSentenceDeck({
      title,
      originalStory: story
    }).then((res) => {
      isLoading = false
      dispatch('accept', res)
    })
  }

  const reset = () => {
    story = null
    title = null
    innerFlipped = false
  }

  const onCancel = () => {
    reset()
    dispatch('cancel')
  }

</script>

<div id="form" class="h-full p-6 flex flex-col">
  <div class="flex justify-between w-full mb-3">
    <div class="grow-1 basis-auto flex-none flex items-center">
      <h2 class="text-center text-primary text-4xl ml-4">Generate</h2>
    </div>
    <div class="basis-full flex justify-end items-center">
      <button class="btn btn-secondary ml-3" on:click={onCancel}>Cancel</button>
    </div>
  </div>
  <Sveltik
    initialValues={initialValues}
    validate={validate(validationSchema)}
    onSubmit={onSubmit}
  >
    <Form class="h-full flex flex-col gap-6" label="Story Prompt">
      <Field class="h-full" name="prompt" label="Story Prompt" let:field let:meta>
        <ReviewerCard isFlipped={innerFlipped}>
          <div slot="front" class="h-full p-1" style="flex-grow: 1">
            <textarea
              placeholder="What story would you like to generate?"
              class="text-area text-black bg-white p-4 h-full w-full rounded-3xl resize-none"
              {...field}
              on:input={field.handleInput}
              on:blur={field.handleBlur}
              disabled={isLoading}
            />
          </div>
          <div slot="back" class="text-black bg-white p-4 h-full w-full rounded-3xl relative overflow-auto">
            {story}
          </div>
        </ReviewerCard>
      </Field>
      {#if !story}
        <div class="bg-[#b2d4cc] h-[30%] rounded-3xl p-2">
          <button type="submit" class="btn btn-accent h-full w-[30%] rounded-2xl" disabled={isLoading}>
            {#if isLoading}
              <ReviewSpinner />
            {:else}
              Generate
            {/if}
          </button>
        </div>
      {:else}
        <div class="bg-[#b2d4cc] h-[30%] rounded-3xl p-2 flex gap-2">
          {#if isLoading} 
            <ReviewSpinner />
          {:else}
            <button type="button" class="btn btn-primary h-full rounded-2xl" style="flex: 1 1 50%" on:click={onAccept}>
              Read
            </button>
            <button type="button" class="btn btn-secondary h-full rounded-2xl" style="flex: 1 1 50%" on:click={reset}>
              Retry
            </button>
          {/if}
        </div>
      {/if}
    </Form>
  </Sveltik>
</div>