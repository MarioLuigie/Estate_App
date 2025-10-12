# Estate - Mobile Application for Android

![Application intro](https://raw.githubusercontent.com/MarioLuigie/Estate_App/main/assets/images/git-hub-board.png)

**REACT NATIVE | EXPO | NODE.JS | APPWRITE | NATIVEWIND**

My website about my Estate application's architecture: https://estate-web-intro.vercel.app/

## Introduction

**Estate** – Mobile Estate App for **Android**, built with **React Native** and **Expo**.  
The application allows users to browse and host properties, view details, manage profiles, log in via **Google Authentication**, explore property locations using **Google Maps** and pay using paypal.  

The project is prepared for development with **Expo Go** and production builds with **EAS Build**.  

**How I built It?**
System Architecture and Technical Highlights.

**C1 - SYSTEM CONTEXT DIAGRAM**
![System Architecture](https://raw.githubusercontent.com/MarioLuigie/Estate_App/main/assets/images/c1.png)

**C2 - HIGH LEVEL CONTAINER DIAGRAM**
![System Architecture](https://raw.githubusercontent.com/MarioLuigie/Estate_App/main/assets/images/c2.png)

**C3 - COMPONENT DIAGRAM**
![System Architecture](https://raw.githubusercontent.com/MarioLuigie/Estate_App/main/assets/images/c3.png)

---

## Technologies

This project is built using modern mobile development technologies to ensure performance, maintainability, and scalability:

- **[React Native](https://reactnative.dev/)**: A framework for building native mobile apps using React.  
- **[Expo](https://expo.dev/)**: A platform for fast mobile development.  
- **[Expo Go](https://expo.dev/go)**: Mobile app for instantly previewing your project via QR code.  
- **[EAS Build](https://docs.expo.dev/build/introduction/)**: Build service for generating `.apk` and `.aab` Android packages.  
- **[React Native Maps](https://github.com/react-native-maps/react-native-maps)**: Integration of Google Maps for location features.  
- **[React Hook Form](https://react-hook-form.com/)**: Flexible form management library.  
- **[Zod](https://zod.dev/)**: Schema-based validation for forms and data.  
- **Authentication with Google**: Secure and seamless sign-in with Google accounts.  
- **Custom Data Fetching (inspired by TanStack useQuery)**: Efficient and centralized API calls.  
- **[Appwrite](https://appwrite.io/)**: Back office served by Appwrite platform.  


---

## Key Features

**Authentication with Google:**  
- Secure and seamless login flow using Google accounts.  

**Home Page:**  
- Displays latest and recommended properties with advanced search and filter options.  

**Explore Page:**  
- Browse all properties in a clean and intuitive interface.  

**Property Details Page:**  
- Comprehensive information about each property, including photos and key data.  

**Profile Page:**  
- Manage and customize user settings and profile information.  

**Google Maps Integration:**  
- Explore property locations directly on maps.  

**Forms and Validation:**  
- Built with **React Hook Form** and **Zod** for smooth form handling and validation.  

**Centralized Data Fetching:**  
- Custom solution for optimized API calls inspired by **TanStack useQuery**.  

**Code Architecture and Reusability:**  
- Modular, scalable, and maintainable project structure.  

---

## Planned Extensions

- **Multi-language Support** – e.g., English and Polish.  
- **Enhanced Security** – two-factor authentication.  
- **Property Owner Dashboard** – add and manage property listings.  

---

## Directory Structure

| Folder / File        | Description |
|----------------------|------------|
| `/estate_app`        | Root folder of the project |
| ├─ `/app/`           | Screens, layouts, and routing (Expo Router) |
| │  ├─ `(root)/`      | Main screens and stacks |
| │  ├─ `_layout.tsx`  | Root layout of the app |
| │  ├─ `globals.css`  | Global styles |
| │  └─ `sign-in.tsx`  | Sign-in screen |
| ├─ `/assets/`        | Static assets |
| │  ├─ `fonts/`       | Fonts |
| │  ├─ `icons/`       | Icons |
| │  └─ `images/`      | Images |
| ├─ `/components/`    | Reusable UI components |
| │  ├─ `content/`     | Content views (property, booking) |
| │  ├─ `forms/`       | Forms |
| │  ├─ `layouts/`     | Layout components |
| │  ├─ `modals/`      | Modals |
| │  ├─ `shared/`      | Shared components |
| │  └─ `ui/`          | UI elements |
| ├─ `/functions/`     | Backend logic (Appwrite, PayPal) |
| │  ├─ `appwrite-client/` | Appwrite client |
| │  ├─ `paypal/`      | Payment logic |
| │  └─ `dist/`        | Compiled/dist files |
| ├─ `/lib/`           | Business logic and tools |
| │  ├─ `actions/`     | Actions and operations |
| │  ├─ `api/`         | API client functions |
| │  ├─ `constants/`   | Constants, icons, enums |
| │  ├─ `context/`     | Global app context |
| │  ├─ `hooks/`       | Custom hooks |
| │  ├─ `mock/`        | Mock data |
| │  ├─ `services/`    | Services and integrations |
| │  ├─ `store/`       | Application state/store |
| │  ├─ `tools/`       | Helper tools |
| │  ├─ `types/`       | TypeScript types |
| │  ├─ `utils/`       | Utility functions |
| │  └─ `validators/`  | Validation logic |
| └─ **Configuration & root files** |  |
|    ├─ `.env.local`    | Environment variables |
|    ├─ `app.config.js` | Expo configuration |
|    ├─ `babel.config.js` | Babel configuration |
|    ├─ `eas.json`      | Build & deployment configuration |
|    ├─ `metro.config.js` | Metro bundler configuration |
|    ├─ `tailwind.config.js` | Tailwind configuration |
|    ├─ `tsconfig.json` | TypeScript configuration |
|    ├─ `package.json`  | Dependencies and scripts |
|    └─ `README.md`     | Project documentation |

---

## Setup

### **Prerequisites**

Make sure you have the following installed:

- [Git](https://git-scm.com/)  
- [Node.js](https://nodejs.org/)  
- [Expo CLI](https://docs.expo.dev/get-started/installation/)  
- [Expo Go](https://expo.dev/go) on your Android device  

---

### **Cloning the repository**

```bash
git clone https://github.com/your-username/estate-app.git
cd estate-app

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Running the Project (Expo Go)**

```bash
npx expo start
```

- A QR Code will appear in the terminal or browser.

- Open Expo Go on your Android device and scan the code.

- The app will start running on your phone.

**EAS Build (Android)**

1. Log in to Expo:

```bash
npx expo login
```

2. Configure EAS:

```bash
npx eas build:configure
```

3. Build the app for Android and test in dev:

```bash
npx eas build --platform android --profile development
```

4. After the process finishes, download the .apk or .aab file and install it on your phone, or publish it to Google Play.

**Setup Environment Variables**

Create a new file named `.env.local` in the main catalog and add the following content:

```env
NODE_ENV=production
# BACKEND
APPWRITE_API_KEY=
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_DATABASE_ID=
APPWRITE_BOOKINGS_COLLECTION_ID=
# PAYPAL CLIENT 
PAYPAL_API_URL=
PAYPAL_CLIENT_ID=
PAYPAL_APP_SECRET=

# FRONTEND
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_BUCKET_ID=
EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_LIKES_COLLECTION_ID=

GOOGLE_MAPS_API_KEY=

Fill in the environmental variable values with your actual credentials.

**Running the Project**

```bash
npx expo start
```

## More
For more information please contact [mk.lotocki@gmail.com](mailto:mk.lotocki@gmail.com), Mariusz Łotocki


