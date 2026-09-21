// Data definitions, states, branches, college datasets, and questions
const INDIAN_STATES = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra",
  "Kerala", "Uttar Pradesh", "Gujarat", "Delhi", "Rajasthan",
  "Madhya Pradesh", "West Bengal", "Bihar", "Odisha", "Punjab",
  "Haryana", "Assam", "Jharkhand", "Chhattisgarh", "Uttarakhand",
  "Himachal Pradesh", "Goa", "Jammu and Kashmir", "Puducherry", "Other"
];

const AP_DISTRICTS = [
  "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla",
  "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur",
  "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR (Vijayawada)",
  "Palnadu", "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore",
  "Sri Sathya Sai", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa",
  "Other District"
];

const POPULAR_COLLEGES = [
  "Andhra University College of Engineering (AUCE), Visakhapatnam",
  "JNTU College of Engineering, Kakinada (JNTUK)",
  "JNTU College of Engineering, Anantapur (JNTUA)",
  "KL University (KLU), Vaddeswaram, Guntur",
  "Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Guntur",
  "R.V.R. & J.C. College of Engineering, Guntur",
  "Gayatri Vidya Parishad College of Engineering (GVPCE), Visakhapatnam",
  "Vellore Institute of Technology (VIT-AP), Amaravati",
  "SRM University-AP, Amaravati",
  "Vasireddy Venkatadri Institute of Technology (VVIT), Guntur",
  "G. Pulla Reddy Engineering College (GPREC), Kurnool",
  "Sri Venkateswara University College of Engineering (SVUCE), Tirupati",
  "Sagi Rama Krishnam Raju Engineering College (SRKR), Bhimavaram",
  "Vishnu Institute of Technology (VITB), Bhimavaram",
  "GMR Institute of Technology (GMRIT), Rajam",
  "Aditya Engineering College, Surampalem",
  "Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT), Vijayawada",
  "Velagapudi Ramakrishna Siddhartha Engineering College (VRSEC), Vijayawada",
  "Bapatla Engineering College (BEC), Bapatla",
  "Madanapalle Institute of Technology & Science (MITS), Madanapalle",
  "National Institute of Technology (NIT Andhra Pradesh), Tadepalligudem",
  "Indian Institute of Technology (IIT Tirupati), Tirupati",
  "Indian Institute of Information Technology (IIIT Sri City), Chittoor",
  "CBIT, Hyderabad",
  "VNR VJIET, Hyderabad",
  "Other College"
];

const BRANCH_SKILLS_MAP = {
  "Computer Science & Engineering": [
    "Programming (C/C++)", "Java", "Python", "SQL & Relational DBs", "Data Structures & Algorithms",
    "Web Development (HTML/CSS/JS/React)", "Backend & API Development", "Git & GitHub Version Control",
    "Cloud Computing (AWS/Azure/GCP)", "AI & Machine Learning Foundations", "Operating Systems & Networking", "Cybersecurity Basics"
  ],
  "Information Technology": [
    "Programming (C/C++)", "Java", "Python", "SQL & Databases", "Data Structures & Algorithms",
    "Full-Stack Web Development", "REST APIs & Microservices", "Cloud Computing & DevOps",
    "Git & GitHub", "Network Administration & Security", "AI / Data Science Basics", "Mobile App Development"
  ],
  "Artificial Intelligence & Machine Learning": [
    "Python for AI/ML", "NumPy, Pandas & Data Analysis", "Scikit-Learn & Classical ML", "Deep Learning (PyTorch/TensorFlow)",
    "Natural Language Processing (NLP)", "Computer Vision Basics", "Prompt Engineering & GenAI/LLMs",
    "Data Structures & Algorithms", "SQL & Data Warehousing", "Model Deployment & APIs", "Math for ML (Linear Algebra/Stats)", "Git & MLOps Basics"
  ],
  "Artificial Intelligence & Data Science": [
    "Python Programming", "Statistical Analysis & Probability", "SQL & Advanced Queries", "Data Wrangling & Cleaning (Pandas)",
    "Data Visualization (PowerBI/Tableau/Matplotlib)", "Machine Learning Algorithms", "Big Data Basics (Spark/Hadoop)",
    "Deep Learning Fundamentals", "Cloud Data Platforms", "Data Structures", "Generative AI Tools", "Git & Version Control"
  ],
  "Computer Science & Engineering – Data Science": [
    "Python / R Programming", "SQL & Database Design", "Data Structures & Algorithms", "Exploratory Data Analysis",
    "Statistical Machine Learning", "Data Visualization (Tableau/PowerBI)", "Deep Learning Basics", "Big Data Technologies",
    "Feature Engineering", "Data Engineering & Pipelines", "Git & Collaborative Coding", "GenAI & Prompting"
  ],
  "Computer Science & Business Systems": [
    "Programming in C/C++/Java", "Python Programming", "Data Structures & Algorithms", "Enterprise Database Systems (SQL)",
    "Business Analytics & BI Tools", "Software Engineering & Agile", "Cloud Computing Foundations", "Financial & Business Systems",
    "Machine Learning Applications", "Web & Mobile Technologies", "Design Thinking & UI/UX", "Git & Project Management"
  ],
  "Electronics & Communication Engineering": [
    "Digital Electronics & Logic Design", "Analog Circuits & Signals", "Embedded Systems (C/C++)",
    "Microcontrollers (8051/ARM/STM32)", "Communication Systems (Wireless/RF)", "VLSI Design (Verilog/VHDL)",
    "Internet of Things (IoT) & Sensors", "PCB Design & EDA Tools (KiCAD/Altium)", "MATLAB & Simulink",
    "Signal & Image Processing", "Python for Hardware/Automation", "Basic Data Structures"
  ],
  "Electrical & Electronics Engineering": [
    "Electrical Machines (AC/DC)", "Power Systems Analysis & Grid", "Control Systems Engineering",
    "Power Electronics & Drives", "Renewable Energy & EV Tech", "MATLAB / Simulink Simulation",
    "PLC & SCADA Industrial Automation", "Microcontrollers & Embedded C", "Circuit Simulation (SPICE/Multisim)",
    "Switchgear & Protection", "IoT in Energy Systems", "Python/C Basics"
  ],
  "Mechanical Engineering": [
    "Engineering Drawing & GD&T", "AutoCAD (2D & 3D Drafting)", "SolidWorks / Creo / CATIA 3D Modeling",
    "Thermodynamics & Heat Transfer", "Manufacturing & CNC Machining", "Strength of Materials & FEA (ANSYS)",
    "Fluid Mechanics & Hydraulics", "Robotics & Automation Basics", "Industrial Engineering & Lean",
    "Automobile Engineering", "Mechatronics & Sensors", "Python/MATLAB for Engineers"
  ],
  "Civil Engineering": [
    "AutoCAD (Civil Drafting)", "Structural Analysis & RCC Design", "Surveying & Total Station / GIS",
    "STAAD.Pro / ETABS Structural Software", "Building Construction & Materials", "Geotechnical & Soil Mechanics",
    "Estimation, Costing & Quantity Survey", "Revit & BIM Basics", "Transportation & Highway Engineering",
    "Environmental Engineering & Water Supply", "Project Management (MS Project/Primavera)", "Hydraulics & Irrigation"
  ],
  "Chemical Engineering": [
    "Chemical Process Calculations (Stoichiometry)", "Thermodynamics & Phase Equilibria", "Fluid Flow Operations",
    "Heat Transfer Equipment Design", "Mass Transfer Operations (Distillation/Absorption)", "Chemical Reaction Engineering (Kinetics)",
    "Process Dynamics & Instrumentation Control", "Process Simulation (Aspen Plus / DWSIM)", "Plant Design & Economics",
    "Safety & Hazardous Waste Management", "Petroleum & Polymer Tech", "MATLAB/Python for ChemE"
  ],
  "Biotechnology": [
    "Cell & Molecular Biology Techniques", "Microbiology & Fermentation Tech", "Bioinformatics & Sequence Analysis (BLAST/Python)",
    "Bioprocess Engineering & Bioreactors", "Genetic Engineering & Recombinant DNA", "Immunology & Diagnostic Methods",
    "Analytical Techniques (HPLC, PCR, Gel)", "Biostatistics & Experimental Design", "Biopharmaceutical Technology",
    "Genomics & Proteomics Tools", "Enzyme Engineering", "Bio-Ethics & Regulatory Affairs"
  ],
  "Other": [
    "Fundamental Programming (C/Python)", "Domain Core Technical Knowledge", "Computer Aided Design (CAD/Tools)",
    "Analytical & Math Problem Solving", "Data Analysis & Excel/Spreadsheets", "Technical Report Writing & Documentation",
    "Laboratory & Hands-on Equipment Skills", "Modern Industry Simulation Tools", "Project Planning & Execution",
    "Version Control / Collaboration Tools", "AI & Modern Digital Tools", "Quality & Safety Standards"
  ]
};

const COMMON_SKILLS = [
  { id: "communication", name: "Communication Skills", desc: "Expressing technical & non-technical ideas clearly in speech" },
  { id: "english", name: "Professional English Fluency", desc: "Spoken and written fluency for corporate & academic environments" },
  { id: "problemSolving", name: "Problem Solving Ability", desc: "Breaking complex issues into solvable step-by-step solutions" },
  { id: "logicalThinking", name: "Logical & Analytical Thinking", desc: "Deductive reasoning, pattern recognition, and critical thinking" },
  { id: "aptitude", name: "Quantitative Aptitude & Math", desc: "Speed, accuracy in arithmetic, algebra, probabilities & reasoning" },
  { id: "presentation", name: "Presentation & Public Speaking", desc: "Presenting slides, projects and speaking before an audience" },
  { id: "teamwork", name: "Teamwork & Collaboration", desc: "Coordinating effectively in multidisciplinary peer teams" },
  { id: "timeManagement", name: "Time & Task Management", desc: "Prioritizing coursework, project deadlines and personal growth" },
  { id: "selfLearning", name: "Self-Directed Learning", desc: "Picking up new tools, languages and docs independently without spoon-feeding" },
  { id: "confidence", name: "Self Confidence & Poise", desc: "Confidence in facing interviews, discussions and leadership challenges" },
  { id: "aiTools", name: "Modern AI Tools Usage", desc: "Using ChatGPT, Claude, Copilot, Perplexity for accelerated workflow" },
  { id: "computerSkills", name: "General Computer & Digital Proficiency", desc: "Operating systems, spreadsheets, cloud drives, collaboration software" }
];
