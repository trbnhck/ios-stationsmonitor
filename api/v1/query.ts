import type { VercelRequest, VercelResponse } from '@vercel/node';
import access_control from '../../lib/access_control';
import hafas from '../../lib/hafas';

const autocomplete = require('vbb-stations-autocomplete');

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!access_control(req)) {
    res.status(401).json({
      code: 'access/denied',
      message: 'Access denied',
    });
  }

  const query = req.headers['x-qry'];

  if (!query) {
    res.status(400).json({
      code: 'query/missing_params',
      message: 'Not all required parameters were provided.',
    });
    return;
  }

  const vbb_stations = await autocomplete(query, 6, true, true);

  const stations = {};

  for (const vbb_station of vbb_stations) {
    const hafas_station = await hafas.stop(vbb_station.id);
    stations[hafas_station.name] = hafas_station.id;
  }

  res.status(200).json(stations);
};
