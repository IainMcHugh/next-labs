# Next labs - Road map

- Docs website: https://mintlify.com/docs/quickstart
- Custom domain (https://next.labs.io)
- duration
- client side config option (?)

- re-organisation

```tsx
import lab, { experiment } from 'next-labs';

// ab
const experiment1 = experiment.ab('abcd1234');
const variant = experiment1.getVariant();
const isControl = experiment1.isControl(); // is index '0'
const isVariant2 = experiment1.isVariant('2');

// mvt
const experiment1 = experiment.mvt('mvtcd1234');
const [mVariant1, mVariant2] = experiment1.getVariant();
const isControl = experiment1.isControl(); // is index '0-0'
const isVariant2 = experiment1.isVariant('2');
```

- impressions

```tsx
// ...
// client
const onClick = async () => {
  // ...
  await experiment1.impression();
};

// pages/api/labs/[[...lab]].tsx
import { LabResults, type LabResultOptions } from 'next-labs';

const options: LabResultOptions = {
  //...
};

export default LabResults(options);
```
