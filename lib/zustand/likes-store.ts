import { create } from 'zustand';

interface LikeState {
  isLiked: boolean;
  count: number;
  likeId: string | null;
}

interface LikesStore {
  likes: Record<string, LikeState>;

  // ustawia stan pojedynczego property (np. po kliknięciu)
  setLike: (
    propertyId: string,
    isLiked: boolean,
    count: number,
    likeId?: string | null
  ) => void;

  // inicjalizuje count przy starcie karty
  initCount: (propertyId: string, count: number) => void;

  // ustawia wszystkie lajki usera (np. po zalogowaniu)
  setManyLikes: (likes: { propertyId: string; likeId: string }[]) => void;

  // resetuje cały store (np. przy wylogowaniu)
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

  initCount: (propertyId, count) =>
    set((state) => ({
      likes: {
        ...state.likes,
        [propertyId]: {
          isLiked: state.likes[propertyId]?.isLiked ?? false,
          likeId: state.likes[propertyId]?.likeId ?? null,
          count,
        },
      },
    })),

  setManyLikes: (likesArray) =>
    set((state) => {
      const newLikes = { ...state.likes };
      for (const { propertyId, likeId } of likesArray) {
        newLikes[propertyId] = {
          ...newLikes[propertyId],
          isLiked: true,
          likeId,
          count: newLikes[propertyId]?.count ?? 0, // zostaw count jeśli już był
        };
      }
      return { likes: newLikes };
    }),

  reset: () => set({ likes: {} }),
}));
