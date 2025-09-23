import { create } from 'zustand';

interface BookingStore {
	startDate?: string;
	endDate?: string;
	fullname: string;
	email: string;
	phone: string;
	paymentMethod?: 'paypal' | 'card';
	setDates: (start: string, end: string) => void;
	setUserData: (fullname: string, email: string, phone: string) => void;
	setPaymentMethod: (method: 'paypal' | 'card') => void;
	reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
	startDate: undefined,
	endDate: undefined,
	fullname: '',
	email: '',
	phone: '',
	paymentMethod: undefined,
	setDates: (start, end) => set({ startDate: start, endDate: end }),
	setUserData: (fullname, email, phone) => set({ fullname, email, phone }),
	setPaymentMethod: (method) => set({ paymentMethod: method }),
	reset: () =>
		set({
			startDate: undefined,
			endDate: undefined,
			fullname: '',
			email: '',
			phone: '',
			paymentMethod: undefined,
		}),
}));
