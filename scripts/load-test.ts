// scripts/load-test.ts

const BASE_URL = "http://localhost:3000"; // change if deployed
const CONCURRENCY = 20;
const DURATION_MS = 5 * 60 * 1000; // 5 minutes

const HEADERS = {
    "Content-Type": "application/json",
    "x-dev-bypass": "true",
};

async function runUserFlow() {
    try {
        // 1. Add to cart
        await fetch(`${BASE_URL}/api/cart`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                productId: "test-product",
                quantity: 1,
            }),
        });

        // 2. Checkout
        const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({}),
        });

        const checkoutData = await checkoutRes.json();

        if (!checkoutData.orderId) return;

        // 3. Confirm payment
        await fetch(
            `${BASE_URL}/api/payments/${checkoutData.orderId}/confirm`,
            {
                method: "POST",
                headers: HEADERS,
            }
        );

    } catch {
        // errors captured in metrics
    }
}

async function worker(endTime: number) {
    while (Date.now() < endTime) {
        await runUserFlow();
    }
}

async function main() {
    console.log("Starting load test...");

    const endTime = Date.now() + DURATION_MS;

    const workers = Array.from({ length: CONCURRENCY }, () =>
        worker(endTime)
    );

    await Promise.all(workers);

    console.log("Load test finished");

    // fetch metrics
    const res = await fetch(`${BASE_URL}/api/analytics/metrics`);
    const { metrics } = await res.json();

    console.log("\n=== METRICS ===");
    console.log(JSON.stringify(metrics, null, 2));
}

main();