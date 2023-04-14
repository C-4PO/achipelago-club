<script>
  import { Sveltik, Form, Field } from 'sveltik'

</script>

<style>
  .new-card__form-element {
    margin-bottom: 15px;

  }
  .new-card__header {
    text-align: center;
  }
  .new-card__form-element label {
    display: block;
    text-align: center;
    font-size: 1.4rem;
    margin-bottom: 5px;
  }
  .new-card__field {
    display: block;
    height: 50px;
    border-radius: 5px;
    width: 100%;
    padding: 5px;
    text-align: center;
    font-size: 1.4rem;
  }
  .new-card__submit {
    display: block;
    height: 50px;
    border-radius: 5px;
    width: 100%;
    background-color: #4CAF50;
    color: white;
  }
</style>

<div>
  <Sveltik
    initialValues={{
      word: '',
      sentence: '',
      translated_word: '',
      translated_sentence: '',
    }}
    onSubmit={async (values) => {
      console.log(values)
    }}
  >
    <div class="new-card__header">
      <h1>New Card</h1>
    </div>
    <Form>
      <div class="new-card__form-element">
        <label for="word">Word</label>
        <Field name="word" label="Word" let:field let:meta>
          <input
            class="new-card__field"
            type="text"
            {...field}
            on:input={field.handleInput}
            on:blur={field.handleBlur}
          />
        </Field>
      </div>
      <div class="new-card__form-element">
        <label for="sentence">Sentence</label>
        <Field name="sentence" label="Sentence" let:field let:meta class="new-card__field">
          <input
            class="new-card__field"
            type="text"
            {...field}
            on:input={field.handleInput}
            on:blur={field.handleBlur}
          />
        </Field>
      </div>
      <div class="new-card__form-element">
        <label for="translated_word">Translated Word</label>
        <Field name="translated_word" label="Translated Word" let:field let:meta class="new-card__field">
          <input
            class="new-card__field"
            type="text"
            {...field}
            on:input={field.handleInput}
            on:blur={field.handleBlur}
          />
        </Field>
      </div>
      <div class="new-card__form-element">
        <label for="translated_sentence">Translated Sentence</label>
        <Field name="translated_sentence" label="Translated Sentence" let:field let:meta class="new-card__field">
          <input
            class="new-card__field"
            type="text"
            {...field}
            on:input={field.handleInput}
            on:blur={field.handleBlur}
          />
        </Field>
      </div>
      <button class="new-card__submit" type="submit">Submit</button>
    </Form>
  </Sveltik>
</div>