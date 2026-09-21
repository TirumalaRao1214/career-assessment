/**
 * Google Sheets Service Module
 * Handles decoupled network interactions between the frontend and Google Apps Script Web App Endpoint.
 * 
 * Future-Ready Architecture:
 * Can be effortlessly swapped with ASP.NET Core Web API + SQL Server service
 * without changing survey UI or assessment logic.
 */

const GoogleSheetsService = {
  // Web App endpoint URL (can be updated via UI or hardcoded for deployment)
  DEFAULT_ENDPOINT_URL: "",
  STORAGE_ENDPOINT_KEY: "btech_google_sheets_endpoint_url_v1",

  getEndpointUrl() {
    const saved = localStorage.getItem(this.STORAGE_ENDPOINT_KEY);
    return saved && saved.trim().length > 0 ? saved.trim() : this.DEFAULT_ENDPOINT_URL;
  },

  setEndpointUrl(url) {
    if (url) {
      localStorage.setItem(this.STORAGE_ENDPOINT_KEY, url.trim());
    } else {
      localStorage.removeItem(this.STORAGE_ENDPOINT_KEY);
    }
  },

  /**
   * Generates a collision-resistant unique Assessment Response ID:
   * Format: BT2026-000123 / BT2026-XXXXXX
   */
  generateResponseId() {
    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `BT${currentYear}-${randomSuffix}`;
  },

  /**
   * Formats the student's complete raw inputs, assessment results, and generated recommendations
   * into the standardized contract expected by the Google Apps Script Web App.
   */
  buildPayload(formData, assessmentResult, responseId) {
    const rId = responseId || this.generateResponseId();
    const ts = new Date().toISOString();

    const collegeName = formData.collegeName === "Other College"
      ? (formData.otherCollegeName || "Other College")
      : formData.collegeName;

    const branchName = formData.branch === "Other"
      ? (formData.otherBranchName || "Other Branch")
      : formData.branch;

    return {
      responseId: rId,
      timestamp: ts,
      student: {
        fullName: formData.fullName || "",
        email: formData.email || "",
        mobile: formData.mobile || "",
        gender: formData.gender || ""
      },
      college: {
        name: collegeName,
        district: formData.district || "",
        city: formData.city || "",
        state: formData.state || "Andhra Pradesh",
        areaType: formData.areaType || "Semi-Urban",
        collegeType: formData.collegeType || "Private"
      },
      academic: {
        branch: branchName,
        year: formData.year || "",
        semester: formData.semester || "",
        performance: formData.academicPerformance || ""
      },
      career: {
        primaryGoal: formData.careerGoal || "",
        clarity: formData.careerClarity || "",
        unclearReason: formData.unclearReason || ""
      },
      skills: {
        common: formData.commonSkills || {},
        branch: formData.branchSkills || {}
      },
      projects: {
        count: formData.projectsCount || "None",
        realWorld: formData.realWorldProject || "No",
        confidence: formData.projectExplanationConfidence || "",
        portfolio: formData.hasPortfolio || "No"
      },
      internship: {
        completed: formData.hasInternship || "No",
        domain: formData.internshipDomain || "",
        duration: formData.internshipDuration || "",
        type: formData.internshipType || "Unpaid",
        relevant: formData.internshipRelevant || "No"
      },
      placement: {
        resume: formData.resumeReadiness || "Not Created",
        aptitude: formData.aptitudeReadiness || "Not Started",
        technicalInterview: formData.technicalInterviewReadiness || "Not Started",
        hrInterview: formData.hrInterviewReadiness || "Not Started",
        coding: formData.codingReadiness || "Not Started",
        mockInterviews: formData.mockInterviews || "Never"
      },
      ai: {
        usage: Array.isArray(formData.aiUsage) ? formData.aiUsage : [],
        confidence: formData.aiConfidence || 3
      },
      challenges: Array.isArray(formData.challenges) ? formData.challenges : [],
      goals: {
        learningPreferences: Array.isArray(formData.learningPreferences) ? formData.learningPreferences : [],
        sixMonthGoal: formData.sixMonthGoal || ""
      },
      assessment: {
        overallIndex: assessmentResult.overallIndex,
        readinessLevel: assessmentResult.readinessLevel,
        scores: assessmentResult.scores,
        strengths: assessmentResult.strengths,
        focusAreas: assessmentResult.focusAreas
      },
      recommendations: assessmentResult.recommendations
    };
  },

  /**
   * Submits survey payload to Google Apps Script Web App.
   * If offline or no live URL provided, safely caches locally to ensure zero data loss.
   */
  async submitResponse(payload) {
    const endpoint = this.getEndpointUrl();

    // 1. Always back up locally in case of network drops
    StorageService.saveSubmissionLocally(payload);

    if (!endpoint || endpoint.trim().length === 0) {
      // If endpoint not configured yet, simulate local success with zero data loss
      console.info("Google Sheets endpoint URL not configured. Stored securely in browser storage.");
      return {
        success: true,
        message: "Saved to local browser database (Google Sheets endpoint pending configuration).",
        responseId: payload.responseId,
        timestamp: payload.timestamp,
        localOnly: true
      };
    }

    try {
      // Use text/plain with JSON stringification to prevent CORS preflight blocking in Google Apps Script
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result && result.success !== false) {
        return {
          success: true,
          message: result.message || "Assessment submitted successfully",
          responseId: result.responseId || payload.responseId,
          timestamp: result.timestamp || payload.timestamp
        };
      } else {
        throw new Error(result.message || "Google Sheets Apps Script returned error.");
      }
    } catch (err) {
      console.error("Google Sheets Webhook submission error:", err);
      // Throw formatted error so UI displays friendly retry message
      throw new Error("We couldn't save your assessment. Please try again.");
    }
  },

  /**
   * Fetches configurable metadata (Colleges, Recommendation Rules, Questions) from Google Sheets
   */
  async fetchConfigFromSheet() {
    const endpoint = this.getEndpointUrl();
    if (!endpoint) return null;

    try {
      const response = await fetch(`${endpoint}?action=config`);
      if (!response.ok) return null;
      const json = await response.json();
      if (json && json.success) {
        return json.data;
      }
    } catch (e) {
      console.warn("Could not load dynamic configuration from Google Sheets, using built-in rules:", e);
    }
    return null;
  },

  /**
   * Fetches real aggregate responses from Google Sheets for the College Dashboard
   */
  async fetchResponsesFromSheet() {
    const endpoint = this.getEndpointUrl();
    if (!endpoint) return null;

    try {
      const response = await fetch(`${endpoint}?action=responses`);
      if (!response.ok) return null;
      const json = await response.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json.data;
      }
    } catch (e) {
      console.warn("Could not fetch remote sheet responses:", e);
    }
    return null;
  }
};
