// modules
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
// lib
import {
	getCurrentAuthUser,
	getCurrentUser,
	getLikesByUser,
} from '@/lib/actions/appwrite';
import { useAppwrite } from '@/lib/hooks/useAppwrite';
import { useLikesStore } from '@/lib/zustand/likes-store';

interface GlobalContextType {
	isLoggedIn: boolean;
	authUser: User | null;
	loading: boolean;
	refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

interface User {
	id: string;
	$id: string;
	name: string;
	email: string;
	avatar: string | undefined;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
	const {
		data: authUser,
		loading,
		refetch,
	} = useAppwrite({
		fn: getCurrentAuthUser,
	});

	const isLoggedIn = !!authUser; // !null -> true !true -> false

	const mappedUser = authUser ? { ...authUser, id: authUser.$id } : null;

	const resetLikes = useLikesStore((s) => s.reset);
	const setManyLikes = useLikesStore((s) => s.setManyLikes);

	useEffect(() => {
		let isMounted = true;

		if (authUser) {
			(async () => {
				const user = await getCurrentUser({ authId: authUser.$id });
				if (!user || !isMounted) return;

				const userLikes = await getLikesByUser(user.$id);
				if (!isMounted) return;

				const formatted = userLikes.map((like) => ({
					propertyId: like.property,
					likeId: like.$id,
				}));

				console.log(formatted)

				setManyLikes(formatted);
			})();
		} else {
			resetLikes();
		}

		return () => {
			isMounted = false;
		};
	}, [authUser]);

	return (
		<GlobalContext.Provider
			value={{ isLoggedIn, authUser: mappedUser, loading, refetch }}
		>
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
