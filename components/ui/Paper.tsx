import { StyleProp, View, ViewStyle } from 'react-native';

interface PaperProps {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}

export default function Paper({ children, style }: PaperProps) {
	return (
		<View
			style={style}
			className="p-4 flex flex-col border border-zinc-200 bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden"
		>
			{children}
		</View>
	);
}
