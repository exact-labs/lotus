import { action, Action } from 'easy-peasy';

export interface SiteSettings {
	backend: { address: string };
}

export interface SettingsStore {
	data?: SiteSettings;
	setSettings: Action<SettingsStore, SiteSettings>;
}

const settings: SettingsStore = {
	data: undefined,

	setSettings: action((state, payload) => {
		state.data = payload;
	}),
};

export default settings;
