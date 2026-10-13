import urllib.request
import json
import subprocess
import time

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Start Edge with remote debugging
proc = subprocess.Popen([
    EDGE_PATH, 
    "--headless", 
    "--disable-gpu", 
    "--remote-debugging-port=9222", 
    "--window-size=375,812", 
    "http://127.0.0.1:8899/index.html"
])

time.sleep(2)

try:
    # Query DevTools targets
    req = urllib.request.urlopen("http://127.0.0.1:9222/json")
    targets = json.loads(req.read().decode())
    ws_url = targets[0]["webSocketDebuggerUrl"]
    print("Edge DevTools connected:", ws_url)
finally:
    proc.kill()
