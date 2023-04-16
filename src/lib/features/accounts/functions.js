import { v4 as uuidv4 } from 'uuid'

export const login = async (supabase, { email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  }, )

  return { data, error }
}

export const uploadAvartar = async (supabase, {
  user,
  avatarImage
}) => {
  const { data, error } = await supabase.storage.from('avatars').upload(`${uuidv4()}-avatar-${user.id}`, avatarImage)
  return { data, error }
}

export const saveDeck = async (supabase, {
  ...deck
}) => {
  const { data, error, status } = await supabase.from('Decks')
    .insert(deck)
    .select()
    .limit(1)
    .single()
  return { data, error, status }
}

export const saveUserProfile = async (supabase, {
  user,
  username,
  file_path
}) => {
  const { data, error } = await supabase.from('UserProfiles').insert({
    user_id: user.id,
    username,
    file_path,
  }).select()
  .limit(1)
  .single()
  return { data, error }
}

export const saveUserDeck = async (supabase, { user_id, deck_id }) => {
  const { data, error } = await supabase.from('Users_Decks').insert({
    deck_id,
    user_id,
  }).select()
  .limit(1)
  .single()

  return { data, error }
}

export const signup = async (supabase, {
  email,
  password,
  avatarImage,
  username
}) => {

  const { data: { user } = {}, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  },  {
    metadata: {
      username,
  }})

  if (!user || signupError) {
    console.error(signupError)
    return { error: signupError }
  }

  const {
    data: avatarData,
    error: avatarError
  } = await uploadAvartar(supabase, { user, avatarImage })

  if (avatarError) {
    console.error(avatarError)
    return { error: avatarError }
  }

  const {
    data: deckData,
    error: deckError
  } = await saveDeck(supabase, {
    title: `${username} Primary Deck`,
    is_personal: true,
    backgroundImagePath:``,
  })

  if (deckError) {
    console.error(deckError)
    return { error: deckError }
  }

  const {
    data: userProfileData,
    error: userProfileError
  } = await saveUserProfile(supabase, {
    user,
    username,
    file_path: avatarData?.path
  })

  if (userProfileError) {
    console.error(userProfileError)
    return { error: userProfileError }
  }

  const {
    error: userDeckError,
  } = await saveUserDeck(supabase, {
    user_id: user?.id,
    deck_id: deckData?.id
  })

  if (userDeckError) {
    console.error(userDeckError)
    return { error: userDeckError }
  }

  return { user }
}
