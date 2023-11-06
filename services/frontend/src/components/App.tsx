import { store } from '@/state';
import { useEffect } from 'react';
import Router from '@/components/Router';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
	useEffect(() => {
		if (!store.getState().settings.data) {
			store.getActions().settings.setSettings({
				backend: {
					address: 'http://127.0.0.1:9002',
				},
			});
		}
	}, []);

	return (
		<BrowserRouter>
			<GlobalStyles />
			<Router />
		</BrowserRouter>
	);
};

export default App;
