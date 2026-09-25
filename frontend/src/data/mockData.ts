import { ProjectData } from '../types/project';

export const mockProject: ProjectData = {
  project_id: 'proj_campus_crew_2026',
  name: 'CampusCrew',
  status: 'COMPLETED',
  completed_stages: [
    'discovery',
    'positioning',
    'shape',
    'visual',
    'critique',
    'consistency',
    'delivery',
  ],
  input: {
    idea: 'An app that helps college students find teammates for projects, matching by work style and schedule compatibility',
    audience: 'College students, campus builders, hackathon participants',
    constraints: ['Affordable', 'Mobile-first', 'Zero-ghosting guarantee'],
    tone: 'Modern, energetic, practical and friendly',
  },
  discovery: {
    problem: 'Small startup founders struggle to turn rough product ideas into clear, differentiated brands quickly and affordably.',
    target_user: 'Early-stage startup founders and small teams preparing to launch a new product.',
    context: 'Founders often have a strong product idea but lack dedicated brand strategy resources and need to move from concept to launch quickly.',
    constraints: [
      'Small budget.',
      'Need to launch quickly.',
      'Limited branding expertise.',
    ],
    known_value: 'An AI-guided system can transform an unstructured startup idea into structured brand intelligence and launch-ready direction.',
    open_questions: [
      'What exact category should the product own?',
      'Which customer segment has the strongest immediate need?',
      'What alternatives are founders currently using?',
      'What proof points can establish trust?',
    ],
  },
  positioning: {
    category: 'Student Collaboration & Crew Formation Platform',
    differentiator: 'Work-style & schedule verification matching over vanity resume padding',
    value_proposition: 'Form high-trust, ghost-proof project crews with compatible campus builders in minutes.',
    competitive_angle: 'Execution-focused teammate matching with accountability pacts, not a passive social network or job board.',
  },
  shape: {
    personality: [
      {
        trait: 'Confident',
        reason: 'Bold stance on student capability. Decisive, clear, non-apologetic—focuses on execution over credentials.',
      },
      {
        trait: 'Energetic',
        reason: 'Propels ideas into motion. Action-oriented, fast-paced, and genuinely optimistic about student ventures.',
      },
      {
        trait: 'Practical',
        reason: 'Zero corporate jargon, real output. Pragmatic, focused on ship dates, commit history, and tangible deliverables.',
      },
      {
        trait: 'Open',
        reason: 'Welcoming to first-time builders and diverse skill sets across engineering, design, and business.',
      },
    ],
    traits_to_avoid: [
      'Corporate HR bureaucracy & stiff resume speak',
      'Overhyped vanity marketing & empty tech buzzwords',
      'Paternalistic academic lecturing or school-administered feeling',
    ],
    naming_directions: [
      {
        name: 'CampusCrew',
        concept: 'Community & Trust',
        rationale: 'Instantly familiar, collegiate yet professional, emphasizes tight-knit teamwork and shared mission.',
        available: true,
      },
      {
        name: 'SyncCampus',
        concept: 'Operational Alignment',
        rationale: 'Highlights schedule compatibility, frictionless workflow, and simultaneous velocity.',
        available: true,
      },
      {
        name: 'BuilderGuild',
        concept: 'Craft & Excellence',
        rationale: 'Positions the platform as an elite peer-to-peer craft community for ambitious makers.',
        available: false,
      },
    ],
    tagline: 'Build better together.',
    one_line_pitch: 'The verified teammate matching platform for ambitious student creators and project builders.',
    brand_voice: {
      tone: 'Direct, energetic, collegiate, no-nonsense',
      style: 'Crisp sentences, action verbs, peer-to-peer respect, zero fluff',
      principles: [
        'Speak like a builder, not a bureaucrat',
        'Celebrate small ships and steady progress',
        'Prioritize reliability over hype',
      ],
    },
    message_hierarchy: [
      {
        level: 'Primary Hero',
        message: 'Turn your idea into a team that actually ships.',
        intent: 'Inspire immediate action and solve the primary loneliness pain point.',
      },
      {
        level: 'Supporting Value',
        message: 'Match with campus teammates by work style, schedule, and verified commitment.',
        intent: 'Address the core anxiety around teammate reliability and ghosting.',
      },
      {
        level: 'Functional Proof',
        message: 'No resume fluff. Just verified hours, mutual goals, and frictionless crew formation.',
        intent: 'Provide clarity on how the mechanism works differently from LinkedIn or Discord.',
      },
    ],
  },
  visual: {
    typography: {
      headline: 'Plus Jakarta Sans',
      body: 'Plus Jakarta Sans',
      label: 'Space Grotesk',
      rationale: 'Geometric clarity with humanist warmth allows technical precision without feeling sterile or academic.',
    },
    color_mood: [
      {
        role: 'Primary Energy',
        name: 'Electric Indigo',
        hex: '#8083ff',
        desc: 'Hero actions, focus indicators, and brand vitality.',
      },
      {
        role: 'Secondary Clarity',
        name: 'Sky Blue',
        hex: '#0566d9',
        desc: 'Interactive links, navigational anchors, and information density.',
      },
      {
        role: 'Tertiary Momentum',
        name: 'Verified Mint',
        hex: '#4edea3',
        desc: 'Success states, verified badges, and positive momentum markers.',
      },
      {
        role: 'Substrate Canvas',
        name: 'Obsidian Night',
        hex: '#131317',
        desc: 'Deep ambient background for immersive focus and reduced eye strain.',
      },
    ],
    composition: 'Clean modular Bento grid with hairline borders (rgba 255,255,255,0.08), high-density metadata chips, and generous typography breathing space.',
    symbols: [
      'Interlocking Crew Nodes (collaboration network)',
      'Verified Spark Pip (authentic compatibility)',
      'Sprint Bracket (focused milestones)',
    ],
    image_style: 'High-contrast candid photography of student creators in maker spaces, hackathon venues, and late-night campus labs under natural warm lighting.',
    concepts_to_avoid: [
      'Stiff corporate handshakes in glass boardrooms',
      'Cheesy graduation cap stock photos',
      'Neon cyberpunk or cartoonish gamified badges',
    ],
  },
  critique: [
    {
      issue: 'Generic Startup Language in Tagline',
      why_it_is_a_problem: "The phrase 'Build better together' is widely used across standard SaaS tools (e.g. GitHub, Notion, Figma) and fails to state the student-specific stakes.",
      suggested_change: "Sharpen to campus-specific reality: 'Find the team that actually ships.' or 'Zero ghosting. Verified campus crews.'",
      severity: 'HIGH',
      category: 'Positioning & Copy',
    },
    {
      issue: 'Skill Verification Intimidation',
      why_it_is_a_problem: "Leading heavily with 'verification' and 'compatibility testing' can scare off first-year students or non-technical contributors who lack prior portfolios.",
      suggested_change: "Introduce an 'Apprentice / High-Curiosity' track alongside experienced builder tiers so enthusiastic beginners feel invited.",
      severity: 'MEDIUM',
      category: 'Audience Accessibility',
    },
    {
      issue: 'Overemphasis on Hackathons vs Long-term Ventures',
      why_it_is_a_problem: "If early branding centers purely on 48-hour hackathons, users will churn once the event ends rather than using CampusCrew for semester capstones or startups.",
      suggested_change: "Feature semester capstone and venture creation use cases prominently in sample project cards.",
      severity: 'LOW',
      category: 'Market Longevity',
    },
  ],
  consistency: {
    consistent: true,
    score: 96,
    conflicts: [],
    recommendations: [
      'Ensure the apprentice track copy matches the confident yet open brand tone.',
      'Refine secondary CTA from general join button to campus-specific onboarding.',
    ],
    checks: [
      {
        name: 'Name matches positioning',
        status: 'PASSED',
        detail: 'CampusCrew directly reinforces collegiate focus, collaborative teamwork, and project accountability.',
      },
      {
        name: 'Tagline matches value proposition',
        status: 'PASSED',
        detail: "'Build better together' aligns with collaborative team formation, though critique suggested a sharper hook.",
      },
      {
        name: 'Voice matches personality',
        status: 'PASSED',
        detail: 'The direct, crisp, collegiate tone perfectly reflects Confident, Energetic, and Practical traits.',
      },
      {
        name: 'Visual direction matches personality',
        status: 'PASSED',
        detail: 'Obsidian dark canvas with Electric Indigo and Mint signals modern high-performance builder culture.',
      },
      {
        name: 'Launch copy matches selected voice',
        status: 'PASSED',
        detail: 'Direct, peer-to-peer call-to-actions eliminate administrative jargon and academic fluff.',
      },
    ],
  },
  delivery: {
    brand_summary: 'CampusCrew is the complete brand system and strategic positioning for a high-trust collegiate teammate matching platform that turns isolated student ideas into launch-ready crews.',
    one_line_pitch: 'The verified teammate matching platform for ambitious student creators and project builders.',
    selected_naming_direction: 'CampusCrew',
    tagline: 'Build better together.',
    personality: ['Confident', 'Energetic', 'Practical', 'Open'],
    voice_guide: 'Direct, energetic, collegiate, and honest. We speak peer-to-peer with student builders, championing tangible execution over pedigree.',
    visual_brief: 'Obsidian Night (#131317) surface architecture with Electric Indigo (#8083ff) and Verified Mint (#4edea3) accents, structured by Plus Jakarta Sans and Space Grotesk typography.',
    landing_page_headline: 'Turn your idea into a team that actually ships.',
    launch_message: 'Stop building in isolation or gambling on uncommitted group chat partners. CampusCrew matches you with reliable teammates by work style, schedule, and verified skills.',
    social_post: 'Tired of group projects where you do 90% of the work? We built CampusCrew so college builders can match with teammates who actually care as much as you do. Live on campus today: link in bio.',
  },
};
