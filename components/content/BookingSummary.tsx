// modules
import React from "react";
import { Text, View } from "react-native";
// components
import Paper from "@/components/ui/Paper";
import { formatDate } from "@/lib/tools";

interface BookingSummaryProps {
  booking: {
    startDate: string;
    endDate: string;
    status: string;
    totalPrice: number;
    createdAt: string;
  };
}

export default function BookingSummary({ booking }: BookingSummaryProps) {
  return (
    <Paper>
      <Text className="text-black-300 text-xl font-rubik-bold pb-3">
        Booking Information
      </Text>

      <View className="space-y-2">
        {/* Dates */}
        <View className="flex-row">
          <Text className="font-semibold text-black dark:text-white w-24">
            Date:
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </Text>
        </View>

        {/* Status */}
        <View className="flex-row">
          <Text className="font-semibold text-black dark:text-white w-24">
            Status:
          </Text>
          <Text
            className={`capitalize ${
              booking.status === "confirmed"
                ? "text-green-500"
                : booking.status === "pending"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {booking.status}
          </Text>
        </View>

        {/* Total Price */}
        <View className="flex-row">
          <Text className="font-semibold text-black dark:text-white w-24">
            Total price:
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            ${booking.totalPrice}
          </Text>
        </View>

        {/* Created At */}
        <View className="flex-row">
          <Text className="font-semibold text-black dark:text-white w-24">
            Created:
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            {formatDate(booking.createdAt)}
          </Text>
        </View>
      </View>
    </Paper>
  );
}
