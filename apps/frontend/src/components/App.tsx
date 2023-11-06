import Router from '@/components/Router';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
	return (
		<BrowserRouter>
			<GlobalStyles />
			<Router />
		</BrowserRouter>
	);
};

export default App;
