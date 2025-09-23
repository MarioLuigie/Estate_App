// lib/store/entities-store.ts
import { Property } from '@/components/content/properties/PropertyCards';
import { create } from 'zustand';

interface User {
	id: string;
	$id: string;
	name: string;
	email: string;
	avatar?: string;
}

interface Agent {
	id: string;
	$id: string;
	name: string;
	phone: string;
}

interface EntitiesStore {
	properties: Record<string, Property>;
	users: Record<string, User>;
	agents: Record<string, Agent>;

	setProperty: (prop: Property) => void;
	setProperties: (props: Property[]) => void;

	setUser: (user: User) => void;
	setAgent: (agent: Agent) => void;

	reset: () => void;
}

export const useEntitiesStore = create<EntitiesStore>((set) => ({
	properties: {},
	users: {},
	agents: {},

	setProperty: (prop) =>
		set((state) => ({
			properties: { ...state.properties, [prop.$id]: prop },
		})),

	setProperties: (props) =>
		set((state) => {
			const newProps = { ...state.properties };
			props.forEach((p) => {
				newProps[p.$id] = p;
			});
			return { properties: newProps };
		}),

	setUser: (user) =>
		set((state) => ({
			users: { ...state.users, [user.$id]: user },
		})),

	setAgent: (agent) =>
		set((state) => ({
			agents: { ...state.agents, [agent.$id]: agent },
		})),

	reset: () => set({ properties: {}, users: {}, agents: {} }),
}));
