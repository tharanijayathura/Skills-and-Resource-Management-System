import React from 'react';

export default function HowToWork() {
  return (
    <div className="card" style={{ maxWidth: 800, margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Project Guide: How to Work in This Project</h1>
      <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: 1.7 }}>
{`
Welcome to the Skills Resource Management System! This page will guide you through every feature and step, from setup to daily use.

---

1. Dashboard
- View stats: personnel, skills, projects, active projects.
- See recent projects.
- Access this guide anytime from the Dashboard.

2. Skills Management
- Add, edit, or delete skills (e.g., Programming Language, Tool, Certification).
- Use the "+ Add Skill" button to create new skills.

3. Personnel Management
- Add, edit, or delete personnel.
- Assign skills and proficiency levels to each person.
- Use the "+ Add Personnel" button to add new team members.

4. Project Management
- Add, edit, or delete projects.
- Set required skills and minimum proficiency for each project.
- Use the "+ Create Project" button to start a new project.

5. Matching & Utilization
- Match personnel to projects based on skills.
- Visualize how busy each team member is in the Utilization section.

6. General Usage Tips
- Use the navigation bar/sidebar to switch features.
- Inline editing is supported for quick changes.
- Export data as CSV using export buttons.

7. Getting Started (Setup)
- Install dependencies:
  - Backend: cd backend && npm install
  - Frontend: cd frontend && npm install
- Database setup:
  - Import database/schema.sql into MySQL
  - Update backend environment variables as needed
- Run the project:
  - Backend: cd backend && node src/server.js
  - Frontend: cd frontend && npm run dev

8. Need Help?
- Contact the project maintainer or check code comments for more info.
`}
      </div>
    </div>
  );
}
