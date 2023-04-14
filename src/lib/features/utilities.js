import { diffChars } from 'diff'
import uniq from 'lodash/uniq'
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

export async function singleFileUpload({ file, additionalData }) {
  if (!file) {
    alert("Please select a file to upload");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // Append additional key-value pairs to the FormData
  for (const [key, value] of Object.entries(additionalData)) {
    formData.append(key, value);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    alert("File uploaded successfully");
  } else {
    alert("Failed to upload file");
  }
}

async function multiFileUpload({ files, additionalData }) {
  if (!files.length) {
    alert("Please select files to upload");
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

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    alert("Files uploaded successfully");
  } else {
    alert("Failed to upload files");
  }
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