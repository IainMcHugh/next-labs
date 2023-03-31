export type ABExperiment = {
  getVariant: () => number | null;
  isControl: () => boolean | null;
  isVariant: (id: number) => boolean | null;
};

export type AB = (experimentID: string) => ABExperiment;
