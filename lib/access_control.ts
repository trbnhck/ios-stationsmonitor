import type { VercelRequest } from '@vercel/node';

export default (req: VercelRequest) => {
  return req.headers['user-agent'] === 'Stationsmonitor iOS/1.0.0';
};
