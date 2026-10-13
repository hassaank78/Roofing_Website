/**
 * ROOFING BUSINESS PRESETS & SERVICE CATALOG
 * 
 * Truthful, realistic contractor profiles matching standard American roofing businesses.
 * Reference: Practical business operations (residential, commercial, roof repairs, gutters, inspections).
 * Configurable dynamically via URL query parameters or preset selection.
 */

const ROOFING_PRESETS = {
  // 1. Default Sample Preview (Clearly identified illustrative demonstration profile)
  "default": {
    slug: "default",
    name: "Apex Peak Roofing",
    isSampleDemo: true,
    businessType: "both", // "residential", "commercial", or "both"
    freeEstimates: true,
    logo: "", // Monogram fallback "AP"
    phone: "(555) 019-2834",
    email: "contact@roofingcompany.com",
    address: "100 Main Street, Suite 200",
    city: "Dallas",
    state: "TX",
    zip: "75201",
    serviceAreas: [
      "Central Metro & Downtown",
      "North District",
      "West Hills",
      "South County",
      "East Valley",
      "Surrounding Communities"
    ],
    mapQuery: "Dallas, TX",
    website: "https://example.com/demo",
    accent: "#D97736", // Copper orange
    headline: "Roofing Solutions to Protect What Matters Most.",
    description: "From targeted roof repairs and comprehensive inspections to seamless gutters and commercial systems, Apex Peak Roofing provides dependable craftsmanship and clear communication.",
    cta: "Request a Free Estimate",
    // Supported services for this contractor (removed storm damage, roof replacement, insurance claims)
    enabledServices: [
      "residential-roofing",
      "roof-repair",
      "commercial-roofing",
      "gutters-drainage",
      "roof-inspection"
    ],
    // Only verified reviews are shown; empty array hides review counts and displays neutral consultation box
    verifiedReviews: [],
    // Verified trust highlights
    trustHighlights: [
      { title: "Clear Estimates", desc: "Understand the recommended work and next steps before making a decision." },
      { title: "Targeted Roof Repairs", desc: "Resolve active leaks, damaged flashing, and worn shingles efficiently." },
      { title: "Residential & Commercial", desc: "Experienced solutions for single-family homes, multifamily, and commercial properties." },
      { title: "Local Service", desc: "Serving our primary metropolitan area and all surrounding neighborhoods." }
    ]
  },

  // 2. Reference Preset: Peak Roofing Style
  "peak-roofing": {
    slug: "peak-roofing",
    name: "Peak Roofing & Construction",
    isSampleDemo: false,
    businessType: "both",
    freeEstimates: true,
    logo: "",
    phone: "(555) 019-2834",
    email: "contact@roofingcompany.com",
    address: "100 Main Street, Suite 200",
    city: "McKinney",
    state: "TX",
    zip: "75070",
    serviceAreas: [
      "Central Metro", "North County", "East District", "Westside", "South Area", "Surrounding Communities"
    ],
    mapQuery: "McKinney, TX",
    website: "https://example.com/peak-roofing",
    accent: "#C25E23", // Burnt sienna
    headline: "Residential & Commercial Roofing Solutions for North Texas.",
    description: "Peak Roofing & Construction provides roof repairs, thorough inspections, commercial systems, and seamless gutters across Collin and Dallas counties.",
    cta: "Request a Free Inspection",
    enabledServices: [
      "residential-roofing",
      "roof-repair",
      "commercial-roofing",
      "gutters-drainage",
      "roof-inspection"
    ],
    verifiedReviews: [],
    trustHighlights: [
      { title: "Clear Estimates", desc: "Detailed breakdown of repair options and material specifications." },
      { title: "Residential & Commercial", desc: "Serving local homeowners and commercial building owners alike." },
      { title: "Comprehensive Inspections", desc: "Assessing roof health, ventilation, and perimeter flashing." },
      { title: "Local Community Focus", desc: "Dedicated crews serving our primary operating area and neighboring towns." }
    ]
  },

  // 3. Residential-Only Contractor (Smith Roofing - Austin, TX)
  "smith-roofing": {
    slug: "smith-roofing",
    name: "Smith Roofing Co.",
    isSampleDemo: false,
    businessType: "residential",
    freeEstimates: true,
    logo: "",
    phone: "(555) 019-2834",
    email: "contact@roofingcompany.com",
    address: "100 Main Street, Suite 200",
    city: "Austin",
    state: "TX",
    zip: "78704",
    serviceAreas: [
      "Central Metro", "North County", "West Hills", "South District", "East Valley", "Surrounding Communities"
    ],
    mapQuery: "Austin, TX",
    website: "https://example.com/smith-roofing",
    accent: "#CA5C24",
    headline: "Dependable Residential Roofing in Austin.",
    description: "Specializing in residential roof repairs, preventative maintenance, inspections, and gutter solutions with straightforward advice and transparent pricing.",
    cta: "Request a Free Estimate",
    enabledServices: [
      "residential-roofing",
      "roof-repair",
      "gutters-drainage",
      "roof-inspection"
    ],
    verifiedReviews: [],
    trustHighlights: [
      { title: "Clear Estimates", desc: "Know the full scope before any work begins." },
      { title: "Residential Focus", desc: "Dedicated specifically to single-family homes and residential properties." },
      { title: "Targeted Roof Repairs", desc: "Practical solutions for leaks, worn flashing, and cracked pipe collars." },
      { title: "Local Area Service", desc: "Serving our primary metropolitan area and all surrounding neighborhoods." }
    ]
  },

  // 4. Summit Ridge Roofing (Denver, CO)
  "summit-ridge": {
    slug: "summit-ridge",
    name: "Summit Ridge Roofing & Exteriors",
    isSampleDemo: false,
    businessType: "both",
    freeEstimates: true,
    logo: "",
    phone: "(555) 019-2834",
    email: "contact@roofingcompany.com",
    address: "100 Main Street, Suite 200",
    city: "Denver",
    state: "CO",
    zip: "80202",
    serviceAreas: [
      "Central Metro", "North Hills", "South County", "West District", "East Valley", "Surrounding Communities"
    ],
    mapQuery: "Denver, CO",
    website: "https://example.com/summit-ridge",
    accent: "#D46B2C",
    headline: "Roofing Solutions Engineered for Colorado Weather.",
    description: "Helping homeowners and commercial property managers address roof leaks, preventative maintenance, and seamless gutter installations.",
    cta: "Schedule an Estimate",
    enabledServices: [
      "residential-roofing",
      "roof-repair",
      "commercial-roofing",
      "gutters-drainage",
      "roof-inspection"
    ],
    verifiedReviews: [],
    trustHighlights: [
      { title: "Clear Estimates", desc: "Honest evaluation of age-related roof wear and ventilation." },
      { title: "Targeted Repairs", desc: "Practical solutions for leaks, flashing issues, and shingle damage." },
      { title: "Residential & Commercial", desc: "Experience across asphalt shingles, flat roofs, and metal systems." },
      { title: "Regional Coverage", desc: "Serving our primary service area and all neighboring communities." }
    ]
  },

  // 5. Vanguard Roofing Craftsmen (Columbus, OH)
  "vanguard-roofing": {
    slug: "vanguard-roofing",
    name: "Vanguard Roofing Craftsmen",
    isSampleDemo: false,
    businessType: "residential",
    freeEstimates: false,
    logo: "",
    phone: "(555) 019-2834",
    email: "contact@roofingcompany.com",
    address: "100 Main Street, Suite 200",
    city: "Columbus",
    state: "OH",
    zip: "43215",
    serviceAreas: [
      "Central Metro", "North County", "East Hills", "West District", "South County", "Surrounding Communities"
    ],
    mapQuery: "Columbus, OH",
    website: "https://example.com/vanguard",
    accent: "#D96528",
    headline: "Straightforward Roofing Services for Central Ohio.",
    description: "Vanguard Roofing Craftsmen helps property owners address roof leaks, pipe boot failures, and gutter maintenance with clear scopes of work.",
    cta: "Request an Estimate",
    enabledServices: [
      "residential-roofing",
      "roof-repair",
      "gutters-drainage",
      "roof-inspection"
    ],
    verifiedReviews: [],
    trustHighlights: [
      { title: "Detailed Estimates", desc: "Clear recommendations tailored to your property's condition." },
      { title: "Residential Roofing", desc: "Focused on quality residential repairs and preventative maintenance." },
      { title: "Clear Communication", desc: "Know what work is proposed before deciding how to proceed." },
      { title: "Community Service", desc: "Serving our primary metropolitan area and all surrounding neighborhoods." }
    ]
  },

  // 6. Canadian Contractor Preset: Toronto Roofing (Ontario, Canada)
  "toronto-roofing": {
    slug: "toronto-roofing",
    name: "Apex Toronto Roofing",
    isSampleDemo: true,
    businessType: "both",
    freeEstimates: true,
    logo: "",
    phone: "(416) 555-0198",
    email: "contact@torontoroofingdemo.ca",
    address: "200 Bay Street, Suite 1400",
    city: "Toronto",
    state: "ON",
    country: "Canada",
    zip: "M5J 2J2",
    serviceAreas: [
      "Downtown Toronto",
      "North York",
      "Scarborough",
      "Etobicoke",
      "Mississauga",
      "Markham & Vaughan"
    ],
    mapQuery: "Toronto, ON, Canada",
    website: "https://example.com/toronto-demo",
    accent: "#D97736",
    headline: "Trusted Roofing Craftsmanship Across Greater Toronto.",
    description: "From targeted leak repairs and comprehensive roof inspections to seamless gutters and flat commercial systems, Apex Toronto Roofing delivers dependable craftsmanship and transparent estimates.",
    cta: "Request a Free Estimate",
    enabledServices: [
      "residential-roofing",
      "roof-repair",
      "commercial-roofing",
      "gutters-drainage",
      "roof-inspection"
    ],
    verifiedReviews: [],
    trustHighlights: [
      { title: "Clear Itemized Estimates", desc: "Detailed repair and material specifications tailored to Ontario weather." },
      { title: "Residential & Commercial", desc: "Expert solutions for homes, multifamily, and commercial properties across the GTA." },
      { title: "Targeted Leak Repairs", desc: "Fast diagnosis and repair of damaged shingles, flashing, and ice-dam wear." },
      { title: "Greater Toronto Coverage", desc: "Serving Toronto, Mississauga, North York, and surrounding municipalities." }
    ]
  }
};

/**
 * MASTER CATALOG OF REAL ROOFING SERVICES
 * Cleaned to 5 practical, authentic services:
 * 1. Residential Roofing
 * 2. Roof Repair
 * 3. Commercial Roofing
 * 4. Gutters & Drainage
 * 5. Roof Inspections
 */
const MASTER_SERVICES_CATALOG = {
  "residential-roofing": {
    id: "residential-roofing",
    title: "Residential Roofing",
    shortDesc: "Protect your home with roofing solutions tailored to your property's structure, materials, and long-term needs. Explore maintenance and repair options with guidance from experienced roofing professionals.",
    fullDesc: "Your roof is the first line of defense for your family and belongings. We evaluate your existing roof system, discuss suitable material options, and provide recommendations based on the age and condition of the structure.",
    features: [
      "Architectural asphalt shingles",
      "Underlayment & ventilation checks",
      "Chimney & valley flashing evaluation",
      "Transparent material recommendations"
    ],
    ctaText: "Explore Residential Roofing",
    image: "assets/images/optimized/Residential_Roofing_Service.webp",
    forTypes: ["residential", "both"]
  },

  "roof-repair": {
    id: "roof-repair",
    title: "Roof Repair",
    shortDesc: "Missing shingles, damaged flashing, and roof leaks can allow water to enter your home. Get the problem diagnosed and understand the repair options available for your roof.",
    fullDesc: "We locate active water entry points, assess damaged pipe collars, repair missing shingles, and resolve flashing issues to restore your roof's weather protection without unnecessary sales pressure.",
    features: [
      "Active leak diagnostics",
      "Damaged or wind-torn shingles",
      "Pipe boot & collar replacement",
      "Flashing repairs around chimneys & skylights"
    ],
    ctaText: "Request a Roof Repair Estimate",
    image: "assets/images/optimized/Roof_Repair_Service.webp",
    forTypes: ["residential", "commercial", "both"]
  },

  "commercial-roofing": {
    id: "commercial-roofing",
    title: "Commercial Roofing",
    shortDesc: "Roofing issues can affect the protection and operation of a commercial facility. Explore repair, maintenance, and inspection options suited to the building and its roofing system.",
    fullDesc: "We provide roofing services for commercial offices, retail buildings, warehouses, and multifamily properties, working with single-ply TPO, modified bitumen, and low-slope systems.",
    features: [
      "Single-ply TPO & flat roof assessments",
      "Commercial roof repairs & leak locating",
      "Parapet wall & flashing maintenance",
      "Scheduled commercial roof reviews"
    ],
    ctaText: "Discuss Commercial Roofing",
    image: "assets/images/optimized/Commercial_Roofing_Service.webp",
    forTypes: ["commercial", "both"]
  },

  "gutters-drainage": {
    id: "gutters-drainage",
    title: "Gutters & Drainage",
    shortDesc: "A properly functioning gutter system directs rainwater safely away from the roofline and foundation. Explore gutter repair, replacement, and drainage options.",
    fullDesc: "Damaged or clogged gutters can cause water to overflow into fascia boards and pool around foundations. We inspect, repair, and install seamless aluminum gutters designed to handle heavy rainfall.",
    features: [
      "Seamless aluminum gutter systems",
      "Downspout placement & redirection",
      "Fascia board inspection & repair",
      "Gutter guard protection options"
    ],
    ctaText: "Request a Gutter Estimate",
    image: "assets/images/optimized/Gutter_Drainage_Service.webp",
    forTypes: ["residential", "commercial", "both"]
  },

  "roof-inspection": {
    id: "roof-inspection",
    title: "Roof Inspections",
    shortDesc: "Understand the true condition of your roof before buying a property, following severe weather, or as part of routine property maintenance.",
    fullDesc: "We evaluate shingle condition, penetrations, attic moisture, and perimeter flashings to provide property owners with an honest, pressure-free assessment of remaining roof life.",
    features: [
      "Comprehensive exterior roof review",
      "Inspection of pipe collars and flashing",
      "Attic ventilation assessment",
      "Objective, pressure-free summary"
    ],
    ctaText: "Schedule an Inspection",
    image: "assets/images/optimized/Roof_Inspection.webp",
    forTypes: ["residential", "commercial", "both"]
  }
};

/**
 * REALISTIC EDUCATIONAL TOPICS
 */
const EDUCATIONAL_TOPICS = [
  {
    title: "Understanding Roof Wear",
    desc: "Curling shingles, missing granules, or cracked pipe collars can leave decking exposed. Recognizing early wear helps prevent water intrusion."
  },
  {
    title: "Choosing Roofing Materials",
    desc: "Different materials offer distinct appearances, maintenance needs, lifespans, and costs. Explore options suitable for your property and climate."
  },
  {
    title: "Weather & Attic Ventilation",
    desc: "Proper airflow through soffit and ridge vents regulates attic temperature and moisture, helping preserve roofing materials over time."
  },
  {
    title: "Planning Your Roofing Project",
    desc: "Understanding the scope of work, material options, and itemized estimates helps you make a confident, well-informed decision."
  }
];

/**
 * REALISTIC 4-STEP REASSURING PROCESS
 */
const PROCESS_STEPS = [
  {
    num: "01",
    title: "Tell Us About Your Roof",
    desc: "Contact our team and describe the issue, whether you are dealing with a leak, aging shingles, or scheduled maintenance."
  },
  {
    num: "02",
    title: "Discuss the Next Steps",
    desc: "We will help determine whether a site inspection or specific repair assessment is appropriate for your property."
  },
  {
    num: "03",
    title: "Review the Estimate",
    desc: "Receive a clear, itemized breakdown of recommended work and material options before deciding how to proceed."
  },
  {
    num: "04",
    title: "Professional Work & Walkthrough",
    desc: "Our experienced crew completes the job safely, cleans up all debris with magnetic sweeps, and reviews the finished work."
  }
];

/**
 * REALISTIC FAQ CATALOG
 */
const DEFAULT_FAQS = [
  {
    q: "How do I know whether my roof needs a repair?",
    a: "Common indicators include dark water stains on ceilings or upstairs walls, damp attic insulation, missing or damaged shingles, and worn flashing around chimneys and pipe boots. A professional inspection helps locate the source of moisture and outlines the appropriate repair scope."
  },
  {
    q: "What causes roof leaks around chimneys and pipe boots?",
    a: "Roof penetrations such as plumbing vents, skylights, and chimneys require specialized metal flashing and neoprene seals. Over time, UV exposure and seasonal temperature shifts cause rubber collars to crack and sealants to degrade, allowing water to enter during heavy downpours."
  },
  {
    q: "How much does a typical roof repair cost?",
    a: "Repair costs depend on the location and severity of the damage, accessibility, pitch of the roof, and the materials needed (such as replacing flashing, replacing rotted decking, or installing new pipe boots). We provide clear, itemized estimates so you know the exact scope before work starts."
  },
  {
    q: "How long does a typical roof repair or inspection take?",
    a: "Most standard roof inspections take between 30 to 60 minutes. Targeted leak repairs or flashing replacements can often be completed within half a day, depending on weather conditions and the availability of color-matched materials."
  },
  {
    q: "Do you provide commercial roofing services?",
    a: "Yes. In addition to residential homes, we service commercial offices, retail facilities, and multifamily properties with flat and low-slope roofing systems including TPO and modified bitumen."
  },
  {
    q: "Do you serve my neighborhood?",
    a: "We work with property owners across our primary metropolitan area and all surrounding communities. Contact us directly or check our service areas section to confirm coverage for your address."
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes, estimates for roofing repairs and gutter projects are provided with clear recommendations and zero high-pressure sales tactics."
  }
];

/**
 * REPRESENTATIVE WORK PORTFOLIO
 */
const DEFAULT_PROJECTS = [
  {
    id: "project-1",
    title: "Architectural Asphalt Shingle Installation",
    category: "residential",
    categoryLabel: "Residential Roofing",
    location: "Residential Neighborhood",
    system: "Dimensional Asphalt Shingles",
    material: "Architectural Shingles",
    desc: "High-definition architectural shingles installed with synthetic underlayment, ice barrier, and continuous ridge ventilation.",
    image: "assets/images/optimized/Architectural Asphalt Shingle Installation.webp",
    badge: "Representative Work"
  },
  {
    id: "project-2",
    title: "Targeted Leak Repair & Flashing Tune-Up",
    category: "repair",
    categoryLabel: "Roof Repair",
    location: "Suburban Community",
    system: "Precision Leak Diagnostics",
    material: "Step Flashing & Pipe Boot Collars",
    desc: "Diagnosed active leak around valley and chimney counter-flashing. Installed new neoprene collars and sealed transitions.",
    image: "assets/images/optimized/Targeted Leak Repair & Flashing Tune-Up.webp",
    badge: "Targeted Repair"
  },
  {
    id: "project-3",
    title: "Concealed Fastener Metal Roof Installation",
    category: "metal",
    categoryLabel: "Metal Roofing",
    location: "Custom Home",
    system: "Standing Seam Metal",
    material: "24-Gauge Steel",
    desc: "Durable standing seam residential metal roof installation featuring concealed fasteners and engineered weather resistance.",
    image: "assets/images/optimized/Concealed Fastener Metal Roof Installation.webp",
    badge: "Architectural Metal"
  },
  {
    id: "project-4",
    title: "Low-Slope Commercial Membrane System",
    category: "commercial",
    categoryLabel: "Commercial Roofing",
    location: "Commercial Office Building",
    system: "Single-Ply Membrane System",
    material: "Commercial TPO / Membrane",
    desc: "Commercial building roof repair and perimeter drainage remediation to prevent ponding water and protect interior operations.",
    image: "assets/images/optimized/Low-Slope Commercial Membrane System.webp",
    badge: "Commercial System"
  }
];

// Expose globally
if (typeof window !== "undefined") {
  window.ROOFING_PRESETS = ROOFING_PRESETS;
  window.MASTER_SERVICES_CATALOG = MASTER_SERVICES_CATALOG;
  window.EDUCATIONAL_TOPICS = EDUCATIONAL_TOPICS;
  window.PROCESS_STEPS = PROCESS_STEPS;
  window.DEFAULT_FAQS = DEFAULT_FAQS;
  window.DEFAULT_PROJECTS = DEFAULT_PROJECTS;
}
