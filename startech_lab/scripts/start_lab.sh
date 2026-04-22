#!/bin/bash
# scripts/start_lab.sh - Launch StarTech Phishing Simulation Lab

echo "=================================="
echo "StarTech Phishing Simulation Lab"
echo "Lab 2c - UML Architecture"
echo "=================================="
echo ""

# DYNAMIC PATH DETECTION:
# Finds the absolute path of the directory where this script lives, 
# then goes up one level to the main lab folder.
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
LAB_DIR=$(dirname "$SCRIPT_DIR")
WEB_DIR="$LAB_DIR/web"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is required but not installed."
    exit 1
fi

# Check if lab directory exists
if [ ! -d "$LAB_DIR" ]; then
    echo "ERROR: Lab directory not found at $LAB_DIR"
    echo "Please ensure the lab is properly installed."
    exit 1
fi

echo "[1] Starting Apache simulation server..."
# Move to the root lab directory so python can find the scripts folder correctly
cd "$LAB_DIR"
python3 scripts/lab_server.py &

SERVER_PID=$!
echo "    Server PID: $SERVER_PID"
echo ""

echo "[2] Opening lab entry point..."
sleep 2

# Try to open in browser
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:8080/web/index.html"
elif command -v open &> /dev/null; then
    open "http://localhost:8080/web/index.html"
else
    echo "    Please open: http://localhost:8080/web/index.html"
fi

echo ""
echo "[3] Opening IT Defender Dashboard..."
sleep 1

if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:8080/it_dashboard/index.html"
elif command -v open &> /dev/null; then
    open "http://localhost:8080/it_dashboard/index.html"
fi

echo ""
echo "=================================="
echo "Lab is running!"
echo "=================================="
echo ""
echo "Attack Flow (UML):"
echo "  Attacker -> Platform -> Victim -> Phishing Server"
echo "  -> Logger -> Logs -> IT Defender -> Block Attack"
echo ""
echo "Available endpoints:"
echo "  Lab Entry:      http://localhost:8080/web/index.html"
echo "  IT Dashboard:   http://localhost:8080/it_dashboard/index.html"
echo "  CFO Persona:    http://localhost:8080/web/personas/cfo_view.html"
echo "  Support Staff:  http://localhost:8080/web/personas/support_view.html"
echo ""
echo "Press Ctrl+C to stop the lab server"
echo ""

# Wait for interrupt
trap "echo ''; echo 'Stopping lab server...'; kill $SERVER_PID 2>/dev/null; echo 'Lab stopped.'; exit 0" INT

wait $SERVER_PID
