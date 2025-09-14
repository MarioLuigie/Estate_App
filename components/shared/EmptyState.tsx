// modules
import { ActivityIndicator } from 'react-native';
// components
import NoResults from '@/components/shared/NoReults';

export default function EmptyState({ isLoading }: { isLoading: boolean }) {
	return isLoading ? (
		<ActivityIndicator size="large" className="text-primary-300 mt-5" />
	) : (
		<NoResults />
	);
}
