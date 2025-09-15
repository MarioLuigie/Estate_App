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

type CustomModalProps = ModalProps & {
	visible: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: string;
	onConfirm?: () => void | Promise<void>;
	onCancel?: () => void;
};

export default function CustomModal({
	visible,
	title,
	message,
	confirmText = 'OK',
	cancelText = 'Cancel',
	variant,
	onConfirm,
	onCancel,
	...rest
}: CustomModalProps) {
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		if (!onConfirm) return;

		setLoading(true);
		await onConfirm();
		setLoading(false);
	};

	return (
		<Modal visible={visible} transparent animationType="fade" {...rest}>
			<View style={styles.overlay}>
				<View style={styles.box}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>

					{loading ? (
						<ActivityIndicator
							size="large"
							color="red"
							style={{ marginTop: 20 }}
						/>
					) : (
						<View style={styles.buttons}>
							<TouchableOpacity
								onPress={onCancel}
								style={[styles.btn, styles.cancel]}
							>
								<Text style={styles.btnText}>{cancelText}</Text>
							</TouchableOpacity>
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
		marginBottom: 20,
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
});
