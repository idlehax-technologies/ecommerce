// lib/metrics.ts

type Metric =
    | { type: "latency"; value: number }
    | { type: "request" }
    | { type: "error" }
    | { type: "event"; name: string };

const globalStore = globalThis as any;

/* ---------------- CORE STORES ---------------- */

const metrics: Metric[] = globalStore.__metrics ?? [];
globalStore.__metrics = metrics;

const users: Set<string> = globalStore.__users ?? new Set<string>();
globalStore.__users = users;

const startTime: number = globalStore.__startTime ?? Date.now();
globalStore.__startTime = startTime;

/* ---------------- LIMITS ---------------- */

const MAX_METRICS = 5000;
const MAX_USERS = 1000;

/* ---------------- INTERNAL HELPERS ---------------- */

function pushMetric(metric: Metric) {
    metrics.push(metric);

    if (metrics.length > MAX_METRICS) {
        metrics.shift();
    }
}

/* ---------------- WRITE ---------------- */

export function recordLatency(ms: number) {
    pushMetric({ type: "latency", value: ms });
}

export function recordRequest() {
    pushMetric({ type: "request" });
}

export function recordError() {
    pushMetric({ type: "error" });
}

export function recordEvent(name: string) {
    pushMetric({ type: "event", name });
}

export function recordUser(userId: string) {
    if (users.size < MAX_USERS) {
        users.add(userId);
    }
}

/* ---------------- READ HELPERS ---------------- */

function percentile(arr: number[], p: number) {
    if (arr.length === 0) return 0;

    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.floor((p / 100) * sorted.length);

    return sorted[idx];
}

export function getUserCount() {
    return users.size;
}

export function getUptime() {
    return Date.now() - startTime;
}

/* ---------------- STATS ---------------- */

export function getStats() {
    const latencies = metrics
        .filter(
            (m): m is { type: "latency"; value: number } =>
                m.type === "latency"
        )
        .map(m => m.value);

    const requests = metrics.filter(m => m.type === "request").length;
    const errors = metrics.filter(m => m.type === "error").length;

    const orderCreated = metrics.filter(
        m => m.type === "event" && m.name === "OrderCreated"
    ).length;

    const paymentConfirmed = metrics.filter(
        m => m.type === "event" && m.name === "PaymentConfirmed"
    ).length;

    const uptimeMs = getUptime();
    const uptimeSeconds = uptimeMs / 1000;

    return {
        latency: {
            count: latencies.length,
            p50: percentile(latencies, 50),
            p95: percentile(latencies, 95),
        },

        errorRate: requests === 0 ? 0 : errors / requests,

        checkoutSuccess:
            orderCreated === 0 ? 0 : paymentConfirmed / orderCreated,

        users: getUserCount(),

        uptimeMs,

        throughput:
            uptimeSeconds === 0
                ? 0
                : requests / uptimeSeconds,
    };
}