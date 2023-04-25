<script>
  import { createEventDispatcher } from 'svelte'
  import { Sveltik, Form, Field } from 'sveltik'
  import * as yup from 'yup'

  import ReviewerSentence from '$lib/components/reviewer-sentence.svelte';
  import ReviewerSection from '$lib/components/reviewer-section.svelte'

  import { validate } from '$lib/components/utilities'
  
  export let front = {}

  const dispatch = createEventDispatcher();

  const validationSchema = yup.object().shape({
    translation: yup.string().required('Please enter a translation')
  })

  const initialValues = {
    translation: ''
  }
  const onSubmit = (values, { errors }) => {
    dispatch('flip', values)
  }
</script>

<Sveltik
  initialValues={initialValues}
  validate={validate(validationSchema)}
  onSubmit={onSubmit}
  let:errors
  let:setFieldValue
>
  <Form class="flex flex-col h-full gap-5 rounded-3xl px-[2px] overflow-auto">
    {#if front.concept}
      <ReviewerSection title="Word">
        <ReviewerSentence
          sentence={{ words: front.concept.words }}
          isCentered
        />
      </ReviewerSection>
    {/if}
    <ReviewerSection title="Context">
      <ReviewerSentence sentence={{ words: front.sentence.words }} title="Context"/> 
    </ReviewerSection>
    <Field name="translation" label="First Name" let:field let:meta>
      <textarea
        class="text-area text-black p-4 h-full rounded-3xl bg-white resize-none"
        placeholder="Translate the prompt {meta.error ? `required` : ``}"
        {...field}
        class:input-error={meta.error}
        on:input={field.handleInput}
        on:blur={field.handleBlur}
      /> 
    </Field>
    <button type="submit" class="btn btn-primary rounded-full">Next</button>
  </Form>
</Sveltik>