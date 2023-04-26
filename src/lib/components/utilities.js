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

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getColorByPercentage({ percentage, colors }) {
  if (colors.length < 2) {
    throw new Error('At least two colors are required');
  }

  const sectionSize = 1 / (colors.length - 1);
  const sectionIndex = Math.min(Math.floor(percentage / sectionSize), colors.length - 2);
  const color1 = colors[sectionIndex];
  const color2 = colors[sectionIndex + 1];
  const t = (percentage - (sectionIndex * sectionSize)) / sectionSize;

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(lerp(rgb1.r, rgb2.r, t));
  const g = Math.round(lerp(rgb1.g, rgb2.g, t));
  const b = Math.round(lerp(rgb1.b, rgb2.b, t));

  return rgbToHex(r, g, b);
}

