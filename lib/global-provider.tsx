import React, { createContext, ReactNode, useContext } from 'react';

import { getCurrentUser } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/hooks/useAppwrite';

interface GlobalContextType {
	isLoggedIn: boolean;
	user: User | null;
	loading: boolean;
	refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

interface User {
	$id: string;
	name: string;
	email: string;
	avatar: string | undefined;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
	const {
		data: user,
		loading,
		refetch,
	} = useAppwrite({
		fn: getCurrentUser,
	});

	const isLoggedIn = !!user; // !null -> true !true -> false

	return (
		<GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = (): GlobalContextType => {
	const context = useContext(GlobalContext);
	if (!context)
		throw new Error('useGlobalContext must be used within a GlobalProvider');

	return context;
};
