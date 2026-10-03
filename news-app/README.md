# The Meridian — News Reader

A small React news-article app: front page, section filter, search, saved-for-later (persisted in your browser's localStorage), and a full article reading view.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Run with Docker

The Dockerfile does a multi-stage build: Node builds the static files, then nginx serves them.

```bash
docker build -t meridian-news .
docker run -p 8080:80 meridian-news
```

Open http://localhost:8080.

To stop it later: `docker ps` to find the container ID, then `docker stop <id>`.

### Deploying it further

- **Any container host** (Fly.io, Render, Railway, AWS ECS/App Runner, Google Cloud Run, etc.) can take this image as-is — push it to a registry (Docker Hub, GHCR, ECR) and point the host at it.
- **docker-compose**, if you want one service defined declaratively:
  ```yaml
  services:
    meridian:
      build: .
      ports:
        - "8080:80"
  ```
  Then `docker compose up --build`.

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
index.html        Vite entry HTML (loads the Google Fonts used by the design)
src/main.jsx      React root
src/App.jsx       The whole app (data, components, styles)
```
