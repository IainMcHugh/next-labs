import { useLab, labnotes } from '../../../dist';

export default function Home() {
  const { ab, mvt } = useLab();
  const isControl = ab.isControl('abcd1234');
  const mvtVariant = mvt.get('xyza9876');
  const onClick = async () => {
    await labnotes.record({ id: 'abcd1234', message: 'Purchase complete' });
  };
  return (
    <main>
      <h1>Welcome</h1>
      <p>
        AB is control: <b>{isControl ? 'TRUE' : 'FALSE'}</b>
      </p>
      <p>
        AB get variant <b>{ab.get('abcd1234')}</b>
      </p>
      <p>
        MVT get variant{' '}
        <b>
          {mvtVariant?.[0]} - {mvtVariant?.[1]}
        </b>
      </p>
      <p>
        MVT get primary variant <b>{mvt.getPrimaryVariant('xyza9876')}</b>
      </p>
      <p>
        MVT get secondary variant <b>{mvt.getSecondaryVariant('xyza9876')}</b>
      </p>

      <button onClick={onClick}>Click me to log</button>
    </main>
  );
}
