import type { NextApiRequest, NextApiResponse } from 'next';

type LabOptions = {
  config: boolean;
};

const getVariant = (
  id: string | string[] | undefined,
  cookies: string | undefined
) => {
  if (id === undefined) return null;
  if (cookies === undefined) return null;
  if (Array.isArray(id)) return null;
  const cookie = cookies.trim().split(';');
  const wantedCookie = cookie.find((c) => c.indexOf(id) !== -1);
  if (!wantedCookie) return null;
  return wantedCookie.split('=')[1];
};

const NextLabHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  options: LabOptions
) => {
  const event = JSON.parse(req.body)?.message;
  const id = req.query.id;
  const variant = getVariant(id, req.headers.cookie);
  const data = {
    id,
    variant,
    event,
  };
  console.log('here is where log would happen: ', data);
  res.status(200);
  return res.json(data);
};

function NextLab(
  ...args: [LabOptions] | [NextApiRequest, NextApiResponse, LabOptions]
) {
  if (args.length === 1) {
    return async (req: NextApiRequest, res: NextApiResponse) =>
      await NextLabHandler(req, res, args[0]);
  }

  return NextLabHandler(args[0], args[1], args[2]);
}

export default NextLab;
