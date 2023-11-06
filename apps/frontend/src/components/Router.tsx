import { Services, View } from '@/components/pages/dashboard';
import { Navigation } from '@/components/elements/dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Router = () => (
	<Routes>
		<Route path="/services" element={<Navigation title="Dashboard - Services" element={<Services />} />} />
		<Route path="/view/:id" element={<Navigation title="Dashboard - View" element={<View />} />} />
	</Routes>
);

export default Router;
