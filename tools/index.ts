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

// tools/timeGreeting.ts
export const getTimeGreeting = (): string => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

export function getRandomCoordinatesWorld() {
  const latitude = Number((Math.random() * 180 - 90).toFixed(6));   // -90 .. 90
  const longitude = Number((Math.random() * 360 - 180).toFixed(6)); // -180 .. 180
  return { latitude, longitude };
}

export function getRandomCoordinatesInPoland() {
  const minLat = 49.0, maxLat = 54.8;
  const minLng = 14.1, maxLng = 24.1;

  const latitude = Number((Math.random() * (maxLat - minLat) + minLat).toFixed(6));
  const longitude = Number((Math.random() * (maxLng - minLng) + minLng).toFixed(6));

  return { latitude, longitude };
}


