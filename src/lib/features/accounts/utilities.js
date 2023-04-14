import { browser } from '$app/environment';

export function dataURLtoFile(dataUrl, filename) {
  if (browser) {
    let arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr;

    try {
      bstr = atob(arr[1]);
    } catch (error) {
      console.error("Failed to decode base64 string:", error);
      return null;
    }

    let n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  } else {
    const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
    return buffer;
  }
}