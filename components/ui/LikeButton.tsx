// modules
import { TouchableOpacity, Image } from 'react-native';
// lib
import icons from '@/lib/constants/icons';

type NotifBellButtonProps = {
	onPress: () => void;
};

export default function LikeButton({ onPress }: NotifBellButtonProps) {
	return (
		<TouchableOpacity onPress={onPress}>
			<Image source={icons.heart} className="size-7" tintColor={'#191D31'} />
		</TouchableOpacity>
	);
}
