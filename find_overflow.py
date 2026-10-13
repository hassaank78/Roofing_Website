import subprocess
import json

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
URL = "http://127.0.0.1:8899/index.html"

# Run a headless Edge script that inspects overflow elements
js_code = """
let docWidth = document.documentElement.offsetWidth;
let overflows = [];
document.querySelectorAll('*').forEach(el => {
    let rect = el.getBoundingClientRect();
    if (rect.right > 375) {
        overflows.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            right: rect.right,
            width: rect.width
        });
    }
});
console.log('DOC_WIDTH:', docWidth);
console.log('OVERFLOWS:', JSON.stringify(overflows.slice(0, 15)));
"""

test_html = f"""
<!DOCTYPE html>
<html>
<body>
<iframe id="testFrame" src="{URL}" width="375" height="812"></iframe>
<script>
window.onload = function() {{
    setTimeout(function() {{
        let iframeDoc = document.getElementById('testFrame').contentDocument;
        let iframeWin = document.getElementById('testFrame').contentWindow;
        let overflows = [];
        iframeDoc.querySelectorAll('*').forEach(el => {{
            let rect = el.getBoundingClientRect();
            if (rect.right > 375.5) {{
                overflows.push({{
                    tag: el.tagName,
                    id: el.id,
                    className: el.className,
                    right: rect.right,
                    width: rect.width
                }});
            }}
        }});
        console.log('IFRAME_OVERFLOWS_COUNT:', overflows.length);
        console.log('IFRAME_OVERFLOWS:', JSON.stringify(overflows.slice(0, 10)));
    }}, 1000);
}};
</script>
</body>
</html>
"""

with open("overflow_check.html", "w", encoding="utf-8") as f:
    f.write(test_html)

cmd = [EDGE_PATH, "--headless", "--disable-gpu", "--dump-dom", "http://127.0.0.1:8899/overflow_check.html"]
res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
print(res.stdout[:500])
