<p align="center">
<a href="https://github.com/HXQLabs/Helixque">
  <img src="assets/contributing_guidelines.png" alt="Helixque Contributing" width="100%">
</a>
</p>

<p align="center"><b>Help us build the most professional real-time video chat application</b></p>

<p align="center">
<a href="https://discord.gg/dQUh6SY9Uk">
<img alt="Discord" src="https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white&style=for-the-badge" />
</a>
<img alt="License" src="https://img.shields.io/badge/license-Apache%202.0-blue?style=for-the-badge" />
</p>

---

Thank you for your interest in contributing to Helixque! We are building a high-quality, professional platform and value your help.

> [!IMPORTANT]
> **READ BEFORE CONTRIBUTING**
>
> 1. **App Onboarding Required**: You must sign up and complete the brief onboarding in the application before contributing. Maintainers use registered accounts to verify changes.
> 2. **Issue Assignment**: If an issue is assigned to you, please complete it **before requesting another one**.
> 3. **Limit**: You can be assigned a **maximum of two issues** at a time.
> 4. **No Ghosting**: If you cannot complete an issue, please unassign yourself or let us know so others can pick it up.

## ⭐ Before You Start

1. **Star the Repository**: Starring is mandatory before contributing! It supports the project.
2. **Join Discord**: [Join our server](https://discord.gg/dQUh6SY9Uk) for discussions and faster PR review.
   - **Note**: You must be a member of the Discord server to get PRs merged.

## 🚀 Getting Started

1. **Fork** the repository and **Clone** it locally.
2. **Sync** with the `develop` branch.
   ```bash
   git checkout develop
   git pull origin develop
   ```
3. **Create a Branch** for your fix/feature.
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 🛠️ Development Setup

Follow the [Quick Start Guide](README.md#%F0%9F%9A%80-quick-start) in the README to install dependencies and set up environment variables.

**Summary of commands:**

```bash
# 1. Install Dependencies
pnpm install                  # Root (Frontend workspace)
cd user_backend && npm install # Backend Service

# 2. Start Development Servers
# Terminal 1 (Frontend):
pnpm dev

# Terminal 2 (Backend):
cd user_backend && npm run dev
```

## 📮 Pull Request Policy

- **Target Branch**: Raise PRs to the **`develop`** branch ONLY.
- **Check Discord**: Look at `#pull-request` channel to ensure no one else is working on the same thing.
- **Build Check**: Run `pnpm build` locally and ensure it passes.
- **Visual Proof**: Include **screenshots or screen recordings** for any UI changes.
- **Description**: Reference the issue number (e.g., `Fixes #123`).

## 🧪 Testing & Quality

- **Type Safety**: Maintain strict TypeScript types. Avoid `any`.
- **Linting**: Run `pnpm lint` before committing.
- **Testing**:
  - Verify WebRTC connections (video/audio).
  - Test edge cases (disconnection, identifying matches).
  - Ensure responsive design.

## 🤝 Community & Support

Join us on [Discord](https://discord.gg/dQUh6SY9Uk) if you have questions! We are happy to guide you.
