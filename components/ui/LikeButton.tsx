// modules
import { Image, Text, TouchableOpacity } from 'react-native';
// lib
import { createLike, deleteLike } from '@/lib/actions/properties.actions';
import icons from '@/lib/constants/icons';
import { useLikesStore } from '@/lib/store/likes.store';
interface LikeButtonProps {
	propertyId: string;
}

export default function LikeButton({ propertyId }: LikeButtonProps) {
	// const { likes, setLike } = useLikesStore();
	// const likeState = likes[propertyId] || {
	// 	isLiked: false,
	// 	count: initialCount,
	// 	likeId: null,
	// };

	// const { likes, setLike } = useLikesStore();
	// const likeState = likes[propertyId];

	// Selector - subscribe only a part of state for avoid unnecessary re-renders
	const likeState = useLikesStore((state) => state.likes[propertyId]);

	const setLike = useLikesStore((state) => state.setLike);

	// Jeśli jeszcze nie ma tego property w store (initCount się nie zdążył wykonać) → nie renderuj
	if (!likeState) return null;

	const toggleLike = async () => {
		if (likeState.isLiked) {
			// optimistic update
			setLike(propertyId, false, likeState.count - 1, null);

			try {
				if (likeState.likeId) {
					await deleteLike(likeState.likeId);
				}
			} catch (err) {
				// rollback
				setLike(propertyId, true, likeState.count, likeState.likeId);
				console.error('Error removing like', err);
			}
		} else {
			// optimistic update
			setLike(propertyId, true, likeState.count + 1, likeState.likeId);

			try {
				const newLike = await createLike(propertyId);
				if (newLike) {
					setLike(propertyId, true, likeState.count + 1, newLike.$id);
				}
			} catch (err) {
				// rollback
				setLike(propertyId, false, likeState.count, null);
				console.error('Error adding like', err);
			}
		}
	};

	return (
		<TouchableOpacity onPress={toggleLike} className="flex-row items-center">
			<Text className="mr-1">{likeState.count}</Text>
			<Image
				source={likeState.isLiked ? icons.heartColor : icons.heartGray}
				className="w-8 h-8"
			/>
		</TouchableOpacity>
	);
}

// Sprawdzamy przy mount, czy user już polubił
// useEffect(() => {
// 	getLikeByUserAndProperty(userId, propertyId).then((like) => {
// 		if (like) {
// 			setLike(propertyId, true, likeState.count, like.$id);
// 		} else {
// 			setLike(propertyId, false, likeState.count, null);
// 		}
// 	});
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// }, [userId, propertyId]);

// import React, { useEffect } from "react";
// import { TouchableOpacity, Text, Image } from "react-native";
// import {
//   createLike,
//   deleteLike,
//   getLikeByUserAndProperty,
// } from "@/lib/actions/appwrite";
// import icons from "@/lib/constants/icons";
// import { useLikes } from "@/lib/likes-provider"; // <- Twój context

// interface LikeButtonProps {
//   propertyId: string;
//   userId: string;
//   initialCount: number; // liczba lajków (np. z dokumentu property)
// }

// export default function LikeButton({
//   propertyId,
//   userId,
//   initialCount,
// }: LikeButtonProps) {
//   const { likes, setLikeState } = useLikes();
//   const likeState = likes[propertyId] || {
//     isLiked: false,
//     count: initialCount,
//     likeId: null,
//   };

//   // 🔹 Przy montowaniu sprawdzamy, czy user już polubił
//   useEffect(() => {
//     getLikeByUserAndProperty(userId, propertyId).then((like) => {
//       if (like) {
//         setLikeState(propertyId, true, likeState.count, like.$id);
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId, propertyId]);

//   const toggleLike = async () => {
//     if (likeState.isLiked) {
//       // optimistic update
//       setLikeState(propertyId, false, likeState.count - 1, null);

//       try {
//         if (likeState.likeId) {
//           await deleteLike(likeState.likeId);
//         }
//       } catch (err) {
//         // rollback
//         setLikeState(propertyId, true, likeState.count, likeState.likeId);
//         console.error("Error removing like", err);
//       }
//     } else {
//       // optimistic update
//       setLikeState(propertyId, true, likeState.count + 1, likeState.likeId);

//       try {
//         const newLike = await createLike(propertyId);
//         if (newLike) {
//           setLikeState(propertyId, true, likeState.count + 1, newLike.$id);
//         }
//       } catch (err) {
//         // rollback
//         setLikeState(propertyId, false, likeState.count, null);
//         console.error("Error adding like", err);
//       }
//     }
//   };

//   return (
//     <TouchableOpacity onPress={toggleLike} className="flex-row items-center">
//       <Text className="mr-1">{likeState.count}</Text>
//       {likeState.isLiked ? (
//         <Image source={icons.heartColor} className="w-8 h-8" />
//       ) : (
//         <Image source={icons.heartGray} className="w-8 h-8" />
//       )}
//     </TouchableOpacity>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { TouchableOpacity, Text, Image } from 'react-native';
// // import { Heart } from "lucide-react-native"; // albo własna ikonka
// import {
// 	createLike,
// 	deleteLike,
// 	getLikeByUserAndProperty,
// } from '@/lib/actions/appwrite';
// import icons from '@/lib/constants/icons';

// interface LikeButtonProps {
// 	propertyId: string;
// 	userId: string;
// 	initialCount: number; // liczba lajków (żeby od razu pokazać)
// }

// export default function LikeButton({
// 	propertyId,
// 	userId,
// 	initialCount,
// }: LikeButtonProps) {
// 	const [liked, setLiked] = useState(false);
// 	const [likeId, setLikeId] = useState<string | null>(null);
// 	const [count, setCount] = useState(initialCount);

// 	useEffect(() => {
// 		// sprawdzamy czy user już polubił
// 		getLikeByUserAndProperty(userId, propertyId).then((like) => {
// 			if (like) {
// 				setLiked(true);
// 				setLikeId(like.$id);
// 			}
// 		});
// 	}, [userId, propertyId]);

// 	const toggleLike = async () => {
// 		if (liked) {
// 			// optimistic update
// 			setLiked(false);
// 			setCount((c) => c - 1);

// 			try {
// 				if (likeId) {
// 					await deleteLike(likeId);
// 					setLikeId(null);
// 				}
// 			} catch (err) {
// 				// rollback
// 				setLiked(true);
// 				setCount((c) => c + 1);
// 				console.error('Error removing like', err);
// 			}
// 		} else {
// 			// optimistic update
// 			setLiked(true);
// 			setCount((c) => c + 1);

// 			try {
// 				const newLike = await createLike(propertyId);
// 				newLike && setLikeId(newLike.$id);
// 			} catch (err) {
// 				// rollback
// 				setLiked(false);
// 				setCount((c) => c - 1);
// 				console.error('Error adding like', err);
// 			}
// 		}
// 	};

// 	return (
// 		<TouchableOpacity
// 			onPress={toggleLike}
// 			className="flex-row items-center"
// 		>
// 			{/* <Heart
//         size={24}
//         color={liked ? "red" : "gray"}
//         fill={liked ? "red" : "transparent"}
//       /> */}
// 			<Text className="mr-1">{count}</Text>
// 			{liked ? (
// 				<Image source={icons.heartColor} className="w-8 h-8" />
// 			) : (
// 				<Image source={icons.heartGray} className="w-8 h-8" />
// 			)}
// 		</TouchableOpacity>
// 	);
// }

// // modules
// import { TouchableOpacity, Image } from 'react-native';
// // lib
// import icons from '@/lib/constants/icons';

// type NotifBellButtonProps = {
// 	onPress: () => void;
// };

// export default function LikeButton({ onPress }: NotifBellButtonProps) {
// 	return (
// 		<TouchableOpacity onPress={onPress}>
// 			<Image source={icons.heart} className="size-7" tintColor={'#191D31'} />
// 		</TouchableOpacity>
// 	);
// }
