#!/bin/bash
# Navrit MVP - Development Server Script
# Runs both backend (port 3000) and frontend (port 5173)

echo "🚀 Starting Navrit MVP..."
echo ""

# Set node path for homebrew installation
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "📦 Starting Backend on port 3000..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo "🎨 Starting Frontend on port 5173..."
cd client && npm run dev &
FRONTEND_PID=$!

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Navrit MVP is running!"
echo ""
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:5173"
echo "   API Docs: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop both servers."
echo "═══════════════════════════════════════════════"
echo ""

# Wait for processes
wait
