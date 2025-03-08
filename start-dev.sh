#!/bin/bash

# Start the backend server
cd ../DogAppServer
echo "Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Start the frontend server
cd ../DogApp
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Function to handle exit
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo "Both servers are running. Press Ctrl+C to stop."
wait 