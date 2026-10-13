# Elite Roofing Showcase & Personalized Prospect Preview Platform

A world-class, conversion-engineered website for residential and commercial roofing contractors. Built with clean HTML5, modern CSS3, and vanilla JavaScript—zero frameworks, zero build steps, and ready for instant deployment on GitHub Pages or any static CDN.

---

## 🎯 Business Mission

This platform serves as a high-converting **sales demo tool** for web design agencies pitching web development services to real American roofing contractors:
- Send prospects a personalized preview of what their actual business could look like online.
- Adapts realistically to whether the contractor focuses on **Residential**, **Commercial**, or **Both**.
- Stripped of unrealistic, fabricated claims (no fake drone inspections, fake reviews, or exaggerated warranties).
- Authentic, conversion-focused direct-response copywriting covering core, practical roofing services: **Residential Roofing**, **Roof Repair**, **Commercial Roofing**, **Gutters & Drainage**, and **Roof Inspections**.
- Real, free Google Maps interactive embed that automatically updates to any city passed in the URL (works out-of-the-box on GitHub Pages with zero API keys or billing).
- Generic/dummy service areas (`Central Metro & Downtown`, `North District`, `West Hills`, etc.) so the demo link applies seamlessly to any contractor without hardcoded municipal conflicts.
- Completely dummy default contact details (`(555) 019-2834`, `contact@roofingcompany.com`, `100 Main Street, Suite 200`).

---

## 🚀 Key Features

1. **Practical Roofing Services Catalog**:
   - Master services catalog covering:
     - `residential-roofing` (Architectural Asphalt Shingles, Flashing, Attic Ventilation)
     - `roof-repair` (Active Leak Diagnostics, Missing Shingles, Pipe Collars)
     - `commercial-roofing` (TPO, Flat Roofs, Modified Bitumen, Low-Slope)
     - `gutters-drainage` (Seamless Aluminum Gutters, Downspout Redirection)
     - `roof-inspection` (Exterior & Attic Health Assessments)
   - Filterable dynamically via URL query parameters (`services=...`) or business type (`businessType=residential|commercial|both`).

2. **Truthful & Verifiable Trust Model**:
   - **No fake reviews**: If a contractor has unverified reviews, the site automatically hides star-rating badges in the hero and displays a clean, professional consultation section with high-contrast, fully visible call buttons. If verified reviews are supplied, genuine ratings and feedback cards render cleanly.
   - **Contact detail safety**: If phone, address, or email is not provided, elements are safely hidden rather than displaying broken links.

3. **Dynamic Free Google Maps Embed**:
   - Live responsive iframe using Google's free embed format (`https://maps.google.com/maps?q=...&output=embed`).
   - One-click "Get Directions" link opening directly in Google Maps.
   - Pass any city or address in the URL (`?location=Austin` or `?location=Chicago` or `?city=Denver`) and the map automatically navigates there!

4. **100% Client Personalization Engine**:
   - Query parameter parser with preset cascading (`ROOFING_PRESETS` in `businesses.js`).
   - Monogram logo fallback when no logo URL is supplied.
   - Dynamic accent color theming (`--accent`) with automatic hover tone calculation.
   - Mobile-optimized top bar: compact typography with `white-space: nowrap` preventing phone numbers and operating hours from breaking across lines.

5. **Agency Prospect Link Generator Drawer (`?editor=1`)**:
   - Accessible only by adding `?editor=1` to the URL.
   - Live customizer for business name, business type, phone, email, city, state, address, map location, free estimates toggle, brand colors, and service areas.
   - Immediate live reactive DOM updating as you type.
   - One-click **Copy Prospect Link** with URL encoding.

---

## 📁 File Structure

```text
roofing-website/
├── index.html        # Semantic HTML5 structure with dynamic data targets & Google Maps embed
├── styles.css        # Responsive CSS with architectural design tokens & mobile drawer
├── script.js         # Vanilla JS personalization engine, catalog, modals, and generator
├── businesses.js     # Contractor presets, MASTER_SERVICES_CATALOG, FAQs, educational topics, and projects
├── README.md         # Comprehensive documentation & outreach guide
```

---

## 🔗 URL Query Parameters

| Parameter | Type | Description | Example |
|---|---|---|---|
| `business` | String | Slug of saved preset in `businesses.js` | `?business=toronto-roofing` |
| `location` | String | Google Maps targeting & location query (Canada, US, etc.) | `?location=Toronto,%20ON,%20Canada` |
| `serviceAreas` (or `areas`) | String | Delimited list of service areas (supports `,`, `;`, or `\|`) | `?serviceAreas=Downtown,North%20York,Scarborough,Etobicoke,Mississauga` |
| `city` | String | Primary operating city (auto-inferred from `location` if omitted) | `?city=Toronto` or `?city=Miami` |
| `state` (or `province`) | String | State or Canadian Province abbreviation | `?province=ON` or `?state=FL` |
| `country` | String | Country name | `?country=Canada` or `?country=USA` |
| `zip` (or `postalCode`) | String | ZIP or Canadian Postal code | `?postalCode=M5J%202J2` or `?zip=33101` |
| `name` | String | Contractor business name | `?name=Apex%20Roofing%20Co` |
| `businessType` | String | `residential`, `commercial`, or `both` | `?businessType=residential` |
| `phone` | String | Business phone number | `?phone=(416)%20555-0198` |
| `email` | String | Contact email address | `?email=quotes@apexroofing.com` |
| `address` | String | Office street address | `?address=200%20Bay%20Street,%20Suite%201400` |
| `freeEstimates` | Boolean | Whether estimates are free (`true` or `false`) | `?freeEstimates=true` |
| `services` | String | Comma-separated service IDs to enable | `?services=roof-repair,gutters-drainage` |
| `accent` | Hex | Brand accent color code | `?accent=%23C25E23` |
| `logo` | URL | Image URL for custom logo | `?logo=https://example.com/logo.png` |
| `headline` | String | Custom hero section headline | `?headline=Dependable%20Roofing%20in%20Toronto` |
| `editor` | Boolean | Activates the agency Prospect Link Generator with 1-click location presets | `?editor=1` |

---

### Example Personalized URLs:

- **Canadian Contractor Pitch (Toronto, Ontario)**:
  `https://yourdomain.com/index.html?business=toronto-roofing`
  *(Pinpoints Toronto on Google Maps with GTA neighborhoods: Downtown, North York, Scarborough, Etobicoke, Mississauga, Markham)*

- **Dynamic Canadian Location (Vancouver, BC + Custom Neighborhoods)**:
  `https://yourdomain.com/index.html?name=Pacific%20Peak%20Roofing&location=Vancouver,%20BC,%20Canada&serviceAreas=Downtown%20Vancouver,Kitsilano,Burnaby,Richmond,North%20Vancouver,Surrey&phone=(604)%20555-0144`

- **Dynamic Canadian Location (Calgary, AB — Auto-Generated Areas)**:
  `https://yourdomain.com/index.html?location=Calgary,%20AB,%20Canada&name=Bow%20River%20Roofing`
  *(When no custom areas are passed, dynamically generates: Greater Calgary Metro, Calgary Central & Downtown, Calgary North, Calgary South, Calgary Westside, Surrounding Communities)*

- **US State Pitch (Miami, Florida)**:
  `https://yourdomain.com/index.html?name=Biscayne%20Roofing&location=Miami,%20FL&serviceAreas=Downtown%20Miami,Brickell,Coral%20Gables,Miami%20Beach,Kendall,Doral&phone=(305)%20555-0182`

- **US State Pitch (Los Angeles, California)**:
  `https://yourdomain.com/index.html?name=SoCal%20Roofing%20Craftsmen&location=Los%20Angeles,%20CA&serviceAreas=Downtown%20LA,West%20Hollywood,Pasadena,Santa%20Monica,Long%20Beach,Glendale&phone=(213)%20555-0199`

- **Agency Link Generator Mode (with 1-click Canadian & US pills)**:
  `https://yourdomain.com/index.html?editor=1`

---

## 🛠 Adding Permanent Contractor Presets

To permanently add a contractor without long query strings, open [`businesses.js`](businesses.js) and add an entry to `ROOFING_PRESETS`:

```javascript
"lone-star-roofing": {
  slug: "lone-star-roofing",
  name: "Lone Star Roofing Co.",
  businessType: "both",
  freeEstimates: true,
  phone: "(817) 555-0199",
  email: "info@lonestarroofingtx.com",
  address: "100 Main Street, Suite 200",
  city: "Fort Worth",
  state: "TX",
  zip: "76102",
  serviceAreas: ["Central Metro", "North District", "West Hills", "South County", "East Valley", "Surrounding Communities"],
  mapQuery: "Fort Worth, TX",
  accent: "#C25E23",
  headline: "Fort Worth's Trusted Roofing Specialists.",
  enabledServices: [
    "residential-roofing",
    "roof-repair",
    "commercial-roofing",
    "gutters-drainage",
    "roof-inspection"
  ],
  verifiedReviews: []
}
```

---

## 📱 Responsive Design Verification

Optimized and thoroughly tested across standard device breakpoints:
- **Mobile Phones**: 320px, 375px, 390px, 430px
- **Tablets**: 768px (iPad portrait)
- **Laptops & Desktops**: 1024px, 1280px, 1440px, 1920px
