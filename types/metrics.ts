export type MetricsSnapshot = {
    latency: {
        count: number;
        p50: number;
        p95: number;
    };

    errorRate: number;

    checkoutSuccess: number;

    users: number;

    uptimeMs: number;

    throughput: number;
};