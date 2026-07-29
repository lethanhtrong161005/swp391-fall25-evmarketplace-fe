# EV Marketplace Frontend

This is the frontend repository for the **Electric Vehicle (EV) Marketplace**, a comprehensive web platform for buying, selling, and managing electric vehicles and batteries.

## 🚀 Technologies Used

The project is built with a modern React stack:

- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **UI Component Library:** [Ant Design (antd)](https://ant.design/)
- **Styling:** CSS/Sass modules
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Real-time Communication:** WebSockets using `stompjs`, `@stomp/stompjs`, and `sockjs-client`
- **Internationalization:** `i18n`
- **Date/Time Handling:** `dayjs`
- **State/Cookie Management:** `js-cookie`, `universal-cookie`, `jwt-decode`

## 📁 Project Structure

The source code is modularized within the `src` directory using the following structure (with configured path aliases in `vite.config.js`):

- `@/assets`: Static images, icons, and fonts.
- `@/components`: Reusable UI components shared across the application.
- `@/config`: Global configurations and environment setups.
- `@/contexts`: React Context APIs for global state management.
- `@/dtos`: Data Transfer Objects for type-checking and API structures.
- `@/hooks`: Custom React hooks for shared logic.
- `@/layouts`: Structural page layouts for different user roles.
- `@/mappers`: Data transformation utilities.
- `@/pages`: Application pages categorized by user roles:
  - **Admin**: System-wide management (Brands, Categories, Accounts, Models).
  - **Auth**: Authentication and registration flows.
  - **Errors**: Error pages (404, etc.).
  - **Manager**: Higher-level operations (Agreements, Consignments, Listings).
  - **Member**: Customer-facing features (Searching, Consigning, Buying, Chat).
  - **Moderator**: Approval workflows for listings.
  - **Payment**: Checkout and transaction handling.
  - **Staff**: Operational tasks (Inspections, Contracts, Orders).
- `@/routes`: Routing configuration mapping URLs to components.
- `@/services`: API call definitions and wrappers.
- `@/styles`: Global SCSS/CSS styling files.
- `@/utils`: Helper functions and utilities.
- `@/validators`: Form validation logic.

## 👥 Role-Based Features

The application supports multiple distinct roles with tailored dashboards and capabilities:
- **Admin**: Manages system taxonomy (brands, categories, vehicle models) and user accounts.
- **Manager**: Oversees listings and high-level consignment agreements.
- **Moderator**: Reviews and approves/rejects new vehicle listings from members.
- **Staff**: Handles physical vehicle inspections, operational contracts, and order fulfillment.
- **Member**: Browses listings, creates new consignment listings, views product details, and communicates via real-time chat.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed along with `pnpm` (the package manager used in this project).

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/lethanhtrong161005/swp391-fall25-evmarketplace-fe.git
   cd swp391-fall25-evmarketplace-fe
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and fill in the required variables (like API endpoints).
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```
   The application will be accessible via the port configured by Vite (usually `http://localhost:5173`).

### Build for Production

To create an optimized production build:
```bash
pnpm build
```

## 🐳 Docker Deployment

The repository includes configuration for containerized deployment:
- `Dockerfile`: Multi-stage build process for packaging the React app.
- `nginx.conf` & `default.conf`: NGINX configuration for serving the built static files.
- `docker-compose.yml`: For spinning up the frontend service easily.

To run via Docker Compose:
```bash
docker-compose up -d
```
The application will be accessible at `http://localhost:5173`.
