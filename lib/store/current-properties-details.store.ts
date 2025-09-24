import { create } from 'zustand';

// interface PropertyState {
//   id: string
//   name: string
//   price: number
//   imageUrl: string
//   // inne pola
// }

interface CurrentPropertiesDetailsStore {
	currentPropertiesDetails: Record<string, any>;
	setCurrentPropertiesDetails: (property: any) => void;
  resetCurrentPropertiesDetails: () => void;

}

export const useCurrentPropertiesDetailsStore = create<CurrentPropertiesDetailsStore>((set) => ({
	currentPropertiesDetails: {},
	setCurrentPropertiesDetails: (property) =>
		set((state) => ({
			currentPropertiesDetails: { ...state.currentPropertiesDetails, [property.$id]: property },
		})),
	resetCurrentPropertiesDetails: () => set({ currentPropertiesDetails: {} }),
}));
