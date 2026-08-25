// Shapes of the backend API responses (see backend/backend/models.py).
// Datetimes are serialised as naive ISO strings in UTC, e.g. "2024-05-01T12:00:00".

export interface FullDiskImage {
  date_obs: string | null
  date_query: string
  instrument: string
  wavelength: number
  observable: string
  level: string | null
  url: string | null
  thumbnail_path: string | null
  image_path: string | null
}

export interface ActiveRegionImage extends FullDiskImage {
  noaa_no: number
}

export interface DerivedImage {
  data_type: string
  date_obs: string
  instrument: string
  wavelength: number | null
  thumbnail_path: string | null
  image_path: string | null
}

export interface Plot {
  date_obs?: string
  start_time?: string
  plot_type?: string | null
  plot_path: string
}

export interface Srs {
  date_obs: string
  region_id: string
  noaa_number: number
  carrington_longitude: number
  area: number | null
  z: string | null
  longitudinal_extent: number | null
  number_of_sunspots: number | null
  mag_type: string | null
  latitude: number
  longitude: number
}

export interface Flare {
  id: string
  start_time: string
  peak_time: string
  end_time: string
  goes_cls: string
  flux: number
  data_prov: string
  data_src: string
  hgs_lat: number | null
  hgs_lon: number | null
  noaa_number: number | null
}

export interface Forecast {
  date_obs: string
  duration: number
  model: string
  noaa_no: number
  c_plus: number | null
  m_plus: number | null
  x_plus: number | null
}

export interface OrbitTrace {
  x: number[]
  y: number[]
  time: string[]
}

export type OrbitPlotData = Record<string, OrbitTrace>
