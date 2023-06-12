import App, { AppProps, AppContext } from 'next/app';
import lab, { Laboratory, Experiments } from '../../../dist';

type PageProps = {
  experiments: Experiments | null;
};

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const { experiments } = pageProps;
  return (
    <Laboratory experiments={experiments}>
      <Component {...pageProps} />;
    </Laboratory>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const batchCookies: string[] = [];
  const pageProps = await App.getInitialProps(context);
  const response = lab(context.ctx, (err) => console.log(err));
  if (response?.cookies && response.cookies.length !== 0) {
    batchCookies.push(...response.cookies);
  }
  context.ctx.res?.setHeader('set-cookie', batchCookies);
  return {
    pageProps: {
      ...pageProps,
      experiments: response?.experiments || null,
    },
  };
};

export default MyApp;
