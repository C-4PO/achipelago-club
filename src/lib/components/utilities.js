export const validate = (validationSchema) => (fields) => {
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