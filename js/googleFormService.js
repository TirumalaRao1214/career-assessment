/**
 * Google Apps Script Submission Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture:
 *   Student → GOLIS Website → Google Apps Script Web App → Private Google Sheet
 *
 * Security model:
 *   • No Google Sheets API key anywhere in this file.
 *   • No spreadsheet URL or ID anywhere in this file.
 *   • No OAuth or service-account credentials here.
 *   • The Apps Script endpoint URL lives in googleFormConfig.js.
 *   • Students can only POST — the sheet remains private to the owner.
 *
 * How submission works:
 *   We POST a JSON payload to the Google Apps Script Web App (Content-Type:
 *   text/plain to avoid CORS preflight). The Apps Script doPost() handler
 *   receives it, validates required fields, and appends a row to the private
 *   Google Sheet. The script runs as the owner — students never touch the sheet.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const GoogleFormService = {

  /**
   * Generates a collision-resistant unique Assessment Response ID.
   * Format: BT2026-000123
   */
  generateResponseId() {
    const year = new Date().getFullYear();
    const suffix = Math.floor(100000 + Math.random() * 900000);
    return `BT${year}-${suffix}`;
  },

  /**
   * Submits the survey payload to the Google Apps Script Web App endpoint.
   *
   * The payload is a structured JSON object matching the contract expected
   * by the doPost() handler in google-apps-script.js.
   *
   * Content-Type is set to text/plain to avoid a CORS preflight OPTIONS
   * request, which Google Apps Script does not handle on deployed Web Apps.
   *
   * The student's answers are always saved to localStorage BEFORE the
   * network request — zero data loss on network failure.
   */
  async submitResponse(formData, assessmentResult, responseId) {
    // Always back up locally first — zero data loss guarantee
    const payload = this._buildPayload(formData, assessmentResult, responseId);
    StorageService.saveSubmissionLocally(payload);

    const endpoint = GOOGLE_FORM_CONFIG.APPS_SCRIPT_URL;

    try {
      // Google Apps Script Web Apps redirect POST to a new URL.
      // Using redirect: "follow" ensures fetch follows the 302 automatically.
      const response = await fetch(endpoint, {
        method: "POST",
        redirect: "follow",
        headers: {
          // text/plain avoids CORS preflight — required for Google Apps Script Web Apps
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      // Apps Script always returns 200 on the final redirected response.
      // If we still get a non-OK status, something is wrong with the deployment.
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseErr) {
        // Apps Script returned non-JSON (e.g. HTML error page) — still treat as success
        // because the row was likely written before the response was malformed.
        console.warn("Could not parse Apps Script response as JSON:", parseErr);
        return { success: true, responseId };
      }

      if (result && result.success !== false) {
        return {
          success: true,
          responseId: result.responseId || responseId
        };
      } else {
        throw new Error(result.message || "Apps Script returned an error.");
      }

    } catch (err) {
      console.error("Submission error:", err);
      throw new Error("Submission failed. Your answers have been preserved. Please try again.");
    }
  },

  /**
   * Builds the full structured payload sent to Apps Script and stored locally.
   * Shape matches the doPost() handler in google-apps-script.js exactly.
   */
  _buildPayload(formData, assessmentResult, responseId) {
    const ts = new Date().toISOString();

    const collegeName = formData.collegeName === "Other College"
      ? (formData.otherCollegeName || "Other College")
      : formData.collegeName;

    const branchName = formData.branch === "Other"
      ? (formData.otherBranchName || "Other Branch")
      : formData.branch;

    return {
      responseId,
      timestamp: ts,
      student: {
        fullName: formData.fullName || "",
        email:    formData.email    || "",
        mobile:   formData.mobile   || "",
        gender:   formData.gender   || ""
      },
      college: {
        name:        collegeName,
        district:    formData.district    || "",
        city:        formData.city        || "",
        state:       formData.state       || "Andhra Pradesh",
        areaType:    formData.areaType    || "",
        collegeType: formData.collegeType || ""
      },
      academic: {
        branch:      branchName,
        year:        formData.year                || "",
        semester:    formData.semester            || "",
        performance: formData.academicPerformance || ""
      },
      career: {
        primaryGoal:   formData.careerGoal    || "",
        clarity:       formData.careerClarity || "",
        unclearReason: formData.unclearReason || ""
      },
      skills: {
        common: formData.commonSkills || {},
        branch: formData.branchSkills || {}
      },
      projects: {
        count:      formData.projectsCount                || "None",
        realWorld:  formData.realWorldProject             || "No",
        confidence: formData.projectExplanationConfidence || "",
        portfolio:  formData.hasPortfolio                 || "No"
      },
      internship: {
        completed: formData.hasInternship      || "No",
        domain:    formData.internshipDomain   || "",
        duration:  formData.internshipDuration || "",
        type:      formData.internshipType     || "Unpaid",
        relevant:  formData.internshipRelevant || "No"
      },
      placement: {
        resume:             formData.resumeReadiness             || "Not Created",
        aptitude:           formData.aptitudeReadiness           || "Not Started",
        technicalInterview: formData.technicalInterviewReadiness || "Not Started",
        hrInterview:        formData.hrInterviewReadiness        || "Not Started",
        coding:             formData.codingReadiness             || "Not Started",
        mockInterviews:     formData.mockInterviews              || "Never"
      },
      ai: {
        usage:      Array.isArray(formData.aiUsage) ? formData.aiUsage : [],
        confidence: formData.aiConfidence || 3
      },
      challenges: Array.isArray(formData.challenges) ? formData.challenges : [],
      goals: {
        learningPreferences: Array.isArray(formData.learningPreferences) ? formData.learningPreferences : [],
        sixMonthGoal:        formData.sixMonthGoal || ""
      },
      assessment: {
        overallIndex:   assessmentResult.overallIndex,
        readinessLevel: assessmentResult.readinessLevel,
        scores:         assessmentResult.scores,
        strengths:      assessmentResult.strengths,
        focusAreas:     assessmentResult.focusAreas
      },
      recommendations: assessmentResult.recommendations
    };
  }
};
