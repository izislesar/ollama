# ollama selfhost notes

Local models on the laptop. Cpu by default, ~fine for 3b models.
Nothing autostarts — models stay unloaded until you ask.

## up

```bash
docker compose -f selfhost/docker-compose.yml up -d
docker exec -it ollama ollama pull llama3.2:3b
docker exec -it ollama ollama run llama3.2:3b "say hi"
```

api on http://localhost:11434 (`/api/generate`, `/api/tags`, `/api/ps`).

## ram math (do this before pulling big models)

- 3b ≈ 2gb, 8b ≈ 5gb, 70b — not on this laptop.
- `OLLAMA_MAX_LOADED_MODELS=1` keeps one resident; `keep_alive=10m`
  unloads after idle. Check with `docker exec ollama ollama ps`.

## backup

models are re-downloadable — back up nothing except your modelfiles
(if you make custom ones, keep them in git).

## update

pull + up -d. Models persist in the volume, no re-download.
