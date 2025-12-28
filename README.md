# Skills and Resource Management System

A full-stack web application to manage personnel, skills, and projects for your organization.

## Features
- Dashboard overview with stats and recent projects
- Add, edit, and manage skills
- Add, edit, and manage personnel
- Assign skills and proficiency levels to personnel
- Add, edit, and manage projects
- Set required skills for projects
- Match personnel to projects based on skills
- Visualize personnel utilization

## Getting Started
1. **Clone the repository:**
   ```sh
   git clone https://github.com/tharanijayathura/Skills-and-Resource-Management-System.git
   cd Skills-and-Resource-Management-System
   ```
2. **Install dependencies:**
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. **Database setup:**
   - Import `database/schema.sql` into your MySQL server.
   - Configure environment variables in `backend/.env` (see `.env.example`).
4. **Run the project:**
   - Backend: `cd backend && node src/server.js`
   - Frontend: `cd frontend && npm run dev`

## Notes
- Do not commit your `.env` or any files containing passwords or secrets.
- See `.gitignore` for excluded files.

## License
MIT
   - Utilization summary with color-coded indicators
   - Helps identify over-utilized or available resources

9. **Export Functionality**
   - Export personnel data to CSV
   - Export project data to CSV
   - Easy data portability for reporting

10. **Modern UI/UX**
    - Beautiful gradient design with smooth animations
    - Card-based layouts
    - Modal dialogs for forms
    - Toast notifications for user feedback
    - Loading states
    - Empty states with helpful messages
    - Responsive design for mobile devices
    - Color-coded badges and status indicators

## 🛠️ Technology Stack

- **Frontend:**
  - React 18.2.0 (with Hooks)
  - Vite (build tool)
  - React Router (navigation)
  - Axios (HTTP client)
  - Modern CSS with CSS Variables

- **Backend:**
  - Node.js
  - Express.js
  - MySQL2 (database driver)
  - CORS enabled

- **Database:**
  - MySQL 8.0+
  - Normalized schema with foreign keys
  - InnoDB engine

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Database Setup

1. Open MySQL client and run:
```sql
SOURCE path/to/database/schema.sql;
```

Or manually import the `database/schema.sql` file.

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=skills_management
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Skills Resource Management System/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── models/          # Data models (if needed)
│   │   ├── db.js            # Database connection
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api/             # API client
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── styles.css       # Global styles
│   └── package.json
├── database/
│   └── schema.sql           # Database schema
└── README.md
```

## 🎨 Additional Feature: Personnel Utilization Visualization

### Overview
The Personnel Utilization Visualization is a unique feature that goes beyond the core requirements. It provides insights into how personnel are allocated across projects, helping managers make informed decisions about resource allocation.

### Features:
- **Visual Cards**: Each personnel member is displayed in a card showing:
  - Utilization percentage with color coding
  - Total project count
  - Breakdown by project status (Active, Planning, Completed)
  - Visual progress bars

- **Utilization Categories**:
  - **Available** (< 40%): Personnel with low utilization
  - **Moderate** (40-60%): Balanced workload
  - **High** (60-80%): High utilization
  - **Over-utilized** (≥ 80%): May need workload reduction

- **Summary Statistics**: Quick overview of utilization distribution across the team

### Use Cases:
- Identify overworked team members
- Find available resources for new projects
- Balance workload across the team
- Plan resource allocation for upcoming projects

### API Endpoint:
```
GET /api/matching/utilization/personnel
```

Returns utilization data for all personnel with project counts and status breakdowns.

## 📊 API Endpoints

### Personnel
- `GET /api/personnel` - Get all personnel
- `POST /api/personnel` - Create personnel
- `PUT /api/personnel/:id` - Update personnel
- `DELETE /api/personnel/:id` - Delete personnel
- `GET /api/personnel/:id/skills` - Get personnel skills
- `POST /api/personnel/:id/skills` - Assign skill
- `PUT /api/personnel/:id/skills/:skillId` - Update skill proficiency
- `DELETE /api/personnel/:id/skills/:skillId` - Remove skill

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/requirements` - Get project requirements
- `POST /api/projects/:id/requirements` - Add requirement
- `PUT /api/projects/:id/requirements/:skillId` - Update requirement
- `DELETE /api/projects/:id/requirements/:skillId` - Remove requirement

### Matching
- `GET /api/matching/:projectId` - Match personnel to project
- `GET /api/matching/search/personnel` - Advanced search
- `GET /api/matching/utilization/personnel` - Get utilization data

## 🎯 Matching Algorithm

The matching algorithm finds personnel who:
1. Have **ALL** required skills for the project
2. Meet or exceed the **minimum proficiency level** for each skill
3. Are sorted by experience level (Senior first) and name

Only personnel who match 100% of requirements are returned.

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, smooth animations, card-based layouts
- **Responsive**: Works on desktop, tablet, and mobile devices
- **User Feedback**: Toast notifications for all actions
- **Loading States**: Visual feedback during data loading
- **Empty States**: Helpful messages when no data is available
- **Color Coding**: Visual indicators for status, experience levels, and utilization
- **Modal Dialogs**: Clean form interfaces
- **Export Options**: Easy data export for reporting

## 📸 Screenshots

*Note: Add screenshots of your application here, including:*
- Dashboard overview
- Personnel management interface
- Project matching results
- Utilization visualization
- API testing screenshots (Postman/Insomnia)

## 🧪 Testing API Endpoints

Use Postman, Insomnia, or Thunder Client to test the API. Required test cases:

1. **POST** - Create a new personnel (show request body and successful response)
2. **GET** - Retrieve all personnel (show response with data)
3. **PUT** - Update a skill (show request body and response)
4. **POST** - Assign a skill to personnel (show request and response)
5. **GET** - Matching algorithm endpoint (show project requirements and matched personnel response)

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Build: `npm run build` (if applicable)
3. Start: `npm start`

### Frontend
1. Build: `npm run build`
2. Serve the `dist` folder with a web server (nginx, Apache, etc.)

## 📝 Notes

- No authentication is implemented (as per requirements)
- All timestamps are auto-generated
- Email validation is handled on the frontend
- The system uses a normalized database schema
- Foreign key constraints ensure data integrity

## 🤝 Contributing

This is an intern project assignment. For improvements or issues, please contact the project owner.

## 📄 License

This project is created for educational purposes as part of an intern assignment.

---

**Developed with ❤️ for 4BEX Intern Assignment**
