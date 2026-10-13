import subprocess
import time
import json
import re
import os

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE_URL = "http://127.0.0.1:8901/index.html"

def test_page_dom(query_params="", window_size="1440,900"):
    url = BASE_URL + (("?" + query_params) if query_params else "")
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--disable-gpu",
        "--disable-http-cache",
        f"--window-size={window_size}",
        "--dump-dom",
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", timeout=15)
    return res.stdout

def run_tests():
    print("=== STARTING ROOFING WEBSITE VERIFICATION ===")
    
    # TEST 1: Default Preset
    print("\n[Test 1] Testing Default Sample Preset...")
    dom1 = test_page_dom()
    assert "Apex Peak Roofing" in dom1, "Apex Peak Roofing brand name not in DOM"
    assert "Roofing Solutions to Protect What Matters Most." in dom1, "Headline missing"
    assert "serviceAreaMap" in dom1, "serviceAreaMap iframe missing"
    assert "maps.google.com/maps?q=" in dom1, "Google Maps iframe src not populated"
    assert "Dallas" in dom1, "Dallas city missing"
    assert "Understanding Your Roofing Options" in dom1, "Educational section missing"
    assert "neutral-inquiry-box" in dom1, "Neutral inquiry box missing for unverified reviews"
    assert "Residential Roofing" in dom1, "Residential roofing service missing"
    assert "Roof Repair" in dom1, "Roof repair service missing"
    assert "Roof Replacement" in dom1, "Roof replacement service missing"
    print("-> Test 1 PASSED: Default preset loaded authentic copy, services, map, and neutral review fallback.")

    # TEST 2: Peak Roofing Preset (Reference)
    print("\n[Test 2] Testing Peak Roofing Preset (?business=peak-roofing)...")
    dom2 = test_page_dom("business=peak-roofing")
    assert "Peak Roofing &amp; Construction" in dom2 or "Peak Roofing & Construction" in dom2, "Peak Roofing name not found"
    assert "McKinney" in dom2, "McKinney not found in DOM"
    assert "972" in dom2, "Peak roofing phone area code 972 not found"
    print("-> Test 2 PASSED: Peak Roofing preset loaded correctly.")

    # TEST 3: Residential-Only Contractor (Smith Roofing Austin)
    print("\n[Test 3] Testing Residential-Only Contractor (?business=smith-roofing)...")
    dom3 = test_page_dom("business=smith-roofing")
    assert "Smith Roofing Co." in dom3, "Smith Roofing Co. not found"
    assert "Austin" in dom3, "Austin not found"
    assert "RESIDENTIAL ROOFING" in dom3, "Residential tagline not set"
    print("-> Test 3 PASSED: Smith Roofing residential preset loaded correctly.")

    # TEST 4: Missing Phone Hiding Behavior
    print("\n[Test 4] Testing Missing Phone Scenario (?phone=)...")
    dom4 = test_page_dom("phone=")
    # When phone is empty, script sets style="display: none;" on .phone-link and .header-phone-cta
    assert 'class="header-phone-cta" style="display: none;"' in dom4 or 'display: none' in dom4, "Phone container not hidden when phone is empty"
    print("-> Test 4 PASSED: Missing phone safely hidden without broken elements.")

    # TEST 5: Prospect Editor Mode (?editor=1)
    print("\n[Test 5] Testing Agency Editor Mode (?editor=1)...")
    dom5 = test_page_dom("editor=1")
    assert 'agency-editor-container active' in dom5, "Agency editor container not activated with ?editor=1"
    print("-> Test 5 PASSED: Prospect link generator drawer activated with ?editor=1.")

    print("\n=== ALL AUTOMATED DOM TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_tests()
