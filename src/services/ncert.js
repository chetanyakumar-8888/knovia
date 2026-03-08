// NCERT PDF URL structure
const NCERT_BASE_URL = "https://ncert.nic.in/textbook/pdf";

// All NCERT chapters mapped by class and subject
export const NCERT_CHAPTERS = {
  "11": {
    "Physics": [
      "Physical World",
      "Units and Measurements", 
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids",
      "Mechanical Properties of Fluids",
      "Thermal Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves"
    ],
    "Chemistry": [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements and Periodicity",
      "Chemical Bonding and Molecular Structure",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry Basic Principles",
      "Hydrocarbons",
      "Environmental Chemistry"
    ],
    "Mathematics": [
      "Sets",
      "Relations and Functions",
      "Trigonometric Functions",
      "Complex Numbers",
      "Linear Inequalities",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequences and Series",
      "Straight Lines",
      "Conic Sections",
      "Introduction to 3D Geometry",
      "Limits and Derivatives",
      "Statistics",
      "Probability"
    ],
    "Biology": [
      "The Living World",
      "Biological Classification",
      "Plant Kingdom",
      "Animal Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Structural Organisation in Animals",
      "Cell The Unit of Life",
      "Biomolecules",
      "Cell Cycle and Cell Division",
      "Transport in Plants",
      "Mineral Nutrition",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development",
      "Digestion and Absorption",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration"
    ]
  },
  "12": {
    "Physics": [
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Magnetism and Matter",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms",
      "Nuclei",
      "Semiconductor Electronics"
    ],
    "Chemistry": [
      "The Solid State",
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "Surface Chemistry",
      "General Principles of Isolation of Elements",
      "The p-Block Elements",
      "The d and f Block Elements",
      "Coordination Compounds",
      "Haloalkanes and Haloarenes",
      "Alcohols Phenols and Ethers",
      "Aldehydes Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules"
    ],
    "Mathematics": [
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives",
      "Integrals",
      "Application of Integrals",
      "Differential Equations",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Linear Programming",
      "Probability"
    ],
    "Biology": [
      "Reproduction in Organisms",
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Reproductive Health",
      "Principles of Inheritance and Variation",
      "Molecular Basis of Inheritance",
      "Evolution",
      "Human Health and Disease",
      "Strategies for Enhancement in Food Production",
      "Microbes in Human Welfare",
      "Biotechnology Principles and Processes",
      "Biotechnology and its Applications",
      "Organisms and Populations",
      "Ecosystem",
      "Biodiversity and Conservation"
    ]
  }
};

// Get chapters for a class and subject
export function getChapters(className, subject) {
  return NCERT_CHAPTERS[className]?.[subject] || [];
}

// Get subjects for a class
export function getSubjects(className) {
  return Object.keys(NCERT_CHAPTERS[className] || {});
}

// Fetch NCERT chapter content
export async function fetchNCERTContent(className, subject, chapterIndex) {
  try {
    // Since direct PDF fetch has CORS issues
    // We use chapter text as context for AI
    const chapterName = NCERT_CHAPTERS[className][subject][chapterIndex];
    
    // Return chapter info for AI to use its knowledge
    return {
      success: true,
      chapterName,
      content: `Class ${className} ${subject} - ${chapterName}. 
      This is a CBSE NCERT chapter. Generate comprehensive 
      study material based on the official NCERT curriculum.`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}