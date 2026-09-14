// k6: fixed model, fixed prompt, measure degradation.
// pull the model first: docker exec ollama ollama pull llama3.2:3b
// run: k6 run k6/load.js -e BASE_URL=http://localhost:11434 -e MODEL=llama3.2:3b
import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:11434';
const MODEL = __ENV.MODEL || 'llama3.2:3b';

export const options = {
  stages: [
    { duration: '1m', target: 2 }, // warm, mostly serial on cpu
    { duration: '3m', target: 4 }, // mild parallel — watch the oom line
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<30000'],
  },
};

const PROMPT = 'in one sentence: why is the sky blue?';

export default function () {
  const res = http.post(
    `${BASE}/api/generate`,
    JSON.stringify({ model: MODEL, prompt: PROMPT, stream: false }),
    { headers: { 'Content-Type': 'application/json' }, timeout: '120s' }
  );
  check(res, {
    'got answer': (r) => r.status === 200 && r.json('response') !== undefined,
  });
}
