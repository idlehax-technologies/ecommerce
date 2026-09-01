import { MetricsSnapshot } from "@/types/metrics";

type Metric =
    | { type: "latency"; value: number }
    | { type: "request" }
    | { type: "error" }
    | { type: "event"; name: string };

declare global {
    var __metrics: Metric[] | undefined;
    var __users: Set<string> | undefined;
    var __startTime: number | undefined;
}

/* ---------------- CORE STORES ---------------- */

const metrics: Metric[] = globalThis.__metrics ?? [];
globalThis.__metrics = metrics;

const users: Set<string> = globalThis.__users ?? new Set<string>();
globalThis.__users = users;

const startTime: number = globalThis.__startTime ?? Date.now();
globalThis.__startTime = startTime;

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
    const idx = Math.min(
        sorted.length - 1,
        Math.floor((p / 100) * sorted.length)
    );

    return sorted[idx];
}

function getUserCount() {
    return users.size;
}

function getUptime() {
    return Date.now() - startTime;
}

/* ---------------- STATS ---------------- */

export function getStats(): MetricsSnapshot {
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