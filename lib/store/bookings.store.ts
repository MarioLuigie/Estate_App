import { create } from 'zustand';
import { PaymentMethod, Status } from '@/lib/constants/enums';

interface BookingsStore {
	ownerId: string;
	startDate: Date | null;
	endDate: Date | null;
	status: Status;
	totalPrice: number;
	paymentMethod: PaymentMethod;
	transactionId: string;
	createdAt: Date | null;
	property: any;
	fullName: string;
	email: string;
	phone: string;
	setDates: (start: Date, end: Date) => void;
	setUserData: (fullname: string, email: string, phone: string) => void;
	setPaymentMethod: (method: PaymentMethod) => void;
	reset: () => void;
}

const defaultBookingState = {
	ownerId: '',
	startDate: null,
	endDate: null,
	status: Status.PENDING,
	totalPrice: 0,
	paymentMethod: PaymentMethod.PAYPAL,
	transactionId: '',
	createdAt: null,
	property: null,
	fullName: '',
	email: '',
	phone: '',
};

export const useBookingsStore = create<BookingsStore>((set) => ({
	...defaultBookingState,
	setDates: (start, end) => set({ startDate: start, endDate: end }),
	setUserData: (fullName, email, phone) => set({ fullName, email, phone }),
	setPaymentMethod: (method) => set({ paymentMethod: method }),
	reset: () => set(defaultBookingState),
}));
