import '@assets/main.css';
import '@assets/chrome-bug.css';
import 'keen-slider/keen-slider.min.css';

import { FC, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Head } from '@components/common';
import { ManagedUIContext } from '@components/ui/context';

const Noop: FC = ({ children }) => <>{children}</>;

export default function MyApp({ Component, pageProps }: AppProps) {
	const Layout = (Component as any).Layout || Noop;
	const router = useRouter();

	useEffect(() => {
		document.body.classList?.remove('loading');
	}, []);

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			(globalThis as any).gtag(
				'config',
				process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
				{
					page_path: url,
				}
			);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<>
			<Head />
			<ManagedUIContext>
				<Layout pageProps={pageProps}>
					<Component {...pageProps} />
				</Layout>
			</ManagedUIContext>
		</>
	);
}
