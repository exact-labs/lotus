import api from '@/api';
import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState, Fragment } from 'react';
import { Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login } from '@/components/pages';
import { store, ApplicationStore } from '@/state';
import { Server } from '@/components/pages/servers';
import { Services, Processes, View } from '@/components/pages/dashboard';
import { Navigation } from '@/components/elements/dashboard';
import { Spinner } from '@/components/elements/generic';

const Router = () => {
	const [loaded, setLoaded] = useState(false);
	const user = useStoreState((state: ApplicationStore) => state.user.data);

	useEffect(() => {
		/* refresh token */
		api.auth
			.refresh()
			.then((data: any) => {
				store.getActions().user.setUserData(data);
				setLoaded(true);
			})
			.finally(() => setLoaded(true));
	}, []);

	if (!loaded && user?.token) {
		return (
			<div tw="h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	if (user?.token) {
		return (
			<Routes>
				<Route path="/services" element={<Navigation title="Dashboard - Services" element={<Services />} />} />
				<Route path="/services/processes" element={<Navigation title="Dashboard - Processes" element={<Processes />} />} />
				<Route path="/services/view/:id" element={<Navigation title="Dashboard - View" element={<View />} />} />
				<Route path="/server/:id" element={<Navigation title="Dashboard - Server" element={<Server />} />} />
				<Route path="/login" element={<Navigate replace to="/services" />} />
			</Routes>
		);
	}

	if (!user?.token && loaded) {
		return (
			<Routes>
				<Route path="/*" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<Login title="Login" />} />
			</Routes>
		);
	}

	return <Fragment></Fragment>;
};

export default Router;
