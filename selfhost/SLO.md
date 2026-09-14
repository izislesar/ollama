# ollama SLO

Local inference. Failure mode is never binary — it degrades: slow tokens,
swapped models, OOM kills. The SLOs measure degradation, not just up/down.

## SLI/SLO (30d window)

| signal | SLI | SLO |
|---|---|---|
| availability | `probe_success{job="ollama"}` on `/api/tags` | 99.0% (laptop sleeps, honest bar) |
| latency | p95 `/api/generate` with a small model (test prompt, k6) | < 30s cpu |
| saturation | container memory vs limit | < 85% sustained |
| quality | model stays loaded for repeated prompts (`keep_alive` hit rate) | > 90% |

## the oom story (will happen once, then you learn)

symptom: `docker inspect ollama` shows `OOMKilled: true`, logs stop mid-token.
cause: model bigger than the cgroup limit + parallel requests.
fix: smaller model (`llama3.2:3b` before `8b`), lower `OLLAMA_NUM_PARALLEL`,
      raise the compose memory limit if the host has it.
record it as a postmortem — "my first OOMKilled" is a rite of passage
and interviewers light up when you tell it with numbers.

## measuring

- `/api/tags` for up, `/api/ps` for loaded models.
- k6 (`k6/load.js`) runs a fixed prompt against a fixed model and asserts
  p95 — compares cpu vs gpu later if you add one.
