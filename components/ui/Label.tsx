// modules
import { memo } from 'react';
import {
	Text,
	View,
	Pressable,
	StyleSheet,
	ViewStyle,
	ImageStyle,
	TextStyle,
	GestureResponderEvent,
	StyleProp,
	Platform,
	Image,
	ImageSourcePropType,
} from 'react-native';

/** Preset sizes */
type Size = 'xs' | 'sm' | 'md' | 'lg';

/** Visual variants */
type Variant = 'solid' | 'outline' | 'ghost';

/** Props */
export interface LabelProps {
	text?: string;
	children?: React.ReactNode; // alternative to text
	variant?: Variant;
	size?: Size;

	/** Colors */
	backgroundColor?: string; // for solid
	borderColor?: string; // for outline
	textColor?: string;

	/** radius can be number or 'pill' for full rounding */
	borderRadius?: number | 'pill';

	/** space between icon and text */
	icon?: ImageSourcePropType;
	iconStyle?: StyleProp<ImageStyle>;
	/** custom style overrides */
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;

	/** onPress - if provided component becomes pressable */
	onPress?: (e: GestureResponderEvent) => void;

	/** accessibility / testing */
	accessibilityLabel?: string;
	testID?: string;

	/** other niceties */
	uppercase?: boolean;
	numberOfLines?: number;
	hitSlop?: { top?: number; left?: number; right?: number; bottom?: number };
	disabled?: boolean;
}

/** Defaults */
const SIZE_STYLES: Record<
	Size,
	{
		paddingVertical: number;
		paddingHorizontal: number;
		fontSize: number;
		iconSize: number;
	}
> = {
	xs: { paddingVertical: 2, paddingHorizontal: 6, fontSize: 11, iconSize: 12 },
	sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12, iconSize: 14 },
	md: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		fontSize: 14,
		iconSize: 16,
	},
	lg: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		fontSize: 16,
		iconSize: 18,
	},
};

function resolveBorderRadius(br: number | 'pill' | undefined, height: number) {
	if (br === 'pill') return height / 2;
	if (typeof br === 'number') return br;
	return 8; // default
}

export default memo(function Label({
	text,
	children,
	variant = 'solid',
	size = 'md',
	backgroundColor,
	borderColor,
	textColor,
	borderRadius = 8,
	icon,
	iconStyle,
	style,
	textStyle,
	onPress,
	accessibilityLabel,
	testID,
	uppercase = false,
	numberOfLines = 1,
	hitSlop = { top: 6, left: 6, right: 6, bottom: 6 },
	disabled = false,
}: LabelProps) {
	const sizeStyle = SIZE_STYLES[size];

	// derive defaults
	const defaultBg =
		backgroundColor ?? (variant === 'solid' ? '#f3f3f3' : 'transparent'); // dark gray fallback
	const defaultBorder =
		borderColor ?? (variant === 'outline' ? '#D1D5DB' : 'transparent');
	const defaultText =
		textColor ?? (variant === 'solid' ? '#FFFFFF' : '#111827');

	// base container style
	const baseContainer: ViewStyle = {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: sizeStyle.paddingVertical,
		paddingHorizontal: sizeStyle.paddingHorizontal,
		backgroundColor: variant === 'solid' ? defaultBg : 'transparent',
		borderColor: variant === 'outline' ? defaultBorder : 'transparent',
		borderWidth: variant === 'outline' ? StyleSheet.hairlineWidth : 0,
		opacity: disabled ? 0.6 : 1,
	};

	// approximate height to compute pill radius
	const approxHeight = sizeStyle.paddingVertical * 2 + sizeStyle.fontSize;

	const containerStyle: ViewStyle = {
		...baseContainer,
		borderRadius: resolveBorderRadius(borderRadius, approxHeight),
	};

	const textStyles: TextStyle = {
		fontSize: sizeStyle.fontSize,
		color: defaultText,
		textTransform: uppercase ? 'uppercase' : undefined,
		includeFontPadding: false,
	};

	const content = (
		<View style={[containerStyle, style]}>
			{icon ? (
				<Image
					source={icon}
					style={[
						{
							width: sizeStyle.iconSize,
							height: sizeStyle.iconSize,
							marginRight: text || children ? 8 : 0,
						},
						iconStyle,
					]}
					resizeMode="contain"
				/>
			) : null}

			{text ? (
				<Text
					numberOfLines={numberOfLines}
					style={[textStyles, textStyle]}
					accessibilityLabel={accessibilityLabel}
				>
					{text}
				</Text>
			) : (
				<View style={{}}>{children}</View>
			)}
		</View>
	);

	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				android_ripple={
					Platform.OS === 'android'
						? { color: 'rgba(0,0,0,0.08)' }
						: undefined
				}
				hitSlop={hitSlop}
				accessibilityLabel={accessibilityLabel}
				testID={testID}
				disabled={disabled}
				style={({ pressed }) => [
					// slightly scale/opacity on press for feedback
					pressed ? { transform: [{ scale: 0.995 }] } : {},
				]}
			>
				{content}
			</Pressable>
		);
	}

	return (
		<View accessibilityLabel={accessibilityLabel} testID={testID}>
			{content}
		</View>
	);
});
