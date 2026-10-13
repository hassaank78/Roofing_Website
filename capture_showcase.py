import subprocess
import os
import time

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SCREENSHOT_DIR = r"C:\Users\Hassan\.gemini\antigravity\scratch\roofing-website\test_screenshots"

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# 1. Default Apex Ridge Dallas Desktop
subprocess.run([EDGE, "--headless", "--disable-gpu", "--window-size=1440,900", f"--screenshot={os.path.join(SCREENSHOT_DIR, '01_default_apex_dallas.png')}", "http://127.0.0.1:8899/index.html"])

# 2. Smith Roofing Austin TX Preset
subprocess.run([EDGE, "--headless", "--disable-gpu", "--window-size=1440,900", f"--screenshot={os.path.join(SCREENSHOT_DIR, '02_smith_roofing_austin.png')}", "http://127.0.0.1:8899/index.html?business=smith-roofing"])

# 3. Summit Ridge Denver CO Preset (Hail Specialist)
subprocess.run([EDGE, "--headless", "--disable-gpu", "--window-size=1440,900", f"--screenshot={os.path.join(SCREENSHOT_DIR, '03_summit_ridge_denver.png')}", "http://127.0.0.1:8899/index.html?business=summit-ridge"])

# 4. Custom Override URL (Phoenix AZ, Royal Blue Accent)
subprocess.run([EDGE, "--headless", "--disable-gpu", "--window-size=1440,900", f"--screenshot={os.path.join(SCREENSHOT_DIR, '04_custom_phoenix_blue.png')}", "http://127.0.0.1:8899/index.html?name=Pinnacle%20Roofing%20Craft&city=Phoenix&state=AZ&phone=(602)%20555-8833&accent=%232563EB"])

# 5. Mobile 390px (iPhone 14/15/16 standard viewport)
subprocess.run([EDGE, "--headless", "--disable-gpu", "--window-size=390,844", f"--screenshot={os.path.join(SCREENSHOT_DIR, '05_mobile_iphone_390.png')}", "http://127.0.0.1:8899/index.html?business=smith-roofing"])

# 6. Tablet 768px (iPad portrait)
subprocess.run([EDGE, "--headless", "--disable-gpu", "--window-size=768,1024", f"--screenshot={os.path.join(SCREENSHOT_DIR, '06_tablet_ipad_768.png')}", "http://127.0.0.1:8899/index.html"])

print("All showcase screenshots captured successfully!")
