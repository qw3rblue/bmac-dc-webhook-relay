const crypto = require("node:crypto");

const url = "http://localhost:8787";
const secret = process.env.BMAC_SIGNING_SECRET;

const payload = JSON.stringify({
    id: "test-001",
    type: "donation.created",
    data: {
        supporter_name: "dupe_test",
        amount: 5,
        currency: "USD",
        support_note: "testing dupe protection"
    }
});

const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")

async function send() {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-signature-sha256": signature
        },
        body: payload
    });

    console.log(response.status, await response.text());
}

(async () => {
    await send();
    await send();
})();