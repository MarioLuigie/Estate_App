import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Property } from '@/lib/types/appwrite-types';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-md overflow-hidden mb-4"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Obraz główny */}
      {property.image && (
        <Image
          source={{ uri: property.image }}
          className="w-full h-40"
          resizeMode="cover"
        />
      )}

      {/* Treść */}
      <View className="p-4">
        {/* Nazwa nieruchomości */}
        <Text className="text-lg font-semibold text-black-300 mb-1">
          {property?.name}
        </Text>

        {/* Cena */}
        <Text className="text-base font-bold text-primary-300 mb-1">
          ${property?.price.toLocaleString()}
        </Text>

        {/* Podstawowe informacje */}
        <View className="flex-row justify-between mt-2">
          <Text className="text-sm text-gray-500">{property?.bedrooms} Beds</Text>
          <Text className="text-sm text-gray-500">{property?.bathrooms} Baths</Text>
          <Text className="text-sm text-gray-500">{property?.area} sqft</Text>
        </View>

        {/* Ocena */}
        {property.rating && (
          <Text className="text-sm text-yellow-500 mt-2">⭐ {property?.rating}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
