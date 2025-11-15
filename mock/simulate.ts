const SIMULATE_DELAY_MIN = 300;
const SIMULATE_DELAY_MAX = 800;
const SIMULATE_FAILURE_RATE = 0.15;

function randomDelay() {
  const range = SIMULATE_DELAY_MAX - SIMULATE_DELAY_MIN;
  return SIMULATE_DELAY_MIN + Math.floor(Math.random() * range);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface SimulateOptions {
  allowFailure?: boolean;
  message?: string;
}

export async function withSimulate<T>(
  task: () => Promise<T> | T,
  options: SimulateOptions = {},
) {
  const { allowFailure = false, message = "Simulation error." } = options;

  await sleep(randomDelay());

  if (allowFailure && Math.random() < SIMULATE_FAILURE_RATE) {
    throw new Error(message);
  }

  return task();
}

export const simulateConfig = {
  delay: {
    min: SIMULATE_DELAY_MIN,
    max: SIMULATE_DELAY_MAX,
  },
  failureRate: SIMULATE_FAILURE_RATE,
};
