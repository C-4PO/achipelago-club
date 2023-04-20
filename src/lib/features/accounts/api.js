import { singleFileUpload } from "../utilities";

export const login = ({ email, password }) => {
  return fetch('/api/log-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
    })
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  })
}

export const signup = ({ avatarImage, username, email, password }) => {
  return singleFileUpload({
    url: '/api/sign-up',
    file: avatarImage,
    additionalData: {
      username,
      email,
      password,
    }
  }).then(async (response) => {
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    throw new Error(response.statusText);
  })
}
