# API Endpoints

Base URL: `/api`

## Health
- `GET /api/health`
  - Response: `{ status: 'ok', timestamp: string }`

## Personnel
- `GET /api/personnel` → List all personnel
- `GET /api/personnel/:id` → Get one
- `POST /api/personnel` → Create
  - Body: `{ name, email, role?, experience_level? }`
- `PUT /api/personnel/:id` → Update
  - Body: `{ name?, email?, role?, experience_level? }`
- `DELETE /api/personnel/:id` → Delete

### Personnel Skills
- `GET /api/personnel/:id/skills` → List skills for personnel
- `POST /api/personnel/:id/skills` → Assign or update
  - Body: `{ skill_id, proficiency_level }`
- `PUT /api/personnel/:id/skills/:skillId` → Update proficiency
  - Body: `{ proficiency_level }`
- `DELETE /api/personnel/:id/skills/:skillId` → Remove assignment

## Skills
- `GET /api/skills` → List skills
- `GET /api/skills/:id` → Get one
- `POST /api/skills` → Create
  - Body: `{ skill_name, category?, description? }`
- `PUT /api/skills/:id` → Update
  - Body: `{ skill_name?, category?, description? }`
- `DELETE /api/skills/:id` → Delete

## Projects
- `GET /api/projects` → List projects
- `GET /api/projects/:id` → Get one
- `POST /api/projects` → Create
  - Body: `{ project_name, description?, start_date?, end_date?, status? }`
- `PUT /api/projects/:id` → Update
  - Body: `{ project_name?, description?, start_date?, end_date?, status? }`
- `DELETE /api/projects/:id` → Delete

### Project Required Skills
- `GET /api/projects/:id/requirements` → List requirements
- `POST /api/projects/:id/requirements` → Add requirement
  - Body: `{ skill_id, minimum_proficiency_level }`
- `PUT /api/projects/:id/requirements/:skillId` → Update requirement
  - Body: `{ minimum_proficiency_level }`
- `DELETE /api/projects/:id/requirements/:skillId` → Remove requirement

## Matching & Search
- `GET /api/matching/:projectId` → Personnel who meet ALL required skills
  - Response: `[{ id, name, role, experience_level, matched_skills, match_percentage }]`
- `GET /api/matching/search/personnel?experienceLevel=Senior&skillId=3&minProficiency=Advanced`
  - Response: `[{ id, name, email, role, experience_level }]`

## Sample Requests

```http
POST /api/personnel
Content-Type: application/json

{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "role": "Frontend Developer",
  "experience_level": "Mid-Level"
}
```

```json
GET /api/matching/1
[
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@company.com",
    "role": "Backend Developer",
    "experience_level": "Senior",
    "matched_skills": "Node.js:Expert, AWS:Advanced",
    "match_percentage": 100
  }
]
```