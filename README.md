
# EventManager

A full-stack application for seamless event management, providing tools to organize, track, and manage events effectively. The project includes both a backend (Node.js + Express) and a frontend (React).

## Table of Contents

- [EventManager](#eventmanager)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Deployment](#deployment)
  - [License](#license)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:
- Node.js
- npm or yarn

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/ramzigz/EventManager.git
   ```

2. Install NPM packages for both backend and frontend:
   ```sh
   cd back-end
   npm install
   cd ../front-end
   npm install
   ```

### Backend

The backend is built with Node.js and Express.

1. Navigate to the backend directory:
   ```sh
   cd back-end
   ```

2. Create a `.env` file and add your environment variables. Example:
   ```env
   PORT=5000
   ```

3. Start the server:
   ```sh
   npm start
   ```

The backend should now be running on `http://localhost:5000`.

### Frontend

The frontend is built with React and Next.js.

1. Navigate to the frontend directory:
   ```sh
   cd front-end
   ```

2. Create a `.env` file and add your environment variables. Example:
    ```env
    API_URL=5000
    ```

3. Start the development server:
   ```sh
   npm run dev
   ```

Open `http://localhost:3000` with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

For the backend, you can deploy it to platforms like Heroku, DigitalOcean, or AWS, depending on your preference.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details on how to deploy the frontend.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.