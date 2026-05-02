let started = false;

export function startJobLoop() {
    if (started) return;
    started = true;

    const INTERVAL = 5_000; // 5s tick (fine for now)

    async function tick() {
        try {
            const { runScheduler } = await import("./runner");
            await runScheduler();
        } catch (err) {
            console.error("Job loop error:", err);
        } finally {
            setTimeout(tick, INTERVAL);
        }
    }

    tick();
}