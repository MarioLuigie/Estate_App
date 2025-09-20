import { create } from 'zustand';

interface LikeState {
	isLiked: boolean;
	count: number;
	likeId: string | null;
}

interface LikesStore {
	likes: Record<string, LikeState>;
	setLike: (
		propertyId: string,
		isLiked: boolean,
		count: number,
		likeId?: string | null
	) => void;
	reset: () => void;
}

export const useLikesStore = create<LikesStore>((set) => ({
	likes: {},
	setLike: (propertyId, isLiked, count, likeId = null) =>
		set((state) => ({
			likes: {
				...state.likes,
				[propertyId]: { isLiked, count, likeId },
			},
		})),
    reset: () => set({ likes: {} }),
}));
