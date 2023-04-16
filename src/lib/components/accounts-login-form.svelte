<script>
  import { createEventDispatcher } from 'svelte'
  import { Sveltik, Form, Field } from 'sveltik'
  import Logo from '$lib/svgs/logo.svelte';
  import * as yup from 'yup'

  const dispatch = createEventDispatcher()

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be less than 50 characters')
      .required('Required'),
  });

  const validate = (fields) => {
    try {
      validationSchema.validateSync(fields, { abortEarly: false })
      return null
    } catch (error) {
      return error.inner.reduce((errors, innerError) => {
        return {
          ...errors,
          [innerError.path]: innerError.message,
        }
      }, {})
    }
  }
 const initialValues = {
    username: ``,
    email: '',
  }

  const onSubmit = (values, { errors }) => {
    dispatch('submit', values)
  }
</script>

<Sveltik
  initialValues={initialValues}
  onSubmit={onSubmit}
  validate={validate}
  let:errors
  let:setFieldValue
>
  <Form class="flex flex-col w-full items-center" >
    <Field name="email" label="Email" let:field let:meta>
      <div class="form-control w-full max-w-xs mb-2">
        <label class="label text-primary" for="email">Email</label>
        <input
          id="email"
          class="input w-full"
          type="email"
          placeholder="Email"
          {...field}
          on:input={field.handleInput}
          on:blur={field.handleBlur}
        />
        {#if meta.touched && meta.error}
          <span class="text-error mt-1 px-1">{meta.error}</span>
        {/if}
      </div>
    </Field>
    <Field name="password" label="Password" let:field let:meta>
      <div class="form-control w-full max-w-xs mb-5">
        <label class="label text-primary" for="password">Password</label> 
        <input
          id="password"
          class="input w-full"
          type="password"
          placeholder="Password"
          {...field}
          on:change={(...args) =>{
            
            console.log(args)
            field.handleInput(...args)
          }}
          on:blur={field.handleBlur}
        />
        {#if meta.touched && meta.error}
          <span class="text-error mt-1 px-1">{meta.error}</span>
        {/if}
      </div>
    </Field>
    <button class="btn btn-primary w-full max-w-xs" type="submit" >Login</button>
  </Form>
  <button class="mt-1 text-neutral underline" >Would you like to signup instead?</button>
</Sveltik>
