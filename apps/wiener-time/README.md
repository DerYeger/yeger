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

Built with the [t3-stack](https://github.com/t3-oss/create-t3-app), this web app shows real-time traffic data provided by the [Wiener Linien's API](https://www.data.gv.at/katalog/dataset/wiener-linien-echtzeitdaten-via-datendrehscheibe-wien).

It's hosted on Vercel, with the database being provided by PlanetScale.

## Development

```bash
# install dependencies
$ yarn install

# build in watch mode
$ yarn dev

# lint project files
$ yarn lint
```

### Environment

For local development, the following environment variables have to be added to an [.env](./.env) file.

#### Prisma

- `DATABASE_URL`

#### Next Auth

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=http://localhost:3000`

#### Next Auth Discord Provider

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`

#### OpenGraph

- `NEXT_PUBLIC_OG_URL=http://localhost:3000`

## License

[MIT](./LICENSE) - Copyright &copy; Jan Müller
