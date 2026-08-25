# SolarMonitor frontend

The [solarmonitor.org](https://solmon.dias.ie) web frontend: a [Vue](https://vuejs.org/) single page application written
in TypeScript, built with [Vite](https://vite.dev/), [Vue Router](https://router.vuejs.org/) and
[Bootstrap](https://getbootstrap.com/). All data is fetched in the browser from the SolarMonitor backend API (`/api/...`)
and data files (`/data/...`), which live in the [solarmonitor2](https://git.dias.ie/solarmonitor2/solarmonitor2) repo.

## Development

Requires Node 22.

```bash
npm install
npm run dev
```

The dev server runs on `localhost:5173` and proxies `/api` and `/data` to `https://solmon.dias.ie`.
Set `SOLMON_PROXY_TARGET` to use another backend, e.g. a local docker-compose stack:

```bash
SOLMON_PROXY_TARGET=http://localhost npm run dev
```

Other commands:

* `npm test` run the unit tests
* `npm run type-check` type check the code
* `npm run build` production build into `dist/`

## Layout

* `src/views/` one component per page (`/`, `/fulldisk`, `/ars`, `/forecast`, ...), routes are in `src/router.ts`
* `src/components/` shared tables and navigation
* `src/api.ts` typed API client, `src/types.ts` API response types
* `src/utils/` date handling and data formatting, with unit tests in `src/utils/__tests__/`

Pages keep the URLs of the original Flask frontend, e.g. `/ars?date=2024061512&noaa_no=13709#13709`.
