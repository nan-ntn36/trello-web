<div align="center">
  <br />
  <h1>Trello Web</h1>
  <br />
  <div>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="40" height="40" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" width="40" height="40" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" alt="Redux" width="40" height="40" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="Material UI" width="40" height="40" />
  </div>
  <br />
  <p>Frontend application for the Trello-inspired real-time task management platform.</p>
</div>

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [API Configuration](#-api-configuration)
- [Run the Project](#-run-the-project)
- [Build and Preview](#-build-and-preview)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)

## 🤖 Introduction

Trello Web is a React single-page application for visual task management. It allows users to authenticate, create and manage boards, organize columns and cards, invite members, search boards, upload files, receive notifications, and collaborate in real time.

The frontend communicates with the Trello API through Axios and receives real-time events through Socket.io.

## 🔋 Features

- User registration, login, logout, and token refresh
- Board, column, and card management
- Drag-and-drop card and column organization
- Board member invitations and permissions
- Board search with debounced autocomplete
- File upload support
- Real-time notifications and collaboration
- Markdown card descriptions
- Responsive interface with Material UI
- Toast notifications and confirmation dialogs

## ⚙️ Tech Stack

- React 18
- Vite
- Redux Toolkit and Redux Persist
- React Router DOM
- Material UI and Emotion
- Axios
- Socket.io Client
- @dnd-kit for drag and drop
- React Hook Form
- React Markdown Editor
- ESLint

## 🧰 Requirements

- Node.js 18.x
- Yarn 1.x or npm
- A running instance of Trello API
- Git

## 🚀 Installation

Clone the repository and install dependencies:

~~~bash
git clone <your-web-repository-url>
cd trello-web
yarn install
~~~

You can also use npm:

~~~bash
npm install
~~~

## 🔌 API Configuration

The API base URL is configured in src/utils/constants.js:

- Development: http://localhost:3692
- Production: an empty base URL by default, intended for same-origin deployment

To use a deployed API, update the production API_ROOT value in that file:

~~~js
// src/utils/constants.js
export const API_ROOT = 'https://your-api-domain.example';
~~~

The frontend also uses the API base URL for its Socket.io connection. Start the backend before using board, authentication, or real-time features.

## ▶️ Run the Project

Start the Vite development server:

~~~bash
yarn dev
~~~

Or:

~~~bash
npm run dev
~~~

The development server is available at the URL printed by Vite, commonly:

~~~text
http://localhost:5173
~~~

The dev script sets BUILD_MODE=dev, so API requests are sent to http://localhost:3692.

## 📦 Build and Preview

Create a production build:

~~~bash
npm run build
~~~

Preview the production build locally:

~~~bash
npm run preview
~~~

Run ESLint:

~~~bash
npm run lint
~~~

## 🗂️ Project Structure

~~~text
src/
├── apis/                 # Axios API functions
├── assets/               # Images, icons, and static assets
├── components/           # Shared UI components
├── customHook/           # Reusable React hooks
├── customLibraries/      # Shared library helpers
├── pages/                # Application pages and page-specific components
├── redux/                # Redux store and feature slices
├── utils/                # Constants and utility functions
└── socketClient.js        # Socket.io client configuration
~~~

Important UI areas include:

- AppBar/SearchBoards for board search and autocomplete
- pages/Boards for board, column, and card workflows
- redux for application state management
- apis for backend requests

## 📄 Available Scripts

| Script | Description |
| --- | --- |
| yarn dev | Start Vite in development mode with API development configuration |
| npm run build | Build the production bundle with Vite |
| npm run preview | Preview the production bundle locally |
| npm run lint | Check JavaScript and JSX files with ESLint |

## 📜 License

This project is for learning and development purposes.
