#!/bin/bash

# Check if the backend server is running
if nc -z localhost 5001 2>/dev/null; then
  echo "Backend server is already running on port 5001"
else
  echo "Starting backend server..."
  cd backend
  npm start &
  BACKEND_PID=$!
  cd ..

  # Wait for backend to initialize
  echo "Waiting for backend to initialize..."
  attempt=0
  max_attempts=30
  while ! nc -z localhost 5001 2>/dev/null && [ $attempt -lt $max_attempts ]; do
    sleep 1
    ((attempt++))
    echo "Waiting... ($attempt/$max_attempts)"
  done

  if [ $attempt -eq $max_attempts ]; then
    echo "Backend server failed to start within the timeout period"
    kill $BACKEND_PID
    exit 1
  fi

  echo "Backend server started successfully on port 5001"
fi

# Start frontend in development mode
echo "Starting frontend server..."
npm start

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  if [ ! -z ${BACKEND_PID+x} ]; then
    kill $BACKEND_PID
  fi
  exit 0
}

# Set up trap to call cleanup function when script terminates
trap cleanup SIGINT SIGTERM 