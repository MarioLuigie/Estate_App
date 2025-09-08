import { Models } from "react-native-appwrite";

export interface Property extends Models.Document {
  image: string;
  name: string;
  address: string;
  price: number;
  rating: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
}