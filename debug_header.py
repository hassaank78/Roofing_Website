import subprocess
import json

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# We run Edge with an HTML file that sets iframe to 375 width and prints exact elements rects inside header
html = """<!DOCTYPE html>
<html>
<body>
<iframe id="f" src="http://127.0.0.1:8899/index.html" width="375" height="812" style="border:none;"></iframe>
<div id="out"></div>
<script>
window.onload = function() {
    setTimeout(function() {
        var doc = document.getElementById('f').contentDocument;
        var brand = doc.getElementById('brandLink').getBoundingClientRect();
        var actions = doc.querySelector('.header-actions').getBoundingClientRect();
        var toggle = doc.getElementById('mobileNavToggle').getBoundingClientRect();
        var btn = doc.querySelector('.header-actions .open-modal-btn');
        var btnStyle = btn ? doc.defaultView.getComputedStyle(btn).display : 'null';
        var toggleStyle = toggle ? doc.defaultView.getComputedStyle(doc.getElementById('mobileNavToggle')).display : 'null';
        
        var res = {
            brandRect: { l: brand.left, r: brand.right, w: brand.width },
            actionsRect: { l: actions.left, r: actions.right, w: actions.width },
            toggleRect: { l: toggle.left, r: toggle.right, w: toggle.width },
            btnDisplay: btnStyle,
            toggleDisplay: toggleStyle
        };
        document.getElementById('out').innerText = 'HEADER_DEBUG: ' + JSON.stringify(res);
    }, 1000);
};
</script>
</body>
</html>
"""

with open("test_header.html", "w", encoding="utf-8") as f:
    f.write(html)

res = subprocess.run([EDGE, "--headless", "--disable-gpu", "--run-all-compositor-stages-before-draw", "--virtual-time-budget=3000", "--dump-dom", "http://127.0.0.1:8899/test_header.html"], capture_output=True, text=True, encoding="utf-8")

for line in res.stdout.splitlines():
    if "HEADER_DEBUG:" in line:
        print(line)
