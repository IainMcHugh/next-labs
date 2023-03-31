import App, { AppProps as NextAppProps, AppContext } from 'next/app';
//come from library
import lab, { Laboratory } from '../../../dist';

// Fixed from Next v12.3.0 onwards
type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

type PageProps = {
  experiments: any;
};

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const { experiments } = pageProps;
  return (
    <Laboratory experiments={experiments}>
      <Component {...pageProps} />
    </Laboratory>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const pageProps = await App.getInitialProps(context);
  // add this line
  const res = lab(context.ctx, (err) => console.log(err));
  context.ctx.res?.setHeader('set-cookie', res?.cookies ?? []);
  return {
    pageProps: {
      ...pageProps,
      experiments: res?.data,
    },
  };
};

export default MyApp;
