# 🏡 Estate - Real Estate Mobile Application

[![Estate intro](https://raw.githubusercontent.com/your-username/estate-app/main/assets/readme-intro.jpg)](https://github.com/your-username/estate-app)

## Introduction

**Estate** – Mobile Real Estate App for **Android**, built with **React Native** and **Expo**.  
The application allows users to browse properties, view details, manage profiles, log in via **Google Authentication**, and explore property locations using **Google Maps**.  

The project is prepared for development with **Expo Go** and production builds with **EAS Build**.  

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

- 🌍 **Multi-language Support** – e.g., English and Polish.  
- 🔒 **Enhanced Security** – two-factor authentication.  
- 📊 **Property Owner Dashboard** – add and manage property listings.  

---

## Directory Structure

- `/estate-app`  
  - `/assets/` – Static files (images, icons)  
  - `/components/` – Reusable UI components  
  - `/screens/` – Application screens (Home, Explore, Details, Profile)  
  - `/navigation/` – Navigation configuration (React Navigation)  
  - `/hooks/` – Custom hooks  
  - `/context/` – Global app context  
  - `/utils/` – Utility functions  
  - `/App.tsx` – Main entry component  
  - `package.json` – Dependencies and project scripts  

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
# Appwrite
EXPO_PUBLIC_APPWRITE_ENDPOINT=
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID=
EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=

# Google maps
GOOGLE_MAPS_API_KEY=

Fill in the environmental variable values with your actual credentials.

**Running the Project**

```bash
npx expo start
```

## More
For more information please contact [mk.lotocki@gmail.com](mailto:mk.lotocki@gmail.com).


