// modules
import { TouchableOpacity, Image } from 'react-native';
// lib
import icons from '@/lib/constants/icons';

type NotifBellButtonProps = {
  onPress: () => void;
};

export default function SendButton({ onPress }: NotifBellButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={icons.send} className="size-7" />
    </TouchableOpacity>
  );
}
