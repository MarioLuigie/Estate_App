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
	property: string;
	fullName: string;
	email: string;
	phone: string;

	setDates: (start: Date, end: Date) => void;
	setUserData: (
		fullname: string,
		email: string,
		phone: string,
		ownerId: string
	) => void;
	setPaymentMethod: (method: PaymentMethod) => void;
	setRest: (rest: Rest) => void;
	reset: () => void;
}

interface Rest {
	property: string;
	totalPrice: number;
	transactionId: string;
	status: Status;
	createdAt: Date;
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
	property: '',
	fullName: '',
	email: '',
	phone: '',
};

export const useBookingsStore = create<BookingsStore>((set) => ({
	...defaultBookingState,
	setDates: (start, end) => set({ startDate: start, endDate: end }),
	setUserData: (fullName, email, phone, ownerId) =>
		set({ fullName, email, phone, ownerId }),
	setPaymentMethod: (method) => set({ paymentMethod: method }),
	setRest: (rest) => set((state) => ({ ...state, ...rest })),
	reset: () => set(defaultBookingState),
}));
