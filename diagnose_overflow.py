import subprocess
import json

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# We run Edge with a small HTML file that loads index.html in an iframe of width 375 and prints overflow elements
html = """<!DOCTYPE html>
<html>
<body>
<iframe id="f" src="http://127.0.0.1:8899/index.html" width="375" height="812" style="border:none;"></iframe>
<div id="out"></div>
<script>
window.onload = function() {
    setTimeout(function() {
        try {
            var doc = document.getElementById('f').contentDocument;
            var win = document.getElementById('f').contentWindow;
            var bad = [];
            doc.querySelectorAll('*').forEach(function(el) {
                var r = el.getBoundingClientRect();
                if (r.right > 375.5) {
                    bad.push(el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className : '') + ' [r=' + Math.round(r.right) + ',w=' + Math.round(r.width) + ']');
                }
            });
            document.getElementById('out').innerText = 'TOTAL_OVERFLOWS: ' + bad.length + '\\n' + bad.slice(0, 20).join('\\n');
        } catch(e) {
            document.getElementById('out').innerText = 'ERR: ' + e.message;
        }
    }, 1500);
};
</script>
</body>
</html>
"""

with open("test_overflow.html", "w", encoding="utf-8") as f:
    f.write(html)

# Run Edge to dump DOM of test_overflow.html after loading
res = subprocess.run([EDGE, "--headless", "--disable-gpu", "--run-all-compositor-stages-before-draw", "--virtual-time-budget=4000", "--dump-dom", "http://127.0.0.1:8899/test_overflow.html"], capture_output=True, text=True, encoding="utf-8")

for line in res.stdout.splitlines():
    if "TOTAL_OVERFLOWS" in line or "[" in line and "r=" in line:
        print(line)
