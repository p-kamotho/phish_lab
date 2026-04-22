#!/usr/bin/env python3
# scripts/lab_server.py - Simple HTTP server for StarTech Phishing Lab

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

PORT = 8080

class StarTechLabHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for StarTech Phishing Lab"""
    
    def do_GET(self):
        """Handle GET requests with custom routing"""
        
        # Parse the URL
        parsed = urlparse(self.path)
        path = parsed.path
        
        # Log the request
        print(f"[LAB] {self.address_string()} - {self.command} {path}")
        
        # Special handling for log files (simulated)
        if path.startswith('/logs/'):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            
            # Simulate log file content
            if 'credentials.log' in path:
                self.wfile.write(b"# StarTech Lab - Captured Credentials\n")
                self.wfile.write(b"# Format: timestamp,username,password,service,ip\n")
            elif 'activity.log' in path:
                self.wfile.write(b"# StarTech Lab - Activity Log\n")
                self.wfile.write(b"# Format: timestamp,event_type,page,details\n")
            elif 'alerts.log' in path:
                self.wfile.write(b"# StarTech Lab - Security Alerts\n")
                self.wfile.write(b"# Format: timestamp,severity,message,acknowledged\n")
            else:
                self.wfile.write(b"# Log file\n")
            return
        
        # Default handling
        super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length else b''
        
        print(f"[LAB POST] {self.path} - {len(post_data)} bytes")
        
        # Simulate credential capture endpoint
        if '/api/capture' in self.path:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"captured","timestamp":"2024-01-15T10:30:00Z"}')
            return
        
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'OK')
    
    def log_message(self, format, *args):
        """Custom log format"""
        # Suppress default logging since we have our own
        pass

class ReusableTCPServer(socketserver.TCPServer):
    """TCP Server with address reuse"""
    allow_reuse_address = True

def run_server():
    """Start the HTTP server"""
    
    # Change to the lab root directory
    lab_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(lab_root)
    
    print("==================================")
    print("StarTech Phishing Simulation Lab")
    print("Apache Simulation Server")
    print("==================================")
    print(f"Lab root: {lab_root}")
    print(f"Starting server on port {PORT}...")
    print("")
    print("UML Architecture Active:")
    print("  [Attacker] -> [Platform] -> [Victim] -> [Phishing Server]")
    print("  -> [Logger] -> [Logs] -> [IT Defender] -> [Block Attack]")
    print("")
    print(f"Access the lab at: http://localhost:{PORT}/web/index.html")
    print(f"IT Dashboard at:    http://localhost:{PORT}/it_dashboard/index.html")
    print("")
    print("Press Ctrl+C to stop the server")
    print("==================================")
    print("")
    
    try:
        with ReusableTCPServer(("", PORT), StarTechLabHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_server()