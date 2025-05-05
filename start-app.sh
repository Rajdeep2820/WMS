#!/bin/bash

# Kill any existing processes on port 5001 and 3000
echo "Checking for existing processes..."
PORT_5001_PID=$(lsof -ti:5001)
PORT_3000_PID=$(lsof -ti:3000)

if [ ! -z "$PORT_5001_PID" ]; then
  echo "Killing process on port 5001..."
  kill -9 $PORT_5001_PID
fi

if [ ! -z "$PORT_3000_PID" ]; then
  echo "Killing process on port 3000..."
  kill -9 $PORT_3000_PID
fi

# Ask about database setup
read -p "Would you like to set up the database before starting? (y/n): " setup_db

if [[ $setup_db == "y" || $setup_db == "Y" ]]; then
  echo "Setting up database..."
  cd backend
  npm run setup-db
  cd ..
  echo "Database setup complete!"
fi

# Start backend server
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
attempt=0
max_attempts=20
while ! nc -z localhost 5001 2>/dev/null && [ $attempt -lt $max_attempts ]; do
  sleep 1
  ((attempt++))
  echo "Waiting... ($attempt/$max_attempts)"
done

if [ $attempt -eq $max_attempts ]; then
  echo "Backend server failed to start within the timeout period"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

echo "Backend server is running on port 5001"

# Start frontend server
echo "Starting frontend server..."
cd ..
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

# Set up trap to call cleanup function when script terminates
trap cleanup SIGINT SIGTERM

# Keep script running
echo "Both servers are running."
echo "Backend is running on http://localhost:5001"
echo "Frontend is running on http://localhost:3000"
echo "Press Ctrl+C to stop all servers."
wait 