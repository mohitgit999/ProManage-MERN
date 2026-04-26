# How to Run Pro Manage

Follow these steps to get your MERN stack application up and running.

## 1. Prerequisites
- **Node.js** installed on your system.
- **MongoDB** running locally on `mongodb://localhost:27017/promanage` OR a MongoDB Atlas connection string.
  - If using Atlas, update the `MONGO_URI` in `ProManage/backend/.env`.

## 2. Start the Backend
Open a terminal and run:
```powershell
cd "g:\Pro Manage Mern Stack\ProManage\backend"
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

## 3. Start the Frontend
Open a **new** terminal and run:
```powershell
cd "g:\Pro Manage Mern Stack\ProManage\frontend"
npm run dev
```
The application will be available at [http://localhost:5173](http://localhost:5173).

---

### Features Implemented:
- **Authentication**: Register and Login with JWT.
- **Dashboard**: Overview of all your projects with search and status filters.
- **Projects**: Create, update, and delete projects with custom colors and priorities.
- **Kanban Board**: Manage tasks within a project across Backlog, To-Do, In Progress, and Done columns.
- **Tasks**: Create tasks with checklists, due dates, priorities, and tags.
- **Responsive Design**: Fully responsive UI with a premium dark theme.
