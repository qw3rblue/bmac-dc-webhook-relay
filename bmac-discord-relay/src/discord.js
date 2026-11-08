
export function createDiscordMessage(event) {
    const data = event.data || {};
    const name = String(data.supporter_name || "Anonymous").slice(0, 100);

    const amount = Number(data.amount);
    const currency = String(data.currency || "USD").slice(0, 10);

    const isMembership = event.type === "membership.started";

    if (event.type === "recurring_donation.started") {
        return {
            username: "Buy Me a Coffee",
            allowed_mentions: { parse: [] },
            embeds: [{
                title: "New Monthly Supporter!",
                description: `**${name}** started supporting monthly!`,
                color: 0xEB459E,
                fields: [
                    {
                        name: "Monthly Amount",
                        value: Number.isFinite(amount)
                            ? `${amount.toFixed(2)} ${currency}`
                            : "Not provided",
                        inline: true
                    }
                ],
                footer: {
                    text: "Buy Me a Coffee - Monthly Support"
                },
                timestamp: new Date().toISOString()
            }]
        };
    }

    if (isMembership) {
        const tier = String(
            data.membership_level_name ||
            data.membership_name ||
            "Membership"
        ).slice(0, 100);

        return {
            username: "Buy Me a Coffee",
            allowed_mentions: { parse: [] },
            embeds: [{
                title: "New Member!",
                description: `**${name}** just became a member!`,
                color: 0x5865F2,
                fields: [
                    {
                        name: "Membership",
                        value: tier,
                        inline: true
                    },
                    {
                        name: "Amount",
                        value: Number.isFinite(amount)
                            ? `${amount.toFixed(2)} ${currency}`
                            : "Not provided",
                        inline: true
                    }
                ],
                footer: { text: "Buy Me a Coffee - Membership" },
                timestamp: new Date().toISOString()
            }]
        };
    }

    if (!Number.isFinite(amount)) {
        throw new Error("Invalid donation amount");
    }

    const hidden = data.note_hidden === true ||
        data.note_hidden === "true";

    const note = hidden
        ? "Private supporter message"
        : String(data.support_note || "No message").slice(0, 1000);

    return {
        username: "Buy Me a Coffee",
        allowed_mentions: { parse: [] },
        embeds: [{
            title: "New Donation!",
            color: 0xFFDD00,
            fields: [
                { name: "Supporter", value: name, inline: true },
                {
                    name: "Amount",
                    value: `${amount.toFixed(2)} ${currency}`,
                    inline: true
                },
                { name: "Message", value: note }
            ],
            footer: { text: "Buy Me a Coffee - Donation" },
            timestamp: new Date().toISOString()
        }]
    };
}
