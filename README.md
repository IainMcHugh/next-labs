# next-labs

This package allows you to configure A/B experiments via a config file that can be utilised both server and client side. It is intended for use within a NextJS application.

As developers, from type-checking to application testing, we will always strive to ship as little bugs as possible to our end users. While zero bugs may be unrealistic, we aim to minimize bugs as much as possible. _next-labs_ takes this philosophy to the next level, giving you a reliable, light-weight, and easily configurable solution to _incrementally rollout_ new features in your NextJS application (no more big-bang releases!), that is consistent across the full-stack.

<br />

## Quick start

1. Within your NextJS application, via npm (or package manager of choice), run:

```sh
npm install next-labs
```

2. Create a `.labs` folder in the root of your application, and copy the [`json` configuration](##configuration) snippet below into an `ab.config.json` file within this folder
3. In your `_app.tsx` file, import and initialize `ab` within your `getInitialProps`:

```tsx
import App, { AppContext, AppProps } from 'next/app';
import ab from 'next-labs';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

MyApp.getInitialProps = async (context: AppContext) => {
  const props = await App.getInitialProps(context);
  // add this line
  await ab(props.ctx);
  // return props object as normal
  return { ...props };
};

export default MyApp;
```

4. That's it! You now have a weighted variant for each defined experiment that you can access on both the server and client.

<br />

## Configuration

Here is a sample valid `.labs/ab.config.json` file:

```json
[
  {
    "name": "Experiment 1",
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

Each parent object defines a unique experiment, allowing for multiple experiments to be added. Here is a breakdown of each attribute available for an experiment.

| Attribute   |               Description                | required |  default |
| :---------- | :--------------------------------------: | :------: | -------: |
| name        |           The experiment name            |    ✅    |      n/a |
| id          |            The experiment id             |    ✅    |      n/a |
| prefix      |     The cookie prefix (max 4 chars)      |    ❌    | **'ab'** |
| variants    |           The list of variants           |    ✅    |      n/a |
| development | The development experiment configuration |    ❌    |      n/a |
| production  | The production experiment configuration  |    ❌    |      n/a |
| test        |    The test experiment configuration     |    ❌    |      n/a |

<br />

## Attributes

Here is a more detailed breakdown of each attribute.

- ### name

The experiment name is an identifer that makes it easy to get an idea of what the experiment does. A lowercase, trimmed version of the name will be present in the cookie name associated with the experiment so ideally it should be brief.

_If you need somewhere to capture a description feel free to add a description attribute, this will be ignored by the package._

- ### id

Similar to tools like Google Optimize, a unique id needs to be associated with each experiment. If you plan on capturing metrics via Google Optimize it is recommended to use their experiment id here. If using the associated github action you can leave this blank and it will be auto-generated. [\*\*](##see-more)

- ### prefix

A quick way to identify your experiment cookies, the prefix will begin the cookie name. By default it is 'ab' but you should set this to something that makes sense to your application. It is limited to a max of 4 characters.

- ### variants

This is an array where your experiment variants are defined. Each variant is an object that has two parameters a **name** and **id**. The **name** is to define the intended behaviour for that variant. The **id**s should be incremental integers starting at 0. There is a direct mapping between the id for a variant and the weight associated with that variant.

## Environments

The following 3 attributes are each optional, but **at least one must be defined for an experiment configuration to be valid**. They correspond with the `NODE_ENV` environment variable so make sure this is set correctly for each environment or you will get unexpected results.

### development / production / test

Each of these attributes require the same structure, but allow you to control an experiment on a per-environment basis. Each environment must take a **running** state, which can be either `on` or `off`, as well as a **weights** value. The **weights** list must:

- include the same amount of members as there are variants for the given experiment
- total 100

As stated in the _variants_ description, each weight index corresponds with a variant id. So looking at this configuration:

```json
{
  // ...
  "variants": [
    { "name": "Blue button", "id": 0 },
    { "name": "Green button", "id": 1 }
  ],
  "development": {
    "weights": [20, 80]
    // ...
  }
}
```

20% of users will get the `Blue button` variant, and 80% of users will get the `Green button`.

<br />

## See more

- There is a github actions in development that will let you interact with your experiment configurations via UI.
- Future plans involve multi-variant and redirect experiments.
