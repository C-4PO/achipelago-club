<script>
  import { createEventDispatcher } from 'svelte'
  import { Sveltik, Form, Field } from 'sveltik'
  import Logo from '$lib/svgs/logo.svelte';
  import * as yup from 'yup'
  import AccountsAvatarPicker from '$lib/components/accounts-avatar-picker.svelte'

  const dispatch = createEventDispatcher()

  const validationSchema = yup.object().shape({
    username: yup.string()
      .min(2, 'Username must be at least 2 characters')
      .max(50, 'Username must be less than 50 characters')
      .required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must be less than 50 characters')
      .required('Required'),
    agreeTermsAndConditions: yup.boolean().oneOf([true], 'You must agree to the terms of service'),
  });

  let avatarFile;

  const validate = (fields) => {
    try {
      validationSchema.validateSync(fields, { abortEarly: false })
      return {}
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
    imageFile: null,
    username: ``,
    email: '',
    password: '',
    agreeTermsAndConditions: false,
  }

  const onSubmit = (values, { errors }) => {
    console.log(errors)
    debugger
    if (Object.keys(errors).length) {
      return
    }
    dispatch('submit', values)
  }

  const goToTermsAndConditions = () => {
    console.log('go to terms and conditions')
  }
</script>

<Sveltik
  initialValues={initialValues}
  onSubmit={onSubmit}
  validate={validate}
  let:errors
>
  <Form class="flex flex-col w-full items-center" >
    <AccountsAvatarPicker on:change={(avatar) => avatarFile = avatar} />
    <Field name="username" label="First Name" let:field let:meta>
      <div class="form-control w-full max-w-xs mb-2">
        <label class="label text-primary" for="username">Username</label>
        <input
          id="username"
          class="input w-full"
          type="text"
          placeholder="First Name"
          {...field}
          on:input={field.handleInput}
          on:blur={field.handleBlur}
        />
        {#if meta.touched && meta.error}
          <span class="text-error mt-1 px-1">{meta.error}</span>
        {/if}
      </div>
    </Field>
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
          on:input={field.handleInput}
          on:blur={field.handleBlur}
        />
        {#if meta.touched && meta.error}
          <span class="text-error mt-1 px-1">{meta.error}</span>
        {/if}
      </div>
    </Field>
    <Field name="terms" label="Terms And Conditions" let:field let:meta>
      <div class="form-control w-full max-w-xs">
        <label class="cursor-pointer label justify-start">
          <input
            type="checkbox"
            class="checkbox checkbox-primary mr-2"
            {...field}
            on:input={field.handleInput}
            on:blur={field.handleBlur}
            class:checkbox-error={meta.error}
          />
          <span class="label-text text-left text-primary">I agree to the <span>terms and conditions</span></span>
        </label>
      </div>
    </Field>
    <button class="btn btn-primary w-full max-w-xs" type="submit" >Sign Up</button>
  </Form>
  <button class="mt-1 text-neutral underline" >Would you like to login instead?</button>
</Sveltik>
