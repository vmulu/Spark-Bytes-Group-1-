<h1 align="center">Spark Bytes</h1>
<h6 align="center">Brought to you by Group 1</h6>


# Table of Contents
 - [Introduction](#introduction)
 - [Features](#features)
 - [How to (Developers)](#how-to-developers)
 - [Technology](#technology)
   - [Frontend](#frontend)
   - [Backend](#backend)
 - [Database](#database)

# Introduction
Spark Bytes is a platform to help Boston University students find events
with free food on campus. The platform allows students to search for events
based on their preferences and dietary restrictions. Students can also view
event details on a map to see where to go.

# Features
- [x] Set dietary restrictions
- [x] View events on Google Maps
- [x] List view of all events
- [x] Create and edit your own events

# How to (Developers)
Looking to run the project?
1. Get API keys 
   1. Get [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
   2. Get [Google Auth API Key](https://developers.google.com/identity/sign-in/web/sign-in)

```yaml
# ./backend/.env
google_client_id=xx-xxxx.apps.googleusercontent.com
google_client_secret=xx-xxxx
google_secret_key=iamsecure
```

```yaml
# ./frontend/.env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
```

2. Starting the backend
   1. Install [PDM](https://pdm.fming.dev/).

```bash
cd backend
pdm i 
pdm start
```

A local server will be running on `http://localhost:8000`. A new database
will be created in the backend directory.

You can navigate to `http://localhost:8000/docs` to view the API documentation,
and interact with the API in a user-friendly manner. 

3. Starting the frontend
   1. Install [Node.js](https://nodejs.org/en/).

```bash
cd frontend
npm install
npm run dev
```

A local server will be running on `http://localhost:3000`.

# Technology
### Frontend
The frontend is a simple Next.js project

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)

### Backend
The backend is a FastAPI project, with PDM to manage dependencies and uvicorn. 
We wrote a custom OAuth2 scheme to authenticate users with Google.

Uniquely, we have a custom "database endpoint generator" that automatically:
1. Creates a new SQLAlchemy model
2. Creates a new Pydantic model
3. Creates a new endpoints for CRUD operations

Off of a single model. This allows us to quickly add new tables
to the database.

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Google Auth](https://developers.google.com/identity/sign-in/web/sign-in)

### Database
We are using SQLite for the database. This is a simple database that
is easy to set up and use. We are using SQLAlchemy to interact with the
database. We interact with the database asynchronously to prevent blocking
the main thread (should Spark Bytes ever need that level of scalability).

The database is stored in the backend directory:
```
./backend/database.db
```

