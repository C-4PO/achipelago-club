import { diffChars } from 'diff'
import uniq from 'lodash/uniq.js'
import { interpret, State } from 'xstate';
import { readable } from 'svelte/store'

export function stateIndex(obj) {
  if (typeof obj !== "object") {
    return { [obj]: true };
  }
  let newObj = {};
  for (let key in obj) {
    newObj[key] = stateIndex(obj[key]);
  }
  return newObj;
}

export async function singleFileUpload({ url, file, additionalData }) {
  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // Append additional key-value pairs to the FormData
  for (const [key, value] of Object.entries(additionalData)) {
    formData.append(key, value);
  }

  return fetch(url, {
    method: "POST",
    body: formData,
  });
}

async function multiFileUpload({ url, files, additionalData }) {
  if (!files.length) {
    return;
  }

  const formData = new FormData();

  // Append all selected files to the FormData
  for (const file of files) {
    formData.append("files[]", file);
  }

  // Append additional key-value pairs to the FormData
  for (const [key, value] of Object.entries(additionalData)) {
    formData.append(key, value);
  }

  return await fetch(url, {
    method: "POST",
    body: formData,
  });
}

export function useMachine(
  machine,
  options
) {
  const {
    context,
    guards,
    actions,
    activities,
    services,
    delays,
    state: rehydratedState,
    ...interpreterOptions
  } = options;

  const machineConfig = {
    context,
    guards,
    actions,
    activities,
    services,
    delays
  };

  const resolvedMachine = machine.withConfig(machineConfig, () => ({
    ...machine.context,
    ...context
  }));

  const service = interpret(resolvedMachine, interpreterOptions).start(
    rehydratedState ? new State(rehydratedState) : undefined
  );

  const state = readable(service.state, (set) => {
    const subscription = service.subscribe((state) => {
      if (state.changed) {
        set(state);
      }
    })
    
    return () => {
      subscription.unsubscribe();
      service.stop()
    }
  });

  return { state, send: service.send, service };
}

export function getRemovedCharIndexes(str1, str2) {
  const diff = diffChars(str1, str2);
  const removedCharIndexes = [];
  let wordIndex = 0;
  let charIndex = 0;

  diff.forEach(part => {
    const chars = part.value.split('');

    if (part.removed) {
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') {
          wordIndex++;
        } else {
          removedCharIndexes.push(wordIndex);
        }
      }
    } else {
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') {
          wordIndex++;
        }
      }
    }

    charIndex += chars.length;
  });

  return uniq(removedCharIndexes);
}