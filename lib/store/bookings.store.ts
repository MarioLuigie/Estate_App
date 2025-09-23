import { create } from 'zustand';

interface BookingStore {
	startDate?: string;
	endDate?: string;
	fullname: string;
	email: string;
	phone: string;
	paymentMethod?: string;
	totalPrice: number;
	setDates: (start: string, end: string) => void;
	setUserData: (fullname: string, email: string, phone: string) => void;
	setPaymentMethod: (method: string) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
	startDate: undefined,
	endDate: undefined,
	fullname: '',
	email: '',
	phone: '',
	paymentMethod: undefined,
	totalPrice: 0,
	setDates: (start, end) => set({ startDate: start, endDate: end }),
	setUserData: (fullname, email, phone) => set({ fullname, email, phone }),
	setPaymentMethod: (method) => set({ paymentMethod: method }),
}));
