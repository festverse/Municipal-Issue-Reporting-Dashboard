# 🏙️ Municipal Issue Reporting Dashboard

A full-stack, geolocation-based web application designed to bridge civic infrastructure engineering and software development. This platform allows citizens to report municipal issues (such as potholes, water leaks, and streetlight failures) via an interactive map, and provides a dashboard for municipal engineers to track, update, and manage the resolution lifecycle of these tickets.

## 🚀 Features

- **Interactive Geolocation Mapping:** Citizens can pinpoint exact locations of infrastructure issues using an integrated React-Leaflet map.
- **Role-Based Workflows:** Separate UI and logic for Citizens (reporting) and Engineers (management and resolution).
- **Robust REST API:** A Node.js/Express backend handling structured CRUD operations.
- **ACID-Compliant Transactions:** Database updates (like changing a ticket status and writing an audit log) are wrapped in SQL transactions to guarantee data integrity.
- **Relational Database Design:** A normalized PostgreSQL database featuring spatial zoning, issue categorization, and automated audit trails.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, React-Leaflet (OpenStreetMap)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, `node-postgres` (pg)

## 📁 Project Structure

This repository is structured as a monorepo containing the frontend client, backend server, and database schemas.

```text
municipal-dashboard/
├── database/            # Database design and initialization
│   ├── schema.sql       # PostgreSQL DDL script (Tables, ENUMs, Triggers)
│   └── seed.sql         # Mock data for administrative zones and categories
├── server/              # Node.js REST API
│   ├── index.js         # Main server application and endpoints
│   ├── package.json
│   └── .env             # Environment variables (Database connection string)
├── client/              # React (Vite) Frontend UI
│   ├── src/
│   │   ├── api/         # Centralized API fetch logic (client.js)
│   │   ├── components/  # React components (TicketForm, IssueMap)
│   │   └── pages/       # Portal views (Citizen Portal, Engineer Dashboard)
│   ├── package.json
│   └── .env             # Environment variables (Vite API URL)
└── README.md

```
---
&copy; 2026 [Utsav Vasava](https://festverse.in). All Rights Reserved.
