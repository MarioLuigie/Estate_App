// modules
import React, { useState } from 'react';
import {
	Modal,
	ModalProps,
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
} from 'react-native';
// components
import Checkbox from '@/components/ui/Checkbox';
import { isLoading } from 'expo-font';

type CustomModalProps = ModalProps & {
	visible: boolean;
	title: string;
	message: string;
	actionMessage: string;
	confirmText?: string;
	cancelText?: string;
	variant?: string;
	onConfirm?: () => void | Promise<void>;
	onCancel: () => void;
	isChecked?: boolean;
};

export default function CustomModal({
	visible,
	title,
	message,
	actionMessage,
	confirmText = 'OK',
	cancelText = 'Cancel',
	variant,
	onConfirm,
	onCancel,
	isChecked = false,
	...rest
}: CustomModalProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [checked, setChecked] = useState<boolean>(false);

	const handleConfirm = async () => {
		if (onConfirm && (!isChecked || checked)) {
			setLoading(true);
			await onConfirm();
			setLoading(false);
			handleCancel();
		} else if (!onConfirm) {
			handleCancel();
		}
	};

	const handleCancel = () => {
		onCancel();
		setChecked(false);
	};

	return (
		<Modal visible={visible} transparent animationType="fade" {...rest}>
			<View style={styles.overlay}>
				<View style={styles.box}>
					{!loading ? (
						<>
							<Text style={styles.title}>{title}</Text>
							<View style={styles.check}>
								{isChecked && (
									<Checkbox onChange={setChecked} checked={checked} />
								)}
								<Text style={styles.message}>{message}</Text>
							</View>
						</>
					) : (
						<View>
							<Text style={styles.title}>{title}</Text>
							<Text style={styles.message}>{actionMessage}</Text>
						</View>
					)}

					{loading ? (
						<ActivityIndicator
							size="large"
							color="red"
							style={{ marginTop: 20 }}
						/>
					) : (
						<View style={styles.buttons}>
							{onConfirm && (
								<TouchableOpacity
									onPress={handleCancel}
									style={[styles.btn, styles.cancel]}
								>
									<Text style={styles.btnText}>{cancelText}</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								onPress={handleConfirm}
								style={[styles.btn, styles.ok]}
							>
								<Text style={[styles.btnText, { color: 'white' }]}>
									{confirmText}
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	box: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 18,
		width: '80%',
		minHeight: 200,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 8,
		textAlign: 'center',
	},
	message: {
		fontSize: 15,
		textAlign: 'center',
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	btn: {
		flex: 1,
		padding: 12,
		borderRadius: 30,
		alignItems: 'center',
		marginHorizontal: 5,
	},
	cancel: {
		backgroundColor: '#eee',
	},
	ok: {
		backgroundColor: 'black',
	},
	btnText: {
		fontSize: 16,
		fontWeight: '600',
	},
	check: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
		marginBottom: 25,
	},
});
