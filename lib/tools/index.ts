type Coordinates = {
	latitude: number;
	longitude: number;
};

// Lista 40+ największych miast świata, w tym kilka polskich
const majorCities: { name: string; lat: number; lng: number }[] = [
	{ name: 'New York', lat: 40.7128, lng: -74.006 },
	{ name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
	{ name: 'Chicago', lat: 41.8781, lng: -87.6298 },
	{ name: 'London', lat: 51.5074, lng: -0.1278 },
	{ name: 'Paris', lat: 48.8566, lng: 2.3522 },
	{ name: 'Berlin', lat: 52.52, lng: 13.405 },
	{ name: 'Tokyo', lat: 35.6895, lng: 139.6917 },
	{ name: 'Shanghai', lat: 31.2304, lng: 121.4737 },
	{ name: 'Beijing', lat: 39.9042, lng: 116.4074 },
	{ name: 'Sydney', lat: -33.8688, lng: 151.2093 },
	{ name: 'Moscow', lat: 55.7558, lng: 37.6173 },
	{ name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
	{ name: 'Cairo', lat: 30.0444, lng: 31.2357 },
	{ name: 'Mumbai', lat: 19.076, lng: 72.8777 },
	{ name: 'Delhi', lat: 28.6139, lng: 77.209 },
	{ name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
	{ name: 'Singapore', lat: 1.3521, lng: 103.8198 },
	{ name: 'Seoul', lat: 37.5665, lng: 126.978 },
	{ name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
	{ name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
	{ name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
	{ name: 'Rome', lat: 41.9028, lng: 12.4964 },
	{ name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
	{ name: 'Warsaw', lat: 52.2297, lng: 21.0122 },
	{ name: 'Krakow', lat: 50.0647, lng: 19.945 },
	{ name: 'Gdansk', lat: 54.352, lng: 18.6466 },
	{ name: 'Wroclaw', lat: 51.1079, lng: 17.0385 },
	{ name: 'Vienna', lat: 48.2082, lng: 16.3738 },
	{ name: 'Lisbon', lat: 38.7223, lng: -9.1393 },
	{ name: 'Madrid', lat: 40.4168, lng: -3.7038 },
	{ name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
	{ name: 'Sao Paulo', lat: -23.5505, lng: -46.6333 },
	{ name: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
	{ name: 'Toronto', lat: 43.6532, lng: -79.3832 },
	{ name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
	{ name: 'Cape Town', lat: -33.9249, lng: 18.4241 },
	{ name: 'Lagos', lat: 6.5244, lng: 3.3792 },
	{ name: 'Dubai', lat: 25.276987, lng: 55.296249 },
	{ name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
	{ name: 'Bangui', lat: 4.3947, lng: 18.5582 },
	{ name: 'Helsinki', lat: 60.1699, lng: 24.9384 },
	{ name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
	{ name: 'Oslo', lat: 59.9139, lng: 10.7522 },
];

export function getRandomCoordinatesNearMajorCities(): Coordinates {
	const city = majorCities[Math.floor(Math.random() * majorCities.length)];

	// Dodajemy małe losowe przesunięcie (~±0.05 stopnia, ~5 km)
	const latitude = Number((city.lat + (Math.random() - 0.5) * 0.1).toFixed(6));
	const longitude = Number(
		(city.lng + (Math.random() - 0.5) * 0.1).toFixed(6)
	);

	return { latitude, longitude };
}

export function getRandomCoordinatesWorld() {
	const latitude = Number((Math.random() * 180 - 90).toFixed(6)); // -90 .. 90
	const longitude = Number((Math.random() * 360 - 180).toFixed(6)); // -180 .. 180
	return { latitude, longitude };
}

export function getRandomCoordinatesInPoland() {
	const minLat = 49.0,
		maxLat = 54.8;
	const minLng = 14.1,
		maxLng = 24.1;

	const latitude = Number(
		(Math.random() * (maxLat - minLat) + minLat).toFixed(6)
	);
	const longitude = Number(
		(Math.random() * (maxLng - minLng) + minLng).toFixed(6)
	);

	return { latitude, longitude };
}

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
		.map((b) => String.fromCharCode(b))
		.join('');

	// Zamieniamy na Base64 i dodajemy prefix do Image
	return `data:image/png;base64,${btoa(binary)}`;
}

// tools/timeGreeting.ts
export const getTimeGreeting = (): string => {
	const now = new Date();
	const hour = now.getHours();

	if (hour >= 5 && hour < 12) {
		return 'Good Morning';
	} else if (hour >= 12 && hour < 18) {
		return 'Good Afternoon';
	} else {
		return 'Good Evening';
	}
};

export function prepareImageForStorage(image: any) {
	const getFileExtension = (image: any) => {
		const name = image.name ?? image.uri.split('/').pop() ?? 'photo.jpg';
		const extMatch = name.match(/\.(\w+)$/);
		return extMatch ? extMatch[1].toLowerCase() : 'jpg';
	};

	const ext = getFileExtension(image);

	const imageToStorage = {
		...image,
		name: `photo-${Date.now()}.${ext}`,
	};

	return imageToStorage;
}


export function normalizeProperty(doc: any) {
  if (!doc) return doc;

  const normalizedImage = Array.isArray(doc.image)
    ? doc.image.map((img: any) => {
        if (typeof img?.image === "string") {
          try {
            return {
              ...img,
              image: JSON.parse(img.image), // "{url, fileId}" → {url, fileId}
            };
          } catch (e) {
            console.warn("Błąd parsowania image:", e);
            return img;
          }
        }
        return img;
      })
    : doc.image;

  return {
    ...doc,
    image: normalizedImage,
  };
}

export async function uploadWithRetry<T>(
  fn: (file: any) => Promise<T>, 
  file: any, 
  retries = 3, 
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(file);
    } catch (err) {
      console.error(`Upload attempt ${attempt} failed`, err);

      if (attempt === retries) throw err; 
      await new Promise((res) => setTimeout(res, delay * attempt)); 
    }
  }
  throw new Error("Unreachable"); // for TS
}


