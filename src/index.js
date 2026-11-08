
import { verifySignature } from "./verify.js";
import { createDiscordMessage } from "./discord.js";

export default {
    async fetch(request, env) {
        if (request.method !== "POST") {
            return new Response("Method Not Allowed", {
                status: 405
            });
        }

        if (!env.BMAC_SIGNING_SECRET || !env.DISCORD_WEBHOOK_URL) {
            return new Response("Server not configured", {
                status: 500
            });
        }

        const rawBody = await request.text();
        const signature = request.headers.get("x-signature-sha256");

        const valid = await verifySignature(
            rawBody,
            signature,
            env.BMAC_SIGNING_SECRET
        );

        if (!valid) {
            return new Response("Unauthorized", {
                status: 401
            });
        }

        let event;

        try {
            event = JSON.parse(rawBody);
        } catch {
            return new Response("Invalid JSON", {
                status: 400
            });
        }

        const supportedEvents = [
            "donation.created",
            "membership.started",
            "recurring_donation.started"
        ];

        if (!supportedEvents.includes(event.type)) {
            return new Response("Event ignored", {
                status: 200
            });
        }

        if (!event.data || typeof event.data !== "object") {
            return new Response("Invalid event data", {
                status: 400
            });
        }

        let payload;

        try {
            payload = createDiscordMessage(event);
        } catch (error) {
            console.error("Formatting error:", error);
            return new Response("Invalid event data", {
                status: 400
            });
        }

        try {
            const response = await fetch(env.DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error("Discord error:", response.status);
                return new Response("Delivery failed", {
                    status: 502
                });
            }

            return new Response("OK", {
                status: 200
            });
        } catch (error) {
            console.error("Relay error:", error);
            return new Response("Delivery failed", {
                status: 502
            });
        }
    }
};
