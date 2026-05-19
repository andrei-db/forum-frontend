# Forum Frontend

Frontend application for the Modern Community Forum Platform.

Built with React, Tailwind CSS and React Router.

## Live Demo

https://forum-frontend-three.vercel.app/

## Backend Repository

https://github.com/andrei-db/forum-backend

## Tech Stack

- React
- React Router
- Tailwind CSS
- Recharts
- Lucide React
- Framer Motion

## Features

- Authentication system
- Forum categories and forums
- Topics and replies
- Group-based forum permissions
- Responsive UI
- Admin control panel
- Analytics dashboard
- Maintenance mode
- Forum settings integration
- Member profiles
- Breadcrumb navigation

## Project Structure

```txt
src/
 ├── admin/
 ├── api/
 ├── components/
 ├── context/
 ├── layouts/
 ├── pages/
 ├── utils/
 └── assets/
 ```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE=
```

## Run Development Server

```bash
npm run dev
```

## Build Production Version

```bash
npm run build
```

## Notes

This frontend communicates with a custom Express + Prisma backend API and includes a fully custom-built admin control panel and forum permission system.