import { Action, action, Thunk, thunk } from 'easy-peasy';

export interface UserData {
	user: {
		id: number;
		username: string;
		email: string;
	};
	token: string;
	expires: string;
}

export interface UserStore {
	data?: UserData;
	setUserData: Action<UserStore, UserData>;
	reset: Action<UserStore>;
}

const user: UserStore = {
	data: undefined,
	setUserData: action((state, payload) => {
		state.data = payload;
	}),
	reset: action((state) => {
		state.data = undefined;
	}),
};

export default user;
