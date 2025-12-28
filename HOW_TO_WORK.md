
# How to Work in This Project

> This guide is always available from the Dashboard via the "How to Work" button.

Welcome to the Skills Resource Management System! This document will help you understand every feature and how to use the system from start to finish.

---

## 1. Dashboard
The Dashboard is your home screen. Here you can:
- See quick stats: total personnel, skills, projects, and active projects.
- View a list of recent projects.
- Access this guide at any time using the "How to Work" button.

---

## 2. Skills Management
**Skills** are the core abilities or technologies tracked in your organization.
- Go to the Skills section from the sidebar or navigation.
- **Add Skill:** Click "+ Add Skill" and fill in the skill name, category (e.g., Programming Language, Tool, Certification), and an optional description.
- **Edit Skill:** Click on a skill name or category to edit it inline.
- **Delete Skill:** Use the delete button to remove a skill.

---

## 3. Personnel Management
**Personnel** are your team members.
- Go to the Personnel section.
- **Add Personnel:** Click "+ Add Personnel" and enter their name, email, role, and experience level.
- **Assign Skills:** While adding or editing personnel, select skills and set proficiency levels (Beginner, Intermediate, Advanced, Expert).
- **Edit Personnel:** Click on a name, email, or role to edit inline.
- **Delete Personnel:** Use the delete button to remove a team member.

---

## 4. Project Management
**Projects** are the initiatives or tasks your team works on.
- Go to the Projects section.
- **Add Project:** Click "+ Create Project" and fill in the project name, description, dates, and status.
- **Set Requirements:** For each project, you can specify required skills and minimum proficiency levels.
- **Edit Project:** Click on project details to edit inline.
- **Delete Project:** Use the delete button to remove a project.

---

## 5. Matching & Utilization
**Matching** helps you find the best personnel for a project based on required skills.
- Go to the Matching section to match personnel to projects.

**Utilization** visualizes how busy each team member is.
- Go to the Utilization section to see charts and stats on personnel allocation.

---

## 6. General Usage Tips
- Use the navigation bar or sidebar to switch between features.
- All lists support inline editing for quick changes.
- Use the export buttons to download data as CSV.
- The system is designed to be intuitive—hover over buttons for tooltips.

---

## 7. Getting Started (Setup)
1. **Install dependencies**
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
2. **Database setup**
   - Import the schema from `database/schema.sql` into your MySQL server.
   - Update environment variables as needed in the backend.
3. **Run the project**
   - Backend: `cd backend && node src/server.js`
   - Frontend: `cd frontend && npm run dev`

---

## 8. Need Help?
- Contact the project maintainer or check the code comments for guidance.