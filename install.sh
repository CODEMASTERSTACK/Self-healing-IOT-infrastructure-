#!/bin/bash

# Linux/Mac Setup Script for IoT Simulation

echo ""
echo "====================================="
echo "IoT Self-Healing Infrastructure"
echo "Setup Script (Linux/macOS)"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"

# Setup Backend
echo ""
echo "Installing Backend Dependencies..."
cd backend || exit 1
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..

# Setup Frontend
echo ""
echo "Installing Frontend Dependencies..."
cd frontend || exit 1
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✓ Setup Complete!"
echo ""
echo "To start the simulation:"
echo ""
echo "1. In Terminal 1 (Backend):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. In Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
