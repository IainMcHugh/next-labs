import App, { AppProps, AppContext } from 'next/app';
import config from '../labs';
//come from library
import lab from '../../../dist';
import { LabProvider } from 'context/Laboratory';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LabProvider config={config}>
      <Component {...pageProps} />
    </LabProvider>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const props = await App.getInitialProps(context);
  // add this line
  await lab(context.ctx, {}, (err) => console.log(err));
  /**
   * const experiments = await lab(...)
   * add to props
   * remove experimentID and replace with experiments
   */
  // return props object as normal
  return { ...props };
};

export default MyApp;
