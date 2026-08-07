# DevConnect
A MERN-stack developer social platform where developers build a profile, share posts, follow other developers, and browse a built-in job board.
Overview
Most "developer social network" tutorials stop at auth and a feed. DevConnect goes further — it adds a follow graph with aggregated counts and a job board with employer-only CRUD, so it exercises the same schema-design and access-control problems as a real product, not just a CRUD demo. I built it to practice the parts of the MERN stack that don't show up in a basic todo-app clone: refresh-token auth, relational-style modeling in MongoDB, and third-party file uploads.

# Live Demo
Frontend: [ Vercel URL]
Backend API: [ Render URL]

# Tech Stack
* Frontend: React, Redux Toolkit, Tailwind CSS, Axios
* Backend: Node.js, Express, MongoDB (Mongoose)
* Auth: JWT (access + refresh tokens) with Google OAuth
* Media: Cloudinary for avatar uploads

# Features
* JWT auth with refresh-token rotation, plus Google OAuth login
* Developer profiles with skills, bio, and Cloudinary-hosted avatars
* Full social feed — create posts, like, and comment
* Follow/unfollow system with aggregated follower/following counts
* Job board section with CRUD for employers
* Search and filter developer profiles by skill

# Key Technical Decisions
Access tokens are short-lived and kept in memory on the client; the refresh token lives in an HTTP-only cookie and is used to silently reissue access tokens, so a stolen access token has a small blast radius
Follows are modeled as a separate Follow collection (follower/following pairs) rather than arrays on the User doc, then resolved with aggregation pipelines for counts and "who to follow" suggestions — this avoids unbounded array growth on popular profiles
Job postings live in their own schema, separate from social posts, since they need employer-only write access and different query patterns (filter by role/location vs. chronological feed)
Avatar/image uploads go client-side to Cloudinary via an unsigned upload preset; only the resulting URL is sent to the backend, keeping file handling off the Express server entirely
