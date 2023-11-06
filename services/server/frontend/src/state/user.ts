import { Action, action, Thunk, thunk } from 'easy-peasy';

let initialState = { uuid: '', token: '', username: '', email: '', profile: { id: '', avatar: '', firstname: '', lastname: '' } };

export interface UserData {
	uuid: string;
	token: string;
	username: string;
	email: string;
	profile: {
		id: string;
		avatar: string;
		firstname: string;
		lastname: string;
	};
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
		state.data = initialState;
	}),
};

export default user;
