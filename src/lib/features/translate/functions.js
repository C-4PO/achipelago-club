//import translator from '$lib/features/translate/config.js';

export  const translate = async({ text, from = "es", to ="en-US"}) => {
  try {
    const translationResult = { text: "" } //await translator.translateText(text, from, to);
    return { data: translationResult.text }
  } catch (error) {
    return { error, type: `translateError` }
  }
}
