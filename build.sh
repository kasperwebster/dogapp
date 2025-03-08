#!/bin/bash

# Build the backend
cd ../DogAppServer
echo "Building backend..."
npm run build

# Build the frontend
cd ../DogApp
echo "Building frontend..."
npm run build

echo "Build completed successfully!" 