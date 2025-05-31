# WienerTime

<p align="center">
   <img src="public/favicon.svg" alt="Logo" width="128px" height="128px">
<p>

<p align="center">
  <a href="https://wiener-time.vercel.app" target="_blank" rel="noreferrer">
    wiener-time.vercel.app
  </a>
<p>

> Real-time traffic data of Wiener Linien monitors.

## Features

This web app shows real-time traffic data provided by the [Wiener Linien's API](https://www.data.gv.at/katalog/dataset/wiener-linien-echtzeitdaten-via-datendrehscheibe-wien).

## Development

```bash
# install dependencies
$ pnpm install

# build in watch mode
$ pnpm dev

# lint project files
$ pnpm lint
```

### Environment

For local development, the following environment variables have to be added to an [.env](./.env) file.

#### OpenGraph

- `NEXT_PUBLIC_OG_URL=http://localhost:3000`

## License

[MIT](./LICENSE) - Copyright &copy; Jan Müller
