// Rebuild array buffer into object
export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

export function arrayBufferToBase64DeclarativeVersion(buffer: ArrayBuffer) {
  // Tworzymy Uint8Array z ArrayBuffer
  const bytes = new Uint8Array(buffer);

  // Zamieniamy każdy bajt na znak i łączymy w string
  const binary = Array.from(bytes)
    .map(b => String.fromCharCode(b))
    .join('');

  // Zamieniamy na Base64 i dodajemy prefix do Image
  return `data:image/png;base64,${btoa(binary)}`;
}
