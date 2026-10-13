import subprocess
import time
import os
import re
import sys

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE_URL = "http://127.0.0.1:8899/index.html"
SCREENSHOT_DIR = r"C:\Users\Hassan\.gemini\antigravity\scratch\roofing-website\test_screenshots"

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def run_edge_dump(url):
    cmd = [EDGE_PATH, "--headless", "--disable-gpu", "--dump-dom", url]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace")
    return result.stdout

def run_edge_screenshot(url, output_path, window_size="1280,800"):
    cmd = [
        EDGE_PATH, 
        "--headless", 
        "--disable-gpu", 
        f"--window-size={window_size}", 
        f"--screenshot={output_path}", 
        url
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace")
    return os.path.exists(output_path)

def test_all():
    print("==================================================")
    print("STARTING COMPREHENSIVE 12-POINT ACCEPTANCE TEST SUITE")
    print("==================================================")
    results = {}

    # 1. Default Roofing Demo
    print("\n[TEST 1] Testing Default Roofing Demo...")
    dom = run_edge_dump(BASE_URL)
    has_title = "Apex Ridge Roofing Co." in dom
    has_dallas = "Dallas" in dom
    has_cta = "Get My Free Estimate" in dom or "Get Free Estimate" in dom
    test1_pass = has_title and has_dallas and has_cta
    results["Test 1: Default Roofing Demo"] = test1_pass
    print(f"Result: {'PASS' if test1_pass else 'FAIL'} (Title found: {has_title}, City found: {has_dallas})")

    # 2. Saved Business Preset (smith-roofing)
    print("\n[TEST 2] Testing Saved Business Preset (?business=smith-roofing)...")
    url_preset = f"{BASE_URL}?business=smith-roofing"
    dom_preset = run_edge_dump(url_preset)
    has_smith = "Smith Roofing Co." in dom_preset
    has_austin = "Austin" in dom_preset
    has_phone = "(512) 555-0123" in dom_preset
    has_accent = "--accent: #c25e23" in dom_preset.lower() or "--accent: #C25E23" in dom_preset or "#C25E23" in dom_preset or "#c25e23" in dom_preset
    test2_pass = has_smith and has_austin and has_phone
    results["Test 2: Saved Business Preset (smith-roofing)"] = test2_pass
    print(f"Result: {'PASS' if test2_pass else 'FAIL'} (Smith: {has_smith}, Austin: {has_austin}, Phone: {has_phone})")

    # 3. Personalized URL with Name, Phone, and City
    print("\n[TEST 3] Testing Personalized Query Overrides (Lone Star Roofing)...")
    url_custom = f"{BASE_URL}?name=Lone%20Star%20Roofing&city=Fort%20Worth&state=TX&phone=(817)%20555-9821"
    dom_custom = run_edge_dump(url_custom)
    has_lonestar = "Lone Star Roofing" in dom_custom
    has_ftworth = "Fort Worth" in dom_custom
    has_ftphone = "(817) 555-9821" in dom_custom
    test3_pass = has_lonestar and has_ftworth and has_ftphone
    results["Test 3: Personalized Query Overrides"] = test3_pass
    print(f"Result: {'PASS' if test3_pass else 'FAIL'} (Name: {has_lonestar}, City: {has_ftworth}, Phone: {has_ftphone})")

    # 4. Custom Logo URL
    print("\n[TEST 4] Testing Custom Logo URL...")
    url_logo = f"{BASE_URL}?logo=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1600585154340-be6161a56a0c"
    dom_logo = run_edge_dump(url_logo)
    has_logo_in_dom = "images.unsplash.com" in dom_logo
    results["Test 4: Custom Logo URL Injection"] = has_logo_in_dom
    print(f"Result: {'PASS' if has_logo_in_dom else 'FAIL'}")

    # 5. Missing or Invalid Logo Graceful Monogram Fallback
    print("\n[TEST 5] Testing Monogram Fallback (No Logo Supplied)...")
    dom_nologo = run_edge_dump(f"{BASE_URL}?business=summit-ridge")
    has_monogram = "SR" in dom_nologo or "brand-monogram" in dom_nologo
    no_broken_empty = 'src=""' not in dom_nologo or 'style="display: none;"' in dom_nologo or 'display: none' in dom_nologo
    test5_pass = has_monogram and no_broken_empty
    results["Test 5: Logo Fallback to Architectural Monogram"] = test5_pass
    print(f"Result: {'PASS' if test5_pass else 'FAIL'} (Monogram: {has_monogram})")

    # 6. Custom Brand Accent Color
    print("\n[TEST 6] Testing Custom Brand Accent Color (?accent=%232563EB)...")
    url_color = f"{BASE_URL}?accent=%232563EB"
    dom_color = run_edge_dump(url_color)
    has_blue_accent = "#2563eb" in dom_color.lower()
    results["Test 6: Custom Brand Accent Color"] = has_blue_accent
    print(f"Result: {'PASS' if has_blue_accent else 'FAIL'} (Found #2563EB in style: {has_blue_accent})")

    # 7. Missing Optional Information Graceful Handling
    print("\n[TEST 7] Testing Missing Optional Fields (No undefined or empty labels)...")
    url_partial = f"{BASE_URL}?name=Minimal%20Roofing"
    dom_partial = run_edge_dump(url_partial)
    no_undefined = "undefined" not in dom_partial and "null" not in dom_partial
    has_name = "Minimal Roofing" in dom_partial
    test7_pass = no_undefined and has_name
    results["Test 7: Missing Optional Info Graceful Degradation"] = test7_pass
    print(f"Result: {'PASS' if test7_pass else 'FAIL'} (No undefined: {no_undefined}, Name present: {has_name})")

    # 8. Mobile Navigation Drawer
    print("\n[TEST 8] Testing Mobile Navigation Drawer Structure...")
    has_drawer = "mobile-drawer" in dom
    has_toggle = "mobileNavToggle" in dom
    has_drawer_links = "drawer-link" in dom
    test8_pass = has_drawer and has_toggle and has_drawer_links
    results["Test 8: Mobile Navigation Drawer"] = test8_pass
    print(f"Result: {'PASS' if test8_pass else 'FAIL'}")

    # 9. Telephone Links & Click-to-Call
    print("\n[TEST 9] Testing Telephone Links Sanitation...")
    url_tel = f"{BASE_URL}?phone=(512)%20555-0199"
    dom_tel = run_edge_dump(url_tel)
    has_tel_href = 'href="tel:5125550199"' in dom_tel or 'href="tel:+15125550199"' in dom_tel or 'href="tel:5125550199' in dom_tel
    results["Test 9: Click-to-Call Telephone Sanitization"] = has_tel_href
    print(f"Result: {'PASS' if has_tel_href else 'FAIL'} (tel: link found: {has_tel_href})")

    # 10. Estimate Form Validation
    print("\n[TEST 10] Testing Estimate Form Attributes & Validation Hooks...")
    has_inline_form = "inlineEstimateForm" in dom
    has_modal_form = "modalEstimateForm" in dom
    has_req = 'required' in dom
    has_novalidate = 'novalidate' in dom
    test10_pass = has_inline_form and has_modal_form and has_req and has_novalidate
    results["Test 10: Estimate Form Validation Setup"] = test10_pass
    print(f"Result: {'PASS' if test10_pass else 'FAIL'}")

    # 11. Prospect Link Generator (?editor=1)
    print("\n[TEST 11] Testing Agency Prospect Link Generator (?editor=1)...")
    dom_editor = run_edge_dump(f"{BASE_URL}?editor=1")
    has_editor_active = "agency-editor-container" in dom_editor and "active" in dom_editor
    has_copy_btn = "edCopyLinkBtn" in dom_editor
    has_preset_select = "edPresetSelect" in dom_editor
    test11_pass = has_editor_active and has_copy_btn and has_preset_select
    results["Test 11: Prospect Link Generator (?editor=1)"] = test11_pass
    print(f"Result: {'PASS' if test11_pass else 'FAIL'} (Editor Active: {has_editor_active})")

    # 12. Desktop, Tablet, and Mobile Screenshots
    print("\n[TEST 12] Capturing Visual Screenshots at Responsive Viewports...")
    ss_desktop = os.path.join(SCREENSHOT_DIR, "desktop_1440.png")
    ss_laptop = os.path.join(SCREENSHOT_DIR, "laptop_1024.png")
    ss_tablet = os.path.join(SCREENSHOT_DIR, "tablet_768.png")
    ss_mobile = os.path.join(SCREENSHOT_DIR, "mobile_375.png")
    ss_editor = os.path.join(SCREENSHOT_DIR, "editor_mode.png")

    ok1 = run_edge_screenshot(BASE_URL, ss_desktop, "1440,900")
    ok2 = run_edge_screenshot(f"{BASE_URL}?business=smith-roofing", ss_laptop, "1024,768")
    ok3 = run_edge_screenshot(BASE_URL, ss_tablet, "768,1024")
    ok4 = run_edge_screenshot(BASE_URL, ss_mobile, "375,812")
    ok5 = run_edge_screenshot(f"{BASE_URL}?editor=1", ss_editor, "1440,900")

    test12_pass = ok1 and ok2 and ok3 and ok4 and ok5
    results["Test 12: Responsive Screenshots (Mobile, Tablet, Desktop)"] = test12_pass
    print(f"Result: {'PASS' if test12_pass else 'FAIL'} (Captured {sum([ok1, ok2, ok3, ok4, ok5])}/5 screenshots)")

    print("\n==================================================")
    print("TEST SUITE SUMMARY:")
    print("==================================================")
    all_passed = True
    for test_name, status in results.items():
        status_str = "PASS" if status else "FAIL"
        print(f" - {test_name}: {status_str}")
        if not status:
            all_passed = False

    print("==================================================")
    if all_passed:
        print("ALL 12 ACCEPTANCE TESTS PASSED SUCCESSFULLY!")
    else:
        print("SOME TESTS FAILED - REVIEW LOGS.")
    print("==================================================")

if __name__ == "__main__":
    test_all()
