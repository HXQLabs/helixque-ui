<br />

<p align="center">
<a href="https://github.com/HXQLabs/Helixque">
  <img src="assets/header.png" alt="Helixque Header" width="100%">
</a>
</p>
<p align="center"><b>Professional real-time video chat with preference-based matching</b></p>

<p align="center">
<a href="https://discord.gg/dQUh6SY9Uk">
<img alt="Discord" src="https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white&style=for-the-badge" />
</a>
<img alt="Commit activity per month" src="https://img.shields.io/github/commit-activity/m/HXQLabs/Helixque?style=for-the-badge" />
<img alt="License" src="https://img.shields.io/badge/license-Apache%202.0-blue?style=for-the-badge" />
</p>

<p align="center">
    <a href="https://github.com/HXQLabs/Helixque"><b>GitHub</b></a> •
    <a href="https://github.com/HXQLabs/Helixque/releases"><b>Releases</b></a> •
    <a href="https://discord.gg/dQUh6SY9Uk"><b>Discord</b></a> •
    <a href="#deployment"><b>Deployment Guide</b></a>
</p>

Meet [Helixque](https://github.com/HXQLabs/Helixque), a professional real-time video chat application that pairs people based on their preferences. Built with WebRTC for secure, low-latency peer-to-peer media and a modern Turborepo architecture delivering a premium experience for networking and collaboration. 🎥

> Helixque is continuously evolving. Your suggestions, ideas, and reported bugs help us immensely. Do not hesitate to join the conversation on [Discord](https://discord.gg/dQUh6SY9Uk) or raise a GitHub issue. We read everything and respond to most.

## Note

You can now preview the latest updates and improvements every 2–3 days at the following link:
👉 [Helixque-Changes](https://helixque-changes.netlify.app/)

## 🚀 Quick Start

Getting started with Helixque is simple:

1. **Clone the repository**

```bash
git clone https://github.com/HXQLabs/Helixque.git
cd helixque-ui
```

2. **Install dependencies**

This project uses `pnpm` for dependency management.

```bash
# Install dependencies
pnpm install

```

3. **Start development servers**

````bash
# Start development server
pnpm dev

<<<<<<< HEAD
=======
Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
>>>>>>> 1df1b70f8aadd40efe3ce53ce63520e9572310c0
````

Open your browser at `http://localhost:3000` and allow camera/microphone access. 🎉

## 🌟 Features

- **Enhanced UI & Layout**
  Enjoy a cleaner, smoother interface with improved stability when switching between users. Seamless navigation and responsive design ensure a premium user experience.

- **Seamless Media Switching**
  Toggle between video and audio effortlessly with smooth transitions for uninterrupted conversations. Real-time device management keeps your calls crystal clear.

- **Instant Messaging**
  Send and receive messages in real time for seamless communication alongside video calls. Perfect for sharing links, notes, or quick thoughts during conversations.

- **One-on-One Video Calling**
  Connect directly with other users for private, high-quality video conversations. WebRTC ensures low-latency, peer-to-peer connections for the best quality.

- **Random Connect with Professionals**
  Meet and network with professionals from various fields instantly. Expand your connections effortlessly with intelligent preference-based matching.

- **Unlimited Skips**
  No limits on finding the right match. Skip as many times as you need until you find the perfect conversation partner.

## 🛠️ Local Development

### Frontend Structure (Monorepo)

The frontend is a **Turborepo** workspace managing the Next.js application and shared UI packages.

- **`apps/web`**: Main Next.js application (App Router).
- **`packages/ui`**: Shared UI components (shadcn/ui).

> **Note:** Frontend requires HTTPS in production for getUserMedia to function correctly. Device permissions must be granted by the user.

## ⚙️ Built With

[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Turbo](https://img.shields.io/badge/Turbo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

<!-- ## 🏗️ Project Structure

```
helixque-ui/
├─ apps/
│  └─ web/               # Next.js Frontend App
├─ packages/
│  ├─ ui/                # Shared UI Components
│  ├─ eslint-config/     # Shared Eslint Config
│  └─ typescript-config/ # Shared TS Config
├─ assets/               # Images and static files
├─ package.json          # Root package.json (Workspaces)
└─ README.md
``` -->

<!-- ## 🚢 Deployment

### Frontend (Vercel)

Deploy the `apps/web` project to Vercel. Ensure you set the `Root Directory` to `apps/web` if needed, or configure Vercel to handle the Monorepo (it usually detects it automatically).

 -->

## ❤️ Community

Join the Helixque community on [Discord](https://discord.gg/dQUh6SY9Uk) and [GitHub Discussions](https://github.com/HXQLabs/Helixque/discussions).

Feel free to ask questions, report bugs, participate in discussions, share ideas, request features, or showcase your projects. We'd love to hear from you!

## 🛡️ Security

If you discover a security vulnerability in Helixque, please report it responsibly instead of opening a public issue. We take all legitimate reports seriously and will investigate them promptly.

To disclose any security issues, please contact the maintainers through Discord or open a private security advisory on GitHub.

## 🤝 Contributing

There are many ways you can contribute to Helixque:

- ⭐ **Star the repository** to support the project
- 🐛 Report bugs or submit feature requests via [GitHub Issues](https://github.com/HXQLabs/Helixque/issues)
- 📖 Review and improve documentation
- 💬 Talk about Helixque in your community and [let us know](https://discord.gg/dQUh6SY9Uk)
- 👍 Show your support by upvoting popular feature requests

### Contribution Guidelines

- Open an issue to discuss larger features before implementing
- Use small, focused pull requests with descriptive titles and testing notes
- Maintain TypeScript types and follow existing code style
- Run linters and formatters before committing
- Join our [Discord](https://discord.gg/dQUh6SY9Uk) to coordinate work and get faster PR reviews

> **Important:** Signing up and completing the brief onboarding in the app is required for all contributors. Maintainers will use registered accounts to verify changes.

### Repo Activity

![Helixque Repo Activity](https://repobeats.axiom.co/api/embed/f0046398b3e592f1b5a12b7f6b32e00839c2814b.svg "Repobeats analytics image")

### We Couldn't Have Done This Without You

<a href="https://github.com/HXQLabs/helixque-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HXQLabs/helixque-ui" />
</a>

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
