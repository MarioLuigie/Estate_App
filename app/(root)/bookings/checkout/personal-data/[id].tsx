import CustomTouchable from '@/components/ui/CustomTouchable';
import { TABS_HEIGHT } from '@/lib/constants/layout';
import { ROUTES } from '@/lib/constants/paths';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalData() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 relative">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          display: 'flex',
          gap: 7,
          paddingVertical: 7,
        }}
        className="flex-1 bg-white dark:bg-black gap-2"
      >
        <View style={{ marginHorizontal: 12 }}>
          <Text>PERSONAL DATA FORM</Text>
          <Text>{id}</Text>
        </View>
      </ScrollView>

      {/* BOOK NOW SECTION */}
      <View
        className="flex flex-row items-center bg-[#ffffffea] w-full border-t border-r border-l border-primary-200 px-5"
        style={{ marginBottom: insets.bottom, height: TABS_HEIGHT }}
      >
        <View className="flex flex-row items-center justify-between gap-10 w-full">
          <CustomTouchable
            title="Checkout"
            onPress={() =>
              router.push(
                `${ROUTES.BOOKINGS_CHECKOUT_PAYMENT_METHOD}/${id}`
              )
            }
          />
        </View>
      </View>
    </View>
  );
}
