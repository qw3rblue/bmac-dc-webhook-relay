# ☕ BMAC Discord Relay

**A lightweight, serverless webhook relay that sends Buy Me a Coffee notifications directly to Discord.**

Built with JavaScript and Cloudflare Workers. This is 100% free, no need for servers, infrastructure, or even paid hosting.

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=black)
![Discord](https://img.shields.io/badge/Discord-Webhooks-5865F2?logo=discord&logoColor=white)

---

## Features

- **BMAC Notifcations**
- **Rich Discord Embeds**
- **Signature Verification (HMAC-SHA256)**
- **Serverless Architecture (Cloudflare Workers)**
- **Easy Customization (Ofcourse)**

## 🔄 How It Works

```text
       Buy Me a Coffee
              |
              | Webhook Event (JSON)
              v
      Cloudflare Worker
              |
              | Verify Signature
              | Validate Event
              | Format Message
              v
        Discord Webhook
              |
              v
      Your Discord Channel
```

Buy Me a Coffee sends an event to your Cloudflare Worker. The Worker verifies the request, processes the event, and forwards a formatted notification to your Discord channel.

### Supported Events

| Event | Notification |
|---|---|
| `donation.created` | New Donation |
| `membership.started` | New Member |
| `recurring_donation.started` | New Monthly Supporter |

It will NOT work if the event names are mismatched! You can double check this in the JSON that BMAC generates.

---

## Getting Started

### Prerequisites

Before starting, you'll need:

- [Node.js](https://nodejs.org/) and npm
- [Cloudflare account](https://dash.cloudflare.com/)
- [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
- [Buy Me a Coffee account](https://buymeacoffee.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bmac-dc-webhook-relay.git
cd bmac-dc-webhook-relay
npm install
```

### 2. Configure Local Secrets

Create a `.dev.vars` file in the project root:

```env
BMAC_SIGNING_SECRET="your_buymeacoffee_signing_secret"
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN"
```

You can find your signing secret in your Buy Me a Coffee webhook settings and create a Discord webhook under **Server Settings / Channel Settings → Integrations → Webhooks**.

Never commit `.dev.vars` or any real credentials to Git.

### 3. Start the Development Server

```bash
npm run dev
```

Wrangler starts a local development server, typically at:

```text
http://localhost:8787
```

Local development is useful for checking changes. Buy Me a Coffee requires a publicly accessible HTTPS endpoint to deliver events.

### 4. Deploy to Cloudflare

Authenticate with Cloudflare:

```bash
npx wrangler login
```

Deploy your worker:

```bash
npm run deploy
```

Your worker will receive a public URL that looks like this:

```text
https://bmac-discord-relay.YOUR_SUBDOMAIN.workers.dev
```

### 5. Configure Production Secrets

Upload your signing secret:

```bash
npx wrangler secret put BMAC_SIGNING_SECRET
```

Upload your Discord webhook URL:

```bash
npx wrangler secret put DISCORD_WEBHOOK_URL
```

These values are stored as Cloudflare Worker secrets and are not committed to GitHub.

### 6. Connect Buy Me a Coffee

1. Open your Buy Me a Coffee dashboard.
2. Navigate to **Integrations / Webhooks**.
3. Create or edit your webhook.
4. Set the endpoint URL to your deployed Cloudflare Worker URL.
5. Enable the supported event types.
6. Save your settings.
7. Send a test event.

If BMAC was configured properly, you should see a test message embedded to Discord.

---

## Customization

You can customize Discord notification formatting in:

```text
src/discord.js
```

## Testing and Debugging

Start your worker locally:

```bash
npm run dev
```

Monitor your deployed worker:

```bash
npx wrangler tail
```

Send a test event through Buy Me a Coffee and inspect the response.

| Status | Meaning |
|---|---|
| `200` | Event processed or intentionally ignored |
| `400` | Invalid request data |
| `401` | Signature verification failed |
| `405` | Unsupported HTTP method |
| `500` | Missing configuration |
| `502` | Discord delivery failed |

Unsupported event types may also return `200`

---

## Security

This project uses HMAC-SHA256 signature verification to authenticate incoming webhook events.

- Keep signing secrets and Discord webhook tokens private.
- Store production credentials using Cloudflare Worker secrets.
- Never commit `.dev.vars` or `.env` files containing real credentials.
- Rotate credentials immediately if accidentally exposed.
- Keep dependencies updated.
- Verify the exact signature header and signing format against Buy Me a Coffee's current documentation.

## Contributing

You may contribute, suggest, or report bug reports!

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes locally.
5. Open a pull request describing your changes.

## License

This project is intended to be released under the [MIT License](LICENSE).

## Acknowledgments

Built using [Cloudflare Workers](https://workers.cloudflare.com/), [Discord Webhooks](https://discord.com/developers/docs/resources/webhook), and [Buy Me a Coffee](https://buymeacoffee.com/).

---

**Made for creators who want to celebrate their supporters with their communities.**
