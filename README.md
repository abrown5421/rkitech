
# rkitech

rkitech is a modular full-stack boilerplate designed to accelerate development of modern web applications.  
It is structured as a **monorepo** with three main components:

- **frontend/** – A React + Vite setup for building fast, interactive UIs.  
- **backend/** – A Node.js/Express API layer with room for future database integration.  
- **cli/** – A command-line interface tool that can interact with the API and help scaffold or manage data, pages, and user resources.

### 🌱 Purpose

The goal of rkitech is to serve as a reusable foundation for new projects — something that can be cloned or generated via `degit` and immediately run both the frontend and backend environments with minimal setup.  

It will include:
- Shared configuration for linting, formatting, and TypeScript (if used)
- Preconfigured dev scripts using **concurrently**
- Example data structures and endpoints
- Simple CLI utilities to interact with the backend

### 🚀 Getting Started

```bash
npx degit abrown5421/rkitech my-new-project
cd my-new-project
npm install
npm run dev