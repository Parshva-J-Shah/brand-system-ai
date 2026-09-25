export type WorkflowStatus =
  | 'DRAFT'
  | 'DISCOVERING'
  | 'POSITIONING'
  | 'SHAPING'
  | 'VISUALIZING'
  | 'CHALLENGING'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'ERROR';

export type StageKey =
  | 'discovery'
  | 'positioning'
  | 'shape'
  | 'visual'
  | 'critique'
  | 'consistency'
  | 'delivery';

export interface ProjectInput {
  idea: string;
  audience?: string;
  constraints?: string[];
  tone?: string;
}

export interface DiscoveryData {
  problem: string;
  target_user: string;
  context: string;
  constraints: string[];
  known_value: string;
  open_questions: string[];
}

export interface PositioningData {
  category: string;
  differentiator: string;
  value_proposition: string;
  competitive_angle: string;
}

export interface PersonalityTrait {
  trait: string;
  reason: string;
}

export interface NamingDirection {
  name: string;
  concept: string;
  rationale: string;
  available?: boolean;
}

export interface BrandShapeData {
  personality: PersonalityTrait[];
  traits_to_avoid: string[];
  naming_directions: NamingDirection[];
  tagline: string;
  one_line_pitch: string;
  brand_voice: {
    tone: string;
    style: string;
    principles: string[];
  };
  message_hierarchy: Array<{
    level: string;
    message: string;
    intent: string;
  }>;
}

export interface ColorSwatch {
  role: string;
  name: string;
  hex: string;
  desc: string;
}

export interface VisualDirectionData {
  typography: {
    headline: string;
    body: string;
    label: string;
    rationale: string;
  };
  color_mood: ColorSwatch[];
  composition: string;
  symbols: string[];
  image_style: string;
  concepts_to_avoid: string[];
}

export interface CritiqueItem {
  issue: string;
  why_it_is_a_problem: string;
  suggested_change: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  category?: string;
}

export interface ConsistencyCheckItem {
  name: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  detail: string;
}

export interface ConsistencyData {
  consistent: boolean;
  score?: number;
  conflicts: Array<{
    area: string;
    conflict: string;
    fix: string;
  }>;
  recommendations: string[];
  checks?: ConsistencyCheckItem[];
}

export interface DeliveryData {
  brand_summary: string;
  one_line_pitch: string;
  selected_naming_direction: string;
  tagline: string;
  personality: string[];
  voice_guide: string;
  visual_brief: string;
  landing_page_headline: string;
  launch_message: string;
  social_post: string;
}

export interface ProjectData {
  project_id: string;
  name?: string;
  status: WorkflowStatus;
  completed_stages?: StageKey[];
  input: ProjectInput;
  discovery?: DiscoveryData;
  positioning?: PositioningData;
  shape?: BrandShapeData;
  visual?: VisualDirectionData;
  critique?: CritiqueItem[];
  consistency?: ConsistencyData;
  delivery?: DeliveryData;
  created_at?: string;
  updated_at?: string;
}

export interface ApiStatusResponse {
  status: WorkflowStatus;
  completed_stages: StageKey[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    stage?: string;
  };
}
