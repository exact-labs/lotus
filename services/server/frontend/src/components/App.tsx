import { store } from '@/state';
import Router from '@/components/Router';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from '@/assets/styles/GlobalStyles';

const App = () => {
	return (
		<StoreProvider store={store}>
			<BrowserRouter>
				<GlobalStyles />
				<Router />
			</BrowserRouter>
		</StoreProvider>
	);
};

export default App;
