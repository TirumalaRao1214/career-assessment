/**
 * ════════════════════════════════════════════════════════════════════════
 * ADMIN-ONLY FILE — DO NOT LOAD IN THE BROWSER OR INCLUDE IN index.html
 * ════════════════════════════════════════════════════════════════════════
 *
 * This file is NOT referenced by index.html and is NOT executed by students.
 * It is provided as a reference/template for the ADMIN ONLY.
 *
 * PURPOSE:
 *   This Apps Script was the previous Google Sheets Web App endpoint approach.
 *   The architecture has been replaced with direct Google Form submission.
 *   See GOOGLE_FORM_SETUP.md for the current setup guide.
 *
 * IF YOU STILL WANT TO USE APPS SCRIPT AS AN ALTERNATIVE BACKEND:
 *   Follow the original setup instructions below.
 *   The Google Sheet must remain PRIVATE — never share its URL with students.
 *
 * SECURITY REMINDER:
 *   Never put the spreadsheet URL, ID, or any Google credential in:
 *     - index.html
 *     - js/googleFormConfig.js
 *     - Any public JavaScript file
 *
 * ════════════════════════════════════════════════════════════════════════
 *
 * Google Apps Script Web App Endpoint for B.Tech Career & Skill Assessment
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets and create a new Spreadsheet (or use existing).
 * 2. Rename / Ensure the following 4 Sheets (Worksheets) exist:
 *    - "Responses"
 *    - "Colleges"
 *    - "Recommendations"
 *    - "Questions"
 * 3. Run the function `setupSpreadsheet()` once to create all headers and seed configurable Colleges, Recommendations rules, and Questions metadata.
 * 4. Go to Extensions -> Apps Script. Paste this entire file.
 * 5. Click "Deploy" -> "New deployment".
 * 6. Select type: "Web app".
 *    - Description: "BTech Career Assessment Web App Endpoint v1"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (allows Render/static frontend POST/GET requests without exposing credentials).
 * 7. Click "Deploy" and copy the Web App URL (ends in /exec).
 * 8. Paste this Web App URL into `googleSheetsService.js` (or via the Backend API Settings in the web UI).
 */

// SPREADSHEET SETUP HELPER (Run once from Apps Script Editor)
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Responses Sheet
  var responsesSheet = ss.getSheetByName("Responses") || ss.insertSheet("Responses");
  var responseHeaders = [
    "Timestamp", "Response ID", "Full Name", "Email", "Mobile", "College", "District", "City", "State",
    "Area Type", "College Type", "Branch", "Year", "Semester", "Academic Performance", "Career Goal",
    "Career Clarity", "Communication Score", "English Score", "Problem Solving Score", "Logical Thinking Score",
    "Aptitude Score", "Presentation Score", "Teamwork Score", "Time Management Score", "Self Learning Score",
    "Confidence Score", "AI Skills Score", "Technical Skills", "Programming Skills", "SQL Skills",
    "Project Count", "Project Experience", "Internship Status", "Internship Domain", "Resume Readiness",
    "Aptitude Readiness", "Technical Interview Readiness", "HR Interview Readiness", "Coding Readiness",
    "AI Usage", "Challenges", "Learning Preferences", "Six Month Goal", "Overall Assessment",
    "Strengths", "Focus Areas", "Recommendations"
  ];
  if (responsesSheet.getLastRow() === 0) {
    responsesSheet.appendRow(responseHeaders);
    responsesSheet.getRange(1, 1, 1, responseHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");
  }

  // 2. Colleges Sheet
  var collegesSheet = ss.getSheetByName("Colleges") || ss.insertSheet("Colleges");
  var collegeHeaders = ["College ID", "College Name", "District", "City", "State", "College Type", "Active"];
  if (collegesSheet.getLastRow() === 0) {
    collegesSheet.appendRow(collegeHeaders);
    collegesSheet.getRange(1, 1, 1, collegeHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");
    
    // Seed initial AP and regional engineering colleges
    var seedColleges = [
      ["COL-001", "Andhra University College of Engineering (AUCE), Visakhapatnam", "Visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-002", "JNTU College of Engineering, Kakinada (JNTUK)", "Kakinada", "Kakinada", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-003", "JNTU College of Engineering, Anantapur (JNTUA)", "Ananthapuramu", "Anantapur", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-004", "KL University (KLU), Vaddeswaram, Guntur", "Guntur", "Vaddeswaram", "Andhra Pradesh", "Deemed University", "TRUE"],
      ["COL-005", "Vignan's Foundation for Science, Technology & Research (VFSTR), Vadlamudi, Guntur", "Guntur", "Vadlamudi", "Andhra Pradesh", "Deemed University", "TRUE"],
      ["COL-006", "R.V.R. & J.C. College of Engineering, Guntur", "Guntur", "Guntur", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-007", "Gayatri Vidya Parishad College of Engineering (GVPCE), Visakhapatnam", "Visakhapatnam", "Visakhapatnam", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-008", "Vellore Institute of Technology (VIT-AP), Amaravati", "Guntur", "Amaravati", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-009", "SRM University-AP, Amaravati", "Guntur", "Amaravati", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-010", "Vasireddy Venkatadri Institute of Technology (VVIT), Guntur", "Guntur", "Nambur", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-011", "G. Pulla Reddy Engineering College (GPREC), Kurnool", "Kurnool", "Kurnool", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-012", "Sri Venkateswara University College of Engineering (SVUCE), Tirupati", "Tirupati", "Tirupati", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-013", "Sagi Rama Krishnam Raju Engineering College (SRKR), Bhimavaram", "West Godavari", "Bhimavaram", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-014", "Vishnu Institute of Technology (VITB), Bhimavaram", "West Godavari", "Bhimavaram", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-015", "GMR Institute of Technology (GMRIT), Rajam", "Vizianagaram", "Rajam", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-016", "Aditya Engineering College, Surampalem", "Kakinada", "Surampalem", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-017", "Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT), Vijayawada", "Krishna", "Vijayawada", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-018", "Velagapudi Ramakrishna Siddhartha Engineering College (VRSEC), Vijayawada", "Krishna", "Vijayawada", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-019", "Bapatla Engineering College (BEC), Bapatla", "Bapatla", "Bapatla", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-020", "Madanapalle Institute of Technology & Science (MITS), Madanapalle", "Annamayya", "Madanapalle", "Andhra Pradesh", "Private", "TRUE"],
      ["COL-021", "National Institute of Technology (NIT Andhra Pradesh), Tadepalligudem", "West Godavari", "Tadepalligudem", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-022", "Indian Institute of Technology (IIT Tirupati), Tirupati", "Tirupati", "Tirupati", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-023", "Indian Institute of Information Technology (IIIT Sri City), Chittoor", "Tirupati", "Sri City", "Andhra Pradesh", "Government", "TRUE"],
      ["COL-024", "Other College", "Other District", "Other", "Andhra Pradesh", "Other", "TRUE"]
    ];
    collegesSheet.getRange(2, 1, seedColleges.length, collegeHeaders.length).setValues(seedColleges);
  }

  // 3. Recommendations Sheet
  var recSheet = ss.getSheetByName("Recommendations") || ss.insertSheet("Recommendations");
  var recHeaders = ["Rule ID", "Branch", "Career Goal", "Skill", "Minimum Score", "Maximum Score", "Priority", "Recommendation", "Recommended Action"];
  if (recSheet.getLastRow() === 0) {
    recSheet.appendRow(recHeaders);
    recSheet.getRange(1, 1, 1, recHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");

    var seedRules = [
      ["REC-001", "ALL", "Software / IT", "Programming", 1, 3, 1, "Master One Core Programming Language & DSA Foundations", "Focus intensively on Java/Python/C++. Solve 2 problems daily on LeetCode covering Arrays, Hashing, Trees, and Dynamic Programming."],
      ["REC-002", "ALL", "ALL", "Projects", 0, 1, 1, "Build & Deploy 2 Real-World Capstone Projects", "Move beyond classroom lab exercises. Build and deploy solutions solving real user or algorithmic problems with live hosting and GitHub documentation."],
      ["REC-003", "ALL", "ALL", "Internship", 0, 0, 2, "Target 6-8 Week Industry Internship", "Apply to verified summer internships via AICTE Internships, LinkedIn, or faculty-backed research laboratories in your target domain."],
      ["REC-004", "ALL", "ALL", "Aptitude", 1, 3, 2, "Structured Daily Quantitative Aptitude Practice", "Dedicate 30 mins daily to quantitative arithmetic, speed math, data interpretation, and logical reasoning."],
      ["REC-005", "ALL", "ALL", "Interview", 1, 2, 2, "Attend 5+ Structured Mock Technical & HR Interviews", "Practice live peer mock interviews to articulate code, system decisions, and behavioral scenarios smoothly before campus hiring drives."],
      ["REC-006", "ALL", "ALL", "Communication", 1, 3, 3, "Technical Communication & Presentation Practice", "Deliver 3-minute technical elevator pitches and participate in structured peer group discussions weekly."],
      ["REC-007", "Mechanical Engineering", "Core Engineering", "CAD / FEA", 1, 3, 1, "Deep-dive into SolidWorks / ANSYS Simulation", "Complete advanced parametric modeling, simulation stress analysis, and GD&T drafting."],
      ["REC-008", "Civil Engineering", "Core Engineering", "Structural Design", 1, 3, 1, "Master STAAD.Pro / ETABS & BIM Fundamentals", "Practice RCC structural analysis, framing plans, and estimation costing on standard floor layouts."],
      ["REC-009", "Electronics & Communication Engineering", "Core Engineering", "Embedded / VLSI", 1, 3, 1, "Hands-on Embedded Systems & VLSI Verilog Design", "Build microcontroller sensor pipelines (ARM/STM32) and write synthesizable RTL models."],
      ["REC-010", "ALL", "ALL", "AI Tools", 1, 2, 3, "Adopt Modern AI Tools for Engineering Workflows", "Learn prompt engineering and modern toolchains (Copilot, ChatGPT, Claude) to accelerate coding and technical documentation."]
    ];
    recSheet.getRange(2, 1, seedRules.length, recHeaders.length).setValues(seedRules);
  }

  // 4. Questions Sheet
  var qSheet = ss.getSheetByName("Questions") || ss.insertSheet("Questions");
  var qHeaders = ["Question ID", "Section", "Question", "Branch", "Question Type", "Required", "Options", "Weight", "Active"];
  if (qSheet.getLastRow() === 0) {
    qSheet.appendRow(qHeaders);
    qSheet.getRange(1, 1, 1, qHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#f8fafc");

    var seedQuestions = [
      ["Q-001", "Student", "Full Name", "ALL", "text", "TRUE", "", "1", "TRUE"],
      ["Q-002", "Student", "College / Personal Email", "ALL", "email", "TRUE", "", "1", "TRUE"],
      ["Q-003", "Student", "Mobile Number", "ALL", "tel", "TRUE", "", "1", "TRUE"],
      ["Q-004", "Student", "Gender", "ALL", "radio", "TRUE", "Male|Female|Prefer not to say|Other", "1", "TRUE"],
      ["Q-005", "College", "College Name", "ALL", "select", "TRUE", "Popular Colleges List", "1", "TRUE"],
      ["Q-006", "College", "College District", "ALL", "select", "TRUE", "AP Districts List", "1", "TRUE"],
      ["Q-007", "Academic", "Branch of Engineering", "ALL", "select", "TRUE", "CSE|IT|ECE|EEE|Mech|Civil|AI&ML|AI&DS|CSBS|Chem|Biotech|Other", "1", "TRUE"],
      ["Q-008", "Academic", "Current Year", "ALL", "select", "TRUE", "1st Year|2nd Year|3rd Year|4th Year", "1", "TRUE"],
      ["Q-009", "Career", "Where Do You Want Your B.Tech To Take You?", "ALL", "radio", "TRUE", "Software / IT|Core Engineering|Government Jobs|Higher Studies|Research|Startup / Entrepreneurship|Freelancing|Business|Teaching|Not Sure Yet", "2", "TRUE"],
      ["Q-010", "Skills", "Common Skills (1-5 Rating)", "ALL", "rating_matrix", "TRUE", "12 Core Competencies", "2", "TRUE"],
      ["Q-011", "Skills", "Branch Technical Skills (1-5 Rating)", "ALL", "rating_matrix", "TRUE", "Dynamic Branch Skills", "2", "TRUE"],
      ["Q-012", "Projects", "How many meaningful projects have you completed?", "ALL", "radio", "TRUE", "None|1|2|3|4+", "2", "TRUE"],
      ["Q-013", "Placement", "Placement & Interview Readiness", "ALL", "radio_matrix", "TRUE", "Resume|Aptitude|Tech|HR|Coding|Mock", "2", "TRUE"],
      ["Q-014", "AI", "How are you currently using AI tools?", "ALL", "multi_select", "TRUE", "Learning|Coding|Projects|Research|Resume|Content Creation|Other|Not using AI yet", "1", "TRUE"],
      ["Q-015", "Goals", "If you could improve ONE thing in the next 6 months?", "ALL", "radio", "TRUE", "Technical Skills|Communication|Confidence|Projects|Internship|Interview Skills|Aptitude|Career Clarity|Leadership|AI Skills|Other", "1", "TRUE"]
    ];
    qSheet.getRange(2, 1, seedQuestions.length, qHeaders.length).setValues(seedQuestions);
  }
}

/**
 * Handle HTTP GET Requests:
 * - ?action=config : Returns colleges, recommendation rules, questions metadata
 * - ?action=responses : Returns aggregate/raw responses for authorized analytics
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "config";
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "config") {
      var colleges = getSheetData(ss.getSheetByName("Colleges"));
      var recommendations = getSheetData(ss.getSheetByName("Recommendations"));
      var questions = getSheetData(ss.getSheetByName("Questions"));

      return jsonResponse({
        success: true,
        data: {
          colleges: colleges,
          recommendations: recommendations,
          questions: questions
        }
      });
    } else if (action === "responses") {
      var responses = getSheetData(ss.getSheetByName("Responses"));
      return jsonResponse({
        success: true,
        count: responses.length,
        data: responses
      });
    }

    return jsonResponse({ success: false, message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle HTTP POST Requests:
 * Receives JSON payload from frontend, validates required fields,
 * generates a collision-resistant Response ID, appends to Responses sheet,
 * and returns structured success JSON.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Try to acquire lock for 15 seconds to prevent race conditions during simultaneous student submissions
  var hasLock = lock.tryLock(15000);
  if (!hasLock) {
    return jsonResponse({
      success: false,
      message: "Server busy processing submissions. Please retry in a moment."
    });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({
        success: false,
        message: "Invalid submission payload. No data received."
      });
    }

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({
        success: false,
        message: "Malformed JSON payload: " + parseErr.message
      });
    }

    // Extract sections from the payload
    var student = body.student || {};
    var college = body.college || {};
    var academic = body.academic || {};
    var career = body.career || {};
    var skills = body.skills || {};
    var commonSkills = skills.common || {};
    var branchSkills = skills.branch || {};
    var projects = body.projects || {};
    var internship = body.internship || {};
    var placement = body.placement || {};
    var ai = body.ai || {};
    var challenges = body.challenges || [];
    var goals = body.goals || {};
    var assessment = body.assessment || {};
    var recommendations = body.recommendations || [];

    // Basic required field validation
    if (!student.fullName || !student.email || !student.mobile) {
      return jsonResponse({
        success: false,
        message: "Missing mandatory student contact details (Full Name, Email, Mobile)."
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Responses");
    if (!sheet) {
      sheet = ss.insertSheet("Responses");
      setupSpreadsheet();
      sheet = ss.getSheetByName("Responses");
    }

    // Generate Collision-Resistant Unique Response ID if not provided
    // Format: BT2026-000001, BT2026-000002...
    var currentYear = new Date().getFullYear();
    var lastRow = sheet.getLastRow();
    var sequenceNum = lastRow; // row 1 is header, so row 2 => index 1
    var formattedSeq = ("000000" + sequenceNum).slice(-6);
    var generatedId = "BT" + currentYear + "-" + formattedSeq;

    var responseId = body.responseId && body.responseId.toString().trim().length > 0 ? body.responseId : generatedId;
    var timestamp = body.timestamp || new Date().toISOString();

    // Map into exact Responses Worksheet columns
    var rowData = [
      timestamp,                                                      // Timestamp
      responseId,                                                     // Response ID
      student.fullName || "",                                         // Full Name
      student.email || "",                                            // Email
      student.mobile || "",                                           // Mobile
      college.name || "",                                             // College
      college.district || "",                                         // District
      college.city || "",                                             // City
      college.state || "",                                            // State
      college.areaType || "",                                         // Area Type
      college.collegeType || "",                                      // College Type
      academic.branch || "",                                          // Branch
      academic.year || "",                                            // Year
      academic.semester || "",                                        // Semester
      academic.performance || "",                                     // Academic Performance
      career.primaryGoal || "",                                       // Career Goal
      career.clarity || "",                                           // Career Clarity
      commonSkills.communication || "",                               // Communication Score
      commonSkills.english || "",                                     // English Score
      commonSkills.problemSolving || "",                              // Problem Solving Score
      commonSkills.logicalThinking || "",                             // Logical Thinking Score
      commonSkills.aptitude || "",                                    // Aptitude Score
      commonSkills.presentation || "",                                // Presentation Score
      commonSkills.teamwork || "",                                    // Teamwork Score
      commonSkills.timeManagement || "",                              // Time Management Score
      commonSkills.selfLearning || "",                                // Self Learning Score
      commonSkills.confidence || "",                                  // Confidence Score
      commonSkills.aiTools || "",                                     // AI Skills Score
      JSON.stringify(branchSkills),                                   // Technical Skills
      branchSkills["Programming (C/C++)"] || branchSkills["Python"] || branchSkills["Java"] || "", // Programming Skills
      branchSkills["SQL & Relational DBs"] || branchSkills["SQL & Databases"] || "", // SQL Skills
      projects.count || "",                                           // Project Count
      projects.realWorld || "",                                       // Project Experience
      internship.completed || "",                                     // Internship Status
      internship.domain || "",                                        // Internship Domain
      placement.resume || "",                                         // Resume Readiness
      placement.aptitude || "",                                       // Aptitude Readiness
      placement.technicalInterview || "",                             // Technical Interview Readiness
      placement.hrInterview || "",                                    // HR Interview Readiness
      placement.coding || "",                                         // Coding Readiness
      Array.isArray(ai.usage) ? ai.usage.join(", ") : (ai.usage || ""), // AI Usage
      Array.isArray(challenges) ? challenges.join(", ") : challenges, // Challenges
      Array.isArray(goals.learningPreferences) ? goals.learningPreferences.join(", ") : "", // Learning Preferences
      goals.sixMonthGoal || "",                                       // Six Month Goal
      assessment.overallIndex !== undefined ? (assessment.overallIndex + "/100 - " + (assessment.readinessLevel ? assessment.readinessLevel.label : "")) : "", // Overall Assessment
      Array.isArray(assessment.strengths) ? assessment.strengths.map(function(s) { return s.title; }).join(" | ") : "", // Strengths
      Array.isArray(assessment.focusAreas) ? assessment.focusAreas.map(function(f) { return f.title + " (" + f.needLevel + ")"; }).join(" | ") : "", // Focus Areas
      Array.isArray(recommendations) ? recommendations.map(function(r) { return r.step + ". " + r.title; }).join(" | ") : "" // Recommendations
    ];

    sheet.appendRow(rowData);

    return jsonResponse({
      success: true,
      message: "Assessment submitted successfully",
      responseId: responseId,
      timestamp: timestamp,
      rowNumber: sheet.getLastRow()
    });

  } catch (error) {
    return jsonResponse({
      success: false,
      message: "Unable to submit assessment: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// HELPER: Convert sheet to array of objects
function getSheetData(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var results = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    results.push(obj);
  }
  return results;
}

// HELPER: JSON HTTP Response
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
