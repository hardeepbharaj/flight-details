export interface LaunchType {
  flight_number: number;
  name: string;
  date_utc: string;
  id?: string;
  _id?: string
}

export interface LaunchResponseType {
  data: LaunchType[];
  total: number;
}