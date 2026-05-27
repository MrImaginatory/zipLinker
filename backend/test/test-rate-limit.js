import http from "http";

// Configuration
const PORT = process.env.PORT || 3001; // Change this if your server runs on a different port
const REQUEST_COUNT = 105; // 100 is the limit, so we expect 5 to fail with 429
const DELAY_MS = 10; // Delay between requests in milliseconds

const testRateLimit = async () => {
    console.log(`Starting rate limit test: sending ${REQUEST_COUNT} requests to http://localhost:${PORT}/api/v1/health`);

    let successCount = 0;
    let rateLimitedCount = 0;
    let otherErrorCount = 0;

    for (let i = 1; i <= REQUEST_COUNT; i++) {
        await new Promise((resolve) => {
            const req = http.get(`http://localhost:${PORT}/api/v1/health`, (res) => {
                let data = '';

                // A chunk of data has been received.
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received.
                res.on('end', () => {
                    if (res.statusCode === 429) {
                        rateLimitedCount++;
                        console.log(`[Request ${i}] Status: 429 Too Many Requests 🔴`);
                    } else if (res.statusCode >= 200 && res.statusCode < 400 || res.statusCode === 404 || res.statusCode === 401 || res.statusCode === 400) {
                        // Anything not 429 and expected application behavior is a "success" passing the rate limiter
                        successCount++;
                        console.log(`[Request ${i}] Status: ${res.statusCode} 🟢`);
                    } else {
                        otherErrorCount++;
                        console.log(`[Request ${i}] Status: ${res.statusCode} 🟡`);
                    }
                    resolve();
                });
            });

            req.on('error', (err) => {
                console.error(`[Request ${i}] Request failed:`, err.message);
                otherErrorCount++;
                resolve();
            });

            // End the request
            req.end();
        });

        // Optional delay to prevent overwhelming OS limits/socket hang ups
        if (DELAY_MS > 0) {
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }

    console.log('\n--- Test Summary ---');
    console.log(`Total Requests: ${REQUEST_COUNT}`);
    console.log(`Passed (Not Rate Limited): ${successCount}`);
    console.log(`Blocked (429 Rate Limited): ${rateLimitedCount}`);
    console.log(`Other Errors: ${otherErrorCount}`);

    if (rateLimitedCount > 0) {
        console.log('\n✅ Rate Limiter is WORKING!');
    } else {
        console.log('\n❌ Rate Limiter might NOT be working (or the limit is higher than your request count).');
    }
};

testRateLimit();
