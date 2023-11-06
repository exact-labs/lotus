// react
import { Fragment } from 'react';

// library
import { Global } from '@emotion/react';
import tw, { css, theme, GlobalStyles as BaseStyles } from 'twin.macro';

const customStyles = css({
	body: {
		...tw`antialiased h-full overscroll-none`,
	},
	html: {
		...tw`h-full bg-gray-900`,
	},
});

const GlobalStyles = () => (
	<Fragment>
		<BaseStyles />
		<Global styles={customStyles} />
	</Fragment>
);

export default GlobalStyles;
