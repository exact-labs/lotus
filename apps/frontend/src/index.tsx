// react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// project
import App from '@/components/App';

// styles
import '@/assets/styles/main.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container!);

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
