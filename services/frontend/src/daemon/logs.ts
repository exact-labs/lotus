import ky from 'ky';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';

const logs = async (type: string, page: number) => {
	const settings = store.getState().settings.data;
	return await ky.get(`${settings?.backend.address}/logs/0?type=${type}&page=${page}`).json();
};

export default logs;
