# Secure Note | Note Sharing Application

A full-stack web application that allows users to create, retrieve, edit, and delete secure notes with password protection.

## Features
- Create notes with a unique password
- Retrieve notes using Note ID and password
- Edit and delete notes with password verification
- Responsive design
- Secure password hashing

## Prerequisites
- Node.js (v14 or later)
- MongoDB (v4 or later)
- npm (Node Package Manager)

## Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/secure-note-app.git
cd secure-note-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Update `MONGODB_URI` with your MongoDB connection string
- Adjust `PORT` if needed

4. Start the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. Open in browser
- Navigate to `http://localhost:3000`

## Security Notes
- Passwords are hashed before storage
- Each note has a unique ID for retrieval
- Passwords are required for all note operations

## Technology Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Security: bcrypt for password hashing

## Deployment
- Ensure MongoDB is accessible
- Set appropriate environment variables
- Use process managers like PM2 for production deployment

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
