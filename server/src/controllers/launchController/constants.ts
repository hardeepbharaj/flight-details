import { LaunchOptionsType } from './types';

export const SPACEX_API_URL: string = 'https://api.spacexdata.com/v4/launches/query';

export const LAUNCH_OPTIONS: LaunchOptionsType = {
  sort: { date_utc: 'desc' },
  select: ['flight_number', 'name', 'date_utc']
}