#!/bin/bash

# Build both projects
./build.sh

# Deploy frontend to GitHub Pages
echo "Deploying frontend to GitHub Pages..."
git add -f dist
git commit -m "Deploy to GitHub Pages"
git push

echo "Frontend deployed to GitHub Pages!"

# Instructions for backend deployment
echo "To deploy the backend, follow these steps:"
echo "1. Set up your server (e.g., AWS, Heroku, DigitalOcean)"
echo "2. Copy the DogAppServer/dist directory to your server"
echo "3. Install dependencies: npm install --production"
echo "4. Set up environment variables"
echo "5. Start the server: npm start" 