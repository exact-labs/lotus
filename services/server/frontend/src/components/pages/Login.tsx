import api from '@/api';
import { store } from '@/state';
import tw, { css } from 'twin.macro';
import styled from '@emotion/styled';
import { redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from '@/assets/images/logo.png';
import BgImage from '@/assets/images/login_bg.svg';

import { PageContentBlock } from '@/components/elements/generic';

const LoginBackground = styled.div`
	&:before {
		content: '';
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100vh;
		top: 0;
		background: url('${BgImage}');
		background-position: top center;
		background-size: auto;
		background-repeat: no-repeat;

		opacity: 0;
		transition: opacity 3s ease-in-out;

		@media only screen and (min-width: 768px) {
			background-position: center;
			background-size: cover;
		}
	}
`;

const Login = (props: { title: string }) => {
	const [startAnim, setStartAnim] = useState(false);
	const [formData, setFormData] = useState({ email: '', password: '' });

	const handleInputChange = (event: any) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		api.auth
			.login(formData)
			.then((data: any) => {
				store.getActions().user.setUserData(data);
			})
			.finally(() => redirect('/services'));
	};

	useEffect(() => {
		setTimeout(() => {
			setStartAnim(true);
		}, 100);
	}, []);

	return (
		<PageContentBlock title={props.title}>
			<LoginBackground css={startAnim && tw`before:opacity-100`}>
				<div tw="h-screen flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 -mt-12">
					<div tw="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-zinc-900/70 backdrop-blur-md p-5 rounded-lg border border-zinc-800 transition-all shadow-xl">
						<div tw="sm:mx-auto sm:w-full sm:max-w-sm mb-5">
							<img tw="mx-auto h-10 w-auto" src={Logo} />
							<h2 tw="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
						</div>
						<form tw="space-y-6" onSubmit={handleSubmit}>
							<div>
								<label htmlFor="email" tw="block text-sm font-medium leading-6 text-zinc-300">
									Email address
								</label>
								<div tw="mt-2">
									<input
										required
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										value={formData.email}
										onChange={handleInputChange}
										tw="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<div tw="flex items-center justify-between">
									<label htmlFor="password" tw="block text-sm font-medium leading-6 text-zinc-300">
										Password
									</label>
									<div tw="text-sm">
										<a href="#" tw="font-semibold text-indigo-400 hover:text-indigo-300">
											Forgot your password?
										</a>
									</div>
								</div>
								<div tw="mt-2">
									<input
										required
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										value={formData.password}
										onChange={handleInputChange}
										tw="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									tw="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
									Sign in
								</button>
							</div>
						</form>
					</div>
				</div>
			</LoginBackground>
		</PageContentBlock>
	);
};

export default Login;
