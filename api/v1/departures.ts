import type { VercelRequest, VercelResponse } from '@vercel/node';
import access_control from '../../lib/access_control';
import hafas from '../../lib/hafas';
import departure_fmt from '../../lib/departure_fmt';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!access_control(req)) {
    res.status(401).json({
      code: 'access/denied',
      message: 'Access denied',
    });
  }

  const sid = req.headers['x-sid'];

  if (!sid) {
    res.status(400).json({
      code: 'departures/missing_params',
      message: 'Not all required parameters were provided.',
    });
    return;
  }

  const hafas_departures = await hafas.departures(sid);

  const departures = {};

  for (const departure of hafas_departures) {
    let productName = '';
    if (departure.line.product == 'bus' || departure.line.product == 'tram') {
      productName = departure.line.product.charAt(0).toUpperCase() + departure.line.product.slice(1) + ' ';
    }
    departures[`[${productName}${departure.line.name}] → ${departure.direction}`] = departure_fmt(
      new Date(),
      new Date(departure.when || 0)
    );
  }

  res.status(200).json(departures);
};
