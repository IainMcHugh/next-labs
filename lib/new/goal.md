What is the end goal

```ts
type Cookie = {
  key: string;
  value: string;
  domain?: string;
  expiry?: string;
  httpOnly?: boolean;
  secure?: boolean;
};

type ABVariant = {
  name: string;
  id: number;
};

type ABExperiment = {
  name: string;
  id: string;
  variants: ABVariant[];
  development?: Environment;
  production?: Environment;
  test?: Environment;
};

type MVTVariant = {
  name: string;
  id: number;
  variants: MVTVariant | null;
};

type MVTExperiment = {
  name: string;
  id: string;
  variant: MVTVariant[];
  development?: Environment;
  production?: Environment;
  test?: Environment;
};

type RedirectVariant = {
  target: string;
  redirect: string;
};

type RedirectExperiment = {
  name: string;
  id: string;
  variant: RedirectVariant[];
  development?: Environment;
  production?: Environment;
  test?: Environment;
};

type Environment = {
  running: boolean;
  weights: number[];
};
```

```json
[
  {
    "name": "Experiment 1",
    "id": "abcd1234",
    "variants": [
      {
        "name": "Original",
        "id": 0
      },
      {
        "name": "Variant 1",
        "id": 1
      }
    ],
    "development": {
      "running": "on",
      "weights": [50, 50]
    },
    "test": {
      "running": "off",
      "weights": [100, 0]
    },
    "production": {
      "running": "on",
      "weights": [90, 10]
    }
  }
]
```

```tsx
// _app.tsx
import App, { AppProps, AppContext } from 'next/app';
import lab, { Laboratory } from 'next-labs';

const MyApp = (props) => {
  const { Component, pageProps, experiments } = props;
  return (
    <Laboratory experiments={experiments}>
      <Component {...pageProps} />
    </Laboratory>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const props = await App.getInitialProps(context);
  let batchCookies: string[] = [];
  const result = await lab(appContext, (error) => console.log(error));
  batchCookies.push(result.cookie);
  appContext.ctx.res.setHeader('set-cookie', batchCookies);
  return { ...props, experiments: result.data };
};

export default MyApp;
```

```tsx
// component.tsx

const Component = () => {
  const { ab, mvt } = useLab();
  const isControl = ab.isControl('Experiment 1');
  const variant = ab.get('Experiment 2');
  return (
    <div>
      <h1>Hello from component</h1>
      {isControl ? <p>Control</p> : <p>Variant: {variant}</p>}
    </div>
  );
};
```
