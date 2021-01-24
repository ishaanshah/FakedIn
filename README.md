# FakedIn

A Job Portal built using the MERN stack as an assignment for DASS

## Setting up the development environment

### Frontend

The frontend is bootstrapped using `Create React App`. To start the frontend
development server you need to install `yarn`.

See the different installation instructions for your distribution below.

Debian / Debian-based systems -

```bash
sudo apt-get install yarn
```

Arch / Arch-based systems -

```bash
sudo pacman -S yarn
```

The next step is to start the development server, to do that run the following
steps

```bash
cd frontend
yarn
yarn start
```

If all goes well, the server should be running at `localhost:3000`.

### Backend

The backend is generated using `Typescript Express Genertor`. To start the development
server, install `yarn` as described above.

The backend uses MongoDB to store the data. You need to configure it to use your
local installation of MongoDB or a cluster in running MongoDB Atlas.

To do this, make a copy of `backend/src/config.json.sample` to
`backend/src/config.json` and update the `DB_URL` field with the URL of
your MongoDB instance.

After doing this you can start the development server using

```bash
cd backend
yarn
yarn start:dev
```
