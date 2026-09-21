/**
 * B.Tech Career & Skill Assessment - Core Analytics & Recommendation Engine
 * Evaluates student responses across 8 holistic dimensions,
 * identifies strengths & prioritized skill gaps, and dynamically evaluates configurable recommendation rules.
 */

const AssessmentEngine = {
  // Built-in rule catalog (can also be augmented from Google Sheets 'Recommendations' tab)
  recommendationRules: [
    {
      ruleId: "REC-001",
      branch: "ALL",
      careerGoal: "Software / IT",
      skill: "Programming",
      minScore: 1,
      maxScore: 3,
      priority: 1,
      recommendation: "Master One Core Programming Language & DSA Foundations",
      action: "Focus intensively on Java/Python/C++. Solve 2 problems daily on LeetCode covering Arrays, Hashing, Trees, and Dynamic Programming.",
      timeline: "Next 60 Days",
      impact: "Cracking Online Coding Tests & Technical Rounds"
    },
    {
      ruleId: "REC-002",
      branch: "ALL",
      careerGoal: "ALL",
      skill: "Projects",
      minScore: 0,
      maxScore: 1,
      priority: 1,
      recommendation: "Build & Deploy 2 Real-World Capstone Projects",
      action: "Move beyond classroom lab exercises. Build and deploy solutions solving real user or algorithmic problems with live hosting and GitHub documentation.",
      timeline: "Month 2 – Month 3",
      impact: "Resume Shortlisting & Tech Interview Talking Points"
    },
    {
      ruleId: "REC-003",
      branch: "ALL",
      careerGoal: "ALL",
      skill: "Internship",
      minScore: 0,
      maxScore: 0,
      priority: 2,
      recommendation: "Target 6-8 Week Industry Internship",
      action: "Apply to verified summer internships via AICTE Internships, LinkedIn, or faculty-backed research laboratories in your target domain.",
      timeline: "Next 90 Days",
      impact: "Industry Credibility & Real-world Experience"
    },
    {
      ruleId: "REC-004",
      branch: "ALL",
      careerGoal: "ALL",
      skill: "Aptitude",
      minScore: 1,
      maxScore: 3,
      priority: 2,
      recommendation: "Structured Daily Quantitative Aptitude Practice",
      action: "Dedicate 30 mins daily to quantitative arithmetic, speed math, data interpretation, and logical reasoning.",
      timeline: "Daily Routine",
      impact: "Clearing Preliminary Campus Screening Assessments"
    },
    {
      ruleId: "REC-005",
      branch: "ALL",
      careerGoal: "ALL",
      skill: "Interview",
      minScore: 1,
      maxScore: 2,
      priority: 2,
      recommendation: "Attend 5+ Structured Mock Technical & HR Interviews",
      action: "Practice live peer mock interviews to articulate code, system decisions, and behavioral scenarios smoothly before campus hiring drives.",
      timeline: "Final 45 Days before Drives",
      impact: "Eliminating Interview Anxiety & Maximizing Conversion"
    },
    {
      ruleId: "REC-006",
      branch: "ALL",
      careerGoal: "ALL",
      skill: "Communication",
      minScore: 1,
      maxScore: 3,
      priority: 3,
      recommendation: "Technical Communication & Presentation Practice",
      action: "Deliver 3-minute technical elevator pitches and participate in structured peer group discussions weekly.",
      timeline: "Ongoing Weekly Cadence",
      impact: "Managerial & HR Round Clearance"
    },
    {
      ruleId: "REC-007",
      branch: "Mechanical Engineering",
      careerGoal: "Core Engineering",
      skill: "CAD / FEA",
      minScore: 1,
      maxScore: 3,
      priority: 1,
      recommendation: "Deep-dive into SolidWorks / ANSYS Simulation",
      action: "Complete advanced parametric modeling, simulation stress analysis, and GD&T drafting.",
      timeline: "Next 60 Days",
      impact: "Core Mechanical Design Engineering Roles"
    },
    {
      ruleId: "REC-008",
      branch: "Civil Engineering",
      careerGoal: "Core Engineering",
      skill: "Structural Design",
      minScore: 1,
      maxScore: 3,
      priority: 1,
      recommendation: "Master STAAD.Pro / ETABS & BIM Fundamentals",
      action: "Practice RCC structural analysis, framing plans, and estimation costing on standard floor layouts.",
      timeline: "Next 60 Days",
      impact: "Structural Engineering Consultancy Positions"
    },
    {
      ruleId: "REC-009",
      branch: "Electronics & Communication Engineering",
      careerGoal: "Core Engineering",
      skill: "Embedded / VLSI",
      minScore: 1,
      maxScore: 3,
      priority: 1,
      recommendation: "Hands-on Embedded Systems & VLSI Verilog Design",
      action: "Build microcontroller sensor pipelines (ARM/STM32) and write synthesizable RTL models.",
      timeline: "Next 60 Days",
      impact: "Embedded Hardware & Semiconductor Roles"
    },
    {
      ruleId: "REC-010",
      branch: "ALL",
      careerGoal: "ALL",
      skill: "AI Tools",
      minScore: 1,
      maxScore: 2,
      priority: 3,
      recommendation: "Adopt Modern AI Tools for Engineering Workflows",
      action: "Learn prompt engineering and modern toolchains (Copilot, ChatGPT, Claude) to accelerate coding and technical documentation.",
      timeline: "Next 30 Days",
      impact: "Multiplied Engineering Productivity"
    }
  ],

  setRecommendationRules(rules) {
    if (Array.isArray(rules) && rules.length > 0) {
      this.recommendationRules = rules;
    }
  },

  analyze(student) {
    const scores = {
      careerClarity: this.calcCareerClarity(student),
      technicalReadiness: this.calcTechnicalReadiness(student),
      practicalExperience: this.calcPracticalExperience(student),
      placementReadiness: this.calcPlacementReadiness(student),
      communicationReadiness: this.calcCommunicationReadiness(student),
      interviewReadiness: this.calcInterviewReadiness(student),
      industryExposure: this.calcIndustryExposure(student),
      aiReadiness: this.calcAiReadiness(student)
    };

    const overallIndex = Math.round(
      scores.careerClarity * 0.12 +
      scores.technicalReadiness * 0.20 +
      scores.practicalExperience * 0.18 +
      scores.placementReadiness * 0.18 +
      scores.communicationReadiness * 0.12 +
      scores.interviewReadiness * 0.10 +
      scores.aiReadiness * 0.10
    );

    const strengths = this.getStrengths(student, scores);
    const focusAreas = this.getFocusAreas(student, scores);
    const recommendations = this.generateRecommendations(student, scores);

    return {
      scores,
      overallIndex,
      readinessLevel: this.getReadinessLevelLabel(overallIndex),
      strengths,
      focusAreas,
      recommendations,
      timestamp: new Date().toISOString()
    };
  },

  calcCareerClarity(s) {
    let score = 50;
    const clarityMap = {
      "Very Clear": 100,
      "Mostly Clear": 80,
      "Somewhat Clear": 60,
      "Not Clear": 40,
      "Completely Unsure": 25
    };
    if (s.careerClarity && clarityMap[s.careerClarity]) {
      score = clarityMap[s.careerClarity];
    }
    if (s.careerGoal === "Not Sure Yet") {
      score = Math.min(score, 45);
    }
    return score;
  },

  calcTechnicalReadiness(s) {
    const branchRatings = s.branchSkills ? Object.values(s.branchSkills) : [];
    let avgBranch = 2.5;
    if (branchRatings.length > 0) {
      const sum = branchRatings.reduce((a, b) => a + Number(b), 0);
      avgBranch = sum / branchRatings.length;
    }

    const psRating = Number(s.commonSkills?.problemSolving || 3);
    const ltRating = Number(s.commonSkills?.logicalThinking || 3);

    const rawWeighted = (avgBranch * 0.6) + (psRating * 0.2) + (ltRating * 0.2);
    return Math.round(Math.min(100, Math.max(10, (rawWeighted / 5) * 100)));
  },

  calcPracticalExperience(s) {
    const projCountMap = { "None": 10, "1": 35, "2": 60, "3": 80, "4+": 100 };
    const pScore = projCountMap[s.projectsCount] || 20;

    let rwScore = 20;
    if (s.realWorldProject === "Yes") rwScore = 100;
    else if (s.realWorldProject === "Currently working on one") rwScore = 65;

    let portScore = 20;
    if (s.hasPortfolio === "Yes") portScore = 100;
    else if (s.hasPortfolio === "Planning to create one") portScore = 50;

    const confMap = { "Very Confident": 100, "Confident": 80, "Somewhat Confident": 50, "Not Confident": 25 };
    const confScore = confMap[s.projectExplanationConfidence] || 40;

    return Math.round((pScore * 0.35) + (rwScore * 0.30) + (portScore * 0.20) + (confScore * 0.15));
  },

  calcPlacementReadiness(s) {
    const levelMap = { "Strong": 100, "Good": 80, "Average": 55, "Weak": 30, "Not Started": 15 };
    const resumeMap = { "Ready": 100, "Needs Improvement": 55, "Not Created": 20 };

    const apt = levelMap[s.aptitudeReadiness] || 40;
    const tech = levelMap[s.technicalInterviewReadiness] || 40;
    const hr = levelMap[s.hrInterviewReadiness] || 40;
    const res = resumeMap[s.resumeReadiness] || 30;

    let total = (apt * 0.3) + (tech * 0.3) + (hr * 0.2) + (res * 0.2);

    if (s.codingReadiness) {
      const codeScore = levelMap[s.codingReadiness] || 30;
      total = (apt * 0.25) + (tech * 0.25) + (codeScore * 0.25) + (hr * 0.15) + (res * 0.10);
    }
    return Math.round(total);
  },

  calcCommunicationReadiness(s) {
    const comm = Number(s.commonSkills?.communication || 3);
    const eng = Number(s.commonSkills?.english || 3);
    const pres = Number(s.commonSkills?.presentation || 3);
    const conf = Number(s.commonSkills?.confidence || 3);

    const avg = (comm * 0.35) + (eng * 0.3) + (pres * 0.2) + (conf * 0.15);
    return Math.round((avg / 5) * 100);
  },

  calcInterviewReadiness(s) {
    const mockMap = { "Multiple": 100, "1–2": 65, "Never": 25 };
    const mockScore = mockMap[s.mockInterviews] || 25;
    const hrMap = { "Strong": 100, "Good": 80, "Average": 55, "Weak": 30, "Not Started": 15 };
    const hrScore = hrMap[s.hrInterviewReadiness] || 35;
    const confMap = { "Very Confident": 100, "Confident": 80, "Somewhat Confident": 50, "Not Confident": 25 };
    const confScore = confMap[s.projectExplanationConfidence] || 40;

    return Math.round((mockScore * 0.4) + (hrScore * 0.35) + (confScore * 0.25));
  },

  calcIndustryExposure(s) {
    let score = 25;
    if (s.hasInternship === "Yes") {
      score = 90;
      if (s.internshipRelevant === "Yes") score = 100;
      else if (s.internshipRelevant === "Partially") score = 85;
    } else if (s.hasInternship === "Currently doing one") {
      score = 75;
    } else {
      score = 30;
    }
    return score;
  },

  calcAiReadiness(s) {
    const aiConf = Number(s.aiConfidence || 3);
    const aiUseList = Array.isArray(s.aiUsage) ? s.aiUsage : [];
    let useScore = 20;

    if (aiUseList.includes("Not using AI yet")) {
      useScore = 15;
    } else {
      useScore = Math.min(100, aiUseList.length * 22 + 20);
    }

    return Math.round((useScore * 0.5) + ((aiConf / 5) * 100 * 0.5));
  },

  getReadinessLevelLabel(index) {
    if (index >= 85) return { label: "Exceptional / Industry Ready", color: "#10b981", badge: "Advanced" };
    if (index >= 70) return { label: "Solid Foundation / On Track", color: "#3b82f6", badge: "Proficient" };
    if (index >= 50) return { label: "Developing / Targeted Focus Needed", color: "#f59e0b", badge: "Developing" };
    return { label: "Early Stage / High Growth Potential", color: "#ec4899", badge: "Foundation" };
  },

  getStrengths(student, scores) {
    const strengths = [];

    if (scores.communicationReadiness >= 75) {
      strengths.push({
        title: "Strong Articulation & Communication",
        desc: "You demonstrate healthy confidence and poise in presenting ideas and expressing yourself.",
        icon: "chat"
      });
    }

    if (scores.technicalReadiness >= 70) {
      strengths.push({
        title: "Solid Technical Fundamentals",
        desc: "You possess a firm understanding of core engineering and branch-specific technical disciplines.",
        icon: "cpu"
      });
    }

    if (scores.practicalExperience >= 65) {
      strengths.push({
        title: "Practical Hands-on Mindset",
        desc: "You have engaged in project implementations that set you ahead of theory-only candidates.",
        icon: "folder"
      });
    }

    if (scores.aiReadiness >= 75) {
      strengths.push({
        title: "Modern AI & Tool Fluency",
        desc: "You actively leverage generative AI workflows and modern digital tools for accelerated learning.",
        icon: "sparkles"
      });
    }

    if (scores.careerClarity >= 80) {
      strengths.push({
        title: "Clear Career Direction",
        desc: `You have sharp focus on your ambition in ${student.careerGoal || "your chosen field"}.`,
        icon: "compass"
      });
    }

    if (student.hasInternship === "Yes" || student.hasInternship === "Currently doing one") {
      strengths.push({
        title: "Early Industry Exposure",
        desc: "Practical corporate or field internship experience puts you in a strong professional tier.",
        icon: "briefcase"
      });
    }

    if (strengths.length === 0) {
      strengths.push({
        title: "Enthusiasm for Self-Growth",
        desc: "Taking this thorough diagnostic assessment marks a decisive first step toward career mastery.",
        icon: "award"
      });
      strengths.push({
        title: "Academic Focus",
        desc: `Currently advancing in ${student.branch || "B.Tech"} with structured learning milestones.`,
        icon: "academic"
      });
    }

    return strengths.slice(0, 4);
  },

  getFocusAreas(student, scores) {
    const focusAreas = [];

    if (scores.practicalExperience < 60 || student.projectsCount === "None" || student.projectsCount === "1") {
      focusAreas.push({
        id: "projects",
        title: "Practical & Capstone Projects",
        needLevel: scores.practicalExperience < 40 ? "High Development Need" : "Moderate Development Need",
        urgency: "High",
        summary: "Build at least 2 full-cycle, deployable projects with real-world utility rather than theoretical lab experiments.",
        icon: "layers"
      });
    }

    if (scores.placementReadiness < 65 || student.resumeReadiness !== "Ready" || student.aptitudeReadiness === "Weak" || student.aptitudeReadiness === "Not Started") {
      focusAreas.push({
        id: "placement",
        title: "Placement & Aptitude Readiness",
        needLevel: scores.placementReadiness < 45 ? "High Development Need" : "Moderate Development Need",
        urgency: "High",
        summary: "Craft an ATS-optimized 1-page resume and establish daily practice in quantitative reasoning and data interpretation.",
        icon: "target"
      });
    }

    if (scores.technicalReadiness < 65) {
      focusAreas.push({
        id: "technical",
        title: "Core Branch Technical Competency",
        needLevel: scores.technicalReadiness < 45 ? "High Development Need" : "Moderate Development Need",
        urgency: "High",
        summary: "Master one foundational language/tool in-depth alongside problem solving and system fundamentals.",
        icon: "code"
      });
    }

    if (scores.interviewReadiness < 60 || student.mockInterviews === "Never") {
      focusAreas.push({
        id: "interview",
        title: "Mock Interview & Technical Defense",
        needLevel: "High Development Need",
        urgency: "Medium",
        summary: "Practice live peer mock interviews to articulate your code, project decisions, and behavioral responses smoothly.",
        icon: "user-check"
      });
    }

    if (scores.communicationReadiness < 65) {
      focusAreas.push({
        id: "communication",
        title: "Professional Communication & English",
        needLevel: "Moderate Development Need",
        urgency: "Medium",
        summary: "Practice delivering 3-minute technical elevator pitches and participating in structured technical group discussions.",
        icon: "mic"
      });
    }

    if (student.hasPortfolio !== "Yes") {
      focusAreas.push({
        id: "portfolio",
        title: "GitHub / Digital Portfolio",
        needLevel: "High Development Need",
        urgency: "Medium",
        summary: "Publish clean GitHub repositories with structured README.md files, live demos, and documentation.",
        icon: "globe"
      });
    }

    if (scores.industryExposure < 50) {
      focusAreas.push({
        id: "internship",
        title: "Internship & Industry Exposure",
        needLevel: "High Development Need",
        urgency: "Medium",
        summary: "Target 6-8 week internships, open-source contributions, or industrial training aligned with your goal.",
        icon: "building"
      });
    }

    return focusAreas.slice(0, 5);
  },

  /**
   * Evaluates dynamic recommendation rules configured in Google Sheets / catalog
   */
  generateRecommendations(student, scores) {
    const goal = student.careerGoal || "Software / IT";
    const branch = student.branch || "Computer Science & Engineering";
    const matched = [];

    for (const rule of this.recommendationRules) {
      // Check branch match
      if (rule.branch !== "ALL" && rule.branch !== branch) continue;
      // Check career goal match
      if (rule.careerGoal !== "ALL" && rule.careerGoal !== goal) continue;

      let applies = false;
      if (rule.skill === "Programming" && (scores.technicalReadiness < 70 || (student.commonSkills && student.commonSkills.problemSolving <= 3))) {
        applies = true;
      } else if (rule.skill === "Projects" && (student.projectsCount === "None" || student.projectsCount === "1" || scores.practicalExperience < 65)) {
        applies = true;
      } else if (rule.skill === "Internship" && (student.hasInternship === "No" || scores.industryExposure < 60)) {
        applies = true;
      } else if (rule.skill === "Aptitude" && (scores.placementReadiness < 70 || student.aptitudeReadiness === "Weak" || student.aptitudeReadiness === "Not Started")) {
        applies = true;
      } else if (rule.skill === "Interview" && (scores.interviewReadiness < 70 || student.mockInterviews === "Never")) {
        applies = true;
      } else if (rule.skill === "Communication" && scores.communicationReadiness < 70) {
        applies = true;
      } else if (rule.skill === "AI Tools" && scores.aiReadiness < 65) {
        applies = true;
      } else if (rule.branch === branch && rule.careerGoal === goal) {
        applies = true;
      }

      if (applies) {
        matched.push({
          title: rule.recommendation || rule.title,
          description: rule.action || rule.description || rule.RecommendedAction,
          timeline: rule.timeline || "Next 60 Days",
          impact: rule.impact || "Career Advancement"
        });
      }
    }

    // Ensure 3-5 high impact steps
    const finalRecs = matched.slice(0, 4).map((item, idx) => ({
      step: String(idx + 1),
      title: item.title,
      description: item.description,
      timeline: item.timeline,
      impact: item.impact
    }));

    // Fallback if none matched
    if (finalRecs.length === 0) {
      finalRecs.push(
        {
          step: "1",
          title: "Strengthen Core Technical Competencies & Problem Solving",
          description: "Dedicate structured practice to domain tools and technical problem-solving.",
          timeline: "Next 45 Days",
          impact: "Technical Proficiency"
        },
        {
          step: "2",
          title: "Build and Deploy 2 Capstone Engineering Projects",
          description: "Develop hands-on projects demonstrating practical problem solving with live documentation.",
          timeline: "Next 60 Days",
          impact: "Portfolio Differentiation"
        },
        {
          step: "3",
          title: "Structured Placement & Mock Interview Preparation",
          description: "Practice speed aptitude and attend simulated technical & HR mock interviews.",
          timeline: "Final 60 Days",
          impact: "Placement Readiness"
        }
      );
    }

    return finalRecs;
  }
};
