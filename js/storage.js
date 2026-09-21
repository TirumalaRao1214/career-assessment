/**
 * Storage Service - Modular Backend Architecture
 * - Stores all responses locally in localStorage for backup, fast responsive demo, and aggregate computation.
 * - Out-of-the-box Google Sheets Apps Script Webhook integration (configurable).
 * - Fully decoupled for future migration to ASP.NET Core Web API + SQL Server.
 */

const StorageService = {
  LOCAL_STORAGE_KEY: "btech_assessment_responses_v2",
  CONFIG_STORAGE_KEY: "btech_assessment_api_config_v2",

  getConfig() {
    const raw = localStorage.getItem(this.CONFIG_STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { }
    }
    return {
      backendType: "google_sheets", // "local" | "google_sheets" | "aspnet_api"
      googleSheetsUrl: localStorage.getItem("btech_google_sheets_endpoint_url_v1") || "",
      aspNetApiUrl: "https://api.yourdomain.com/api/assessments",
      apiKey: ""
    };
  },

  saveConfig(config) {
    localStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(config));
    if (config.googleSheetsUrl !== undefined) {
      localStorage.setItem("btech_google_sheets_endpoint_url_v1", config.googleSheetsUrl.trim());
    }
  },

  getAllResponses() {
    const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!raw) {
      // Empty by default to respect data rule: "Do NOT invent statistics or display sample fake college results"
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading responses:", e);
      return [];
    }
  },

  saveSubmissionLocally(payload) {
    const list = this.getAllResponses();
    // Check if duplicate responseId exists
    const existingIndex = list.findIndex(r => r.responseId === payload.responseId);
    if (existingIndex >= 0) {
      list[existingIndex] = payload;
    } else {
      list.unshift(payload);
    }
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(list));
  },

  // Flattened structure for CSV export or tabular review
  flattenForSpreadsheet(p) {
    const s = p.student || {};
    const col = p.college || {};
    const ac = p.academic || {};
    const car = p.career || {};
    const sk = p.skills || {};
    const cSk = sk.common || {};
    const bSk = sk.branch || {};
    const pr = p.projects || {};
    const intp = p.internship || {};
    const pl = p.placement || {};
    const ai = p.ai || {};
    const goals = p.goals || {};
    const ass = p.assessment || {};
    const scores = ass.scores || {};

    return {
      "Timestamp": p.timestamp,
      "Response ID": p.responseId,
      "Full Name": s.fullName,
      "Email": s.email,
      "Mobile": s.mobile,
      "College": col.name,
      "District": col.district,
      "City": col.city,
      "State": col.state,
      "Area Type": col.areaType,
      "College Type": col.collegeType,
      "Branch": ac.branch,
      "Year": ac.year,
      "Semester": ac.semester,
      "Academic Performance": ac.performance,
      "Career Goal": car.primaryGoal,
      "Career Clarity": car.clarity,
      "Communication Score": cSk.communication || "",
      "English Score": cSk.english || "",
      "Problem Solving Score": cSk.problemSolving || "",
      "Logical Thinking Score": cSk.logicalThinking || "",
      "Aptitude Score": cSk.aptitude || "",
      "Presentation Score": cSk.presentation || "",
      "Teamwork Score": cSk.teamwork || "",
      "Time Management Score": cSk.timeManagement || "",
      "Self Learning Score": cSk.selfLearning || "",
      "Confidence Score": cSk.confidence || "",
      "AI Skills Score": cSk.aiTools || "",
      "Technical Skills": JSON.stringify(bSk),
      "Programming Skills": bSk["Programming (C/C++)"] || bSk["Python"] || bSk["Java"] || "",
      "SQL Skills": bSk["SQL & Relational DBs"] || bSk["SQL & Databases"] || "",
      "Project Count": pr.count,
      "Project Experience": pr.realWorld,
      "Internship Status": intp.completed,
      "Internship Domain": intp.domain,
      "Resume Readiness": pl.resume,
      "Aptitude Readiness": pl.aptitude,
      "Technical Interview Readiness": pl.technicalInterview,
      "HR Interview Readiness": pl.hrInterview,
      "Coding Readiness": pl.coding || "N/A",
      "AI Usage": Array.isArray(ai.usage) ? ai.usage.join(", ") : ai.usage,
      "Challenges": Array.isArray(p.challenges) ? p.challenges.join(", ") : p.challenges,
      "Learning Preferences": Array.isArray(goals.learningPreferences) ? goals.learningPreferences.join(", ") : "",
      "Six Month Goal": goals.sixMonthGoal,
      "Overall Assessment": `${ass.overallIndex || 0}/100 - ${ass.readinessLevel ? ass.readinessLevel.label : ''}`,
      "Strengths": Array.isArray(ass.strengths) ? ass.strengths.map(x => x.title).join(" | ") : "",
      "Focus Areas": Array.isArray(ass.focusAreas) ? ass.focusAreas.map(x => `${x.title} (${x.needLevel})`).join(" | ") : "",
      "Recommendations": Array.isArray(p.recommendations) ? p.recommendations.map(x => `${x.step}. ${x.title}`).join(" | ") : ""
    };
  }
};
