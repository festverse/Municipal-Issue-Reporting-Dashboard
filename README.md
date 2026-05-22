src/
├── api/
│   └── client.js             # Centralized fetch calls (GET, POST, PATCH)
├── components/
│   ├── IssueMap.jsx          # Leaflet map component for displaying tickets
│   ├── TicketForm.jsx        # The form where citizens submit issues
│   └── DashboardTable.jsx    # Table for engineers to change status
├── pages/
│   ├── CitizenPortal.jsx     # Renders TicketForm + Map (to drop a pin)
│   └── EngineerDashboard.jsx # Renders IssueMap + DashboardTable
└── App.jsx                   # React Router setup