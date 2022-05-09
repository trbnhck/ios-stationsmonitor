import type { VercelRequest, VercelResponse } from '@vercel/node';
import access_control from '../../lib/access_control';
import hafas from '../../lib/hafas';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!access_control(req)) {
    res.status(401).json({
      code: 'access/denied',
      message: 'Access denied',
    });
  }

  const lat = req.headers['x-lat'],
    lng = req.headers['x-lng'];

  if (!lat || !lng) {
    res.status(400).json({
      code: 'stations/missing_params',
      message: 'Not all required parameters were provided.',
    });
    return;
  }

  const hafas_stations = await hafas.nearby({
    type: 'location',
    latitude: +lat,
    longitude: +lng,
  });

  const stations = {};

  for (const station of hafas_stations) {
    stations[station.name] = station.id;
  }

  res.status(200).json(stations);
};
