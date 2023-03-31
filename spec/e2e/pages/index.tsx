import { useLab } from 'context/Laboratory';

export default function Home() {
  const { variant } = useLab();
  return (
    <main>
      <h1>Welcome</h1>
      <p>Variant: {variant}</p>
    </main>
  );
}
