/**
 * Main Application Controller for B.Tech Career & Skill Assessment
 * Handles views, 10-step wizard validation, reactive UI changes,
 * student snapshot generation, Google Form submission, and college intelligence dashboard.
 *
 * Submission architecture:
 *   Student → GOLIS Website → Google Form (POST) → Private Google Sheet
 * No Google Sheets API key, spreadsheet URL, or credentials are present here.
 */

const App = {
  currentStep: 1,
  totalSteps: 10,
  isSubmitting: false,
  
  // In-memory student form state (preserved until submission succeeds)
  formData: {
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    collegeName: "",
    otherCollegeName: "",
    district: "Guntur",
    city: "",
    state: "Andhra Pradesh",
    areaType: "Semi-Urban",
    collegeType: "Private",
    branch: "Computer Science & Engineering",
    otherBranchName: "",
    year: "3rd Year",
    semester: "5th Semester",
    academicPerformance: "70–79%",
    careerGoal: "Software / IT",
    careerClarity: "Mostly Clear",
    unclearReason: "",
    commonSkills: {},
    branchSkills: {},
    projectsCount: "2",
    realWorldProject: "Currently working on one",
    projectExplanationConfidence: "Confident",
    hasPortfolio: "Planning to create one",
    hasInternship: "No",
    internshipDomain: "",
    internshipDuration: "",
    internshipType: "Unpaid",
    internshipRelevant: "Yes",
    resumeReadiness: "Needs Improvement",
    aptitudeReadiness: "Average",
    technicalInterviewReadiness: "Good",
    hrInterviewReadiness: "Average",
    codingReadiness: "Good",
    mockInterviews: "1–2",
    aiUsage: ["Learning", "Coding"],
    aiConfidence: 4,
    challenges: ["Lack of projects", "Placement preparation"],
    learningPreferences: ["Projects", "One-to-one mentoring"],
    sixMonthGoal: "Technical Skills"
  },

  async init() {
    this.bindGlobalEvents();
    this.initDefaultRatings();
    this.showView("home-view");
  },

  // Kept as a no-op stub so any lingering HTML onclick references don't throw.
  async syncConfigFromSheet() {
    if (false) {
      if (false) {
      }
    }
  },

  showToast(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "toast-error" : ""}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? '#fb7185' : '#60a5fa'}" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4500);
  },

  showView(viewId) {
    document.querySelectorAll(".app-view").forEach(el => el.style.display = "none");
    const active = document.getElementById(viewId);
    if (active) {
      active.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-target") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    if (viewId === "dashboard-view") {
      this.renderDashboard();
    }
  },

  startAssessment() {
    this.currentStep = 1;
    this.showView("assessment-view");
    this.renderStep(1);
  },

  initDefaultRatings() {
    COMMON_SKILLS.forEach(s => {
      if (!this.formData.commonSkills[s.id]) {
        this.formData.commonSkills[s.id] = 3;
      }
    });
    this.updateBranchSkillsState();
  },

  updateBranchSkillsState() {
    const skills = BRANCH_SKILLS_MAP[this.formData.branch] || BRANCH_SKILLS_MAP["Other"];
    skills.forEach(skillName => {
      if (!this.formData.branchSkills[skillName]) {
        this.formData.branchSkills[skillName] = 3;
      }
    });
  },

  bindGlobalEvents() {
    document.querySelectorAll("[data-nav]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.getAttribute("data-nav");
        if (target === "start") {
          this.startAssessment();
        } else {
          this.showView(target);
        }
      });
    });
  },

  renderStep(stepNum) {
    this.currentStep = stepNum;
    
    const stepLabels = [
      "About You",
      "Your College & Location",
      "Your Career Direction",
      "Your Common & Professional Skills",
      "Branch-Specific Technical Skills",
      "Projects & Practical Experience",
      "Internships & Placement Readiness",
      "AI & Emerging Technologies",
      "Challenges & Learning Goals",
      "Review & Complete Assessment"
    ];

    document.getElementById("step-title-badge").innerText = `Step ${stepNum}: ${stepLabels[stepNum - 1]}`;
    document.getElementById("step-count-text").innerText = `Step ${stepNum} of ${this.totalSteps}`;
    
    const progressPct = ((stepNum - 1) / (this.totalSteps - 1)) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progressPct}%`;

    const container = document.getElementById("wizard-step-content");
    container.innerHTML = this.getStepHtml(stepNum);

    this.attachStepEvents(stepNum);

    const backBtn = document.getElementById("wizard-back-btn");
    if (backBtn) {
      backBtn.style.visibility = stepNum === 1 ? "hidden" : "visible";
    }

    const nextBtn = document.getElementById("wizard-next-btn");
    if (nextBtn) {
      nextBtn.disabled = this.isSubmitting;
      nextBtn.innerText = stepNum === this.totalSteps ? "Get My Career Insights →" : "Continue →";
    }

    window.scrollTo({ top: 120, behavior: "smooth" });
  },

  getStepHtml(step) {
    switch (step) {
      case 1:
        return `
          <h2 class="step-heading">Student Information</h2>
          <p class="step-subtitle">Let's start with your contact details so we can generate your personalized snapshot.</p>
          
          <div class="form-group">
            <label class="form-label" for="inp-fullname">Full Name <span class="required-star">*</span></label>
            <input type="text" id="inp-fullname" class="form-control" placeholder="e.g. Rahul Sharma" value="${this.formData.fullName}">
            <div id="err-fullname" class="error-message" style="display:none;">Please complete this field before continuing.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-email">College / Personal Email <span class="required-star">*</span></label>
            <input type="email" id="inp-email" class="form-control" placeholder="e.g. rahul.sharma@example.com" value="${this.formData.email}">
            <div id="err-email" class="error-message" style="display:none;">Please enter a valid email address.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-mobile">Mobile Number <span class="required-star">*</span></label>
            <input type="tel" id="inp-mobile" class="form-control" placeholder="e.g. 9848012345 (10 digits)" value="${this.formData.mobile}">
            <div id="err-mobile" class="error-message" style="display:none;">Please enter a valid 10-digit Indian mobile number.</div>
          </div>

          <div class="form-group">
            <label class="form-label">Gender <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Male", "Female", "Prefer not to say", "Other"].map(g => `
                <label class="option-card ${this.formData.gender === g ? 'selected' : ''}">
                  <input type="radio" name="gender" value="${g}" ${this.formData.gender === g ? 'checked' : ''}>
                  <span class="option-label">${g}</span>
                </label>
              `).join("")}
            </div>
            <div id="err-gender" class="error-message" style="display:none;">Please select an option to continue.</div>
          </div>
        `;

      case 2:
        return `
          <h2 class="step-heading">College & Geographic Location</h2>
          <p class="step-subtitle">This helps us discover student needs at the college and regional level.</p>

          <div class="form-group">
            <label class="form-label" for="sel-state">State <span class="required-star">*</span></label>
            <select id="sel-state" class="form-control">
              ${INDIAN_STATES.map(st => `<option value="${st}" ${this.formData.state === st ? 'selected' : ''}>${st}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="sel-district">College District <span class="required-star">*</span></label>
            <select id="sel-district" class="form-control">
              ${AP_DISTRICTS.map(d => `<option value="${d}" ${this.formData.district === d ? 'selected' : ''}>${d}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="inp-city">College City / Town <span class="required-star">*</span></label>
            <input type="text" id="inp-city" class="form-control" placeholder="e.g. Guntur, Visakhapatnam, Vijayawada" value="${this.formData.city}">
            <div id="err-city" class="error-message" style="display:none;">Please complete this field before continuing.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="sel-college">College Name <span class="required-star">*</span></label>
            <select id="sel-college" class="form-control">
              <option value="">-- Select Your College --</option>
              ${POPULAR_COLLEGES.map(c => `<option value="${c}" ${this.formData.collegeName === c ? 'selected' : ''}>${c}</option>`).join("")}
            </select>
            <div id="err-college" class="error-message" style="display:none;">Please select an option to continue.</div>
          </div>

          <div id="wrapper-other-college" class="form-group" style="${this.formData.collegeName === 'Other College' ? 'display:block;' : 'display:none;'}">
            <label class="form-label" for="inp-other-college">Enter College Name <span class="required-star">*</span></label>
            <input type="text" id="inp-other-college" class="form-control" placeholder="Enter full name of your college" value="${this.formData.otherCollegeName}">
            <div id="err-other-college" class="error-message" style="display:none;">Please enter your college name.</div>
          </div>

          <div class="form-group">
            <label class="form-label">Area Type <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Urban", "Semi-Urban", "Rural"].map(at => `
                <label class="option-card ${this.formData.areaType === at ? 'selected' : ''}">
                  <input type="radio" name="areaType" value="${at}" ${this.formData.areaType === at ? 'checked' : ''}>
                  <span class="option-label">${at}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">College Type <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Government", "Government Aided", "Private", "Deemed University", "University", "Other"].map(ct => `
                <label class="option-card ${this.formData.collegeType === ct ? 'selected' : ''}">
                  <input type="radio" name="collegeType" value="${ct}" ${this.formData.collegeType === ct ? 'checked' : ''}>
                  <span class="option-label">${ct}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `;

      case 3:
        const branches = Object.keys(BRANCH_SKILLS_MAP);
        return `
          <h2 class="step-heading">B.Tech Academic & Career Ambition</h2>
          <p class="step-subtitle">Where do you want your B.Tech journey to take you?</p>

          <div class="form-group">
            <label class="form-label" for="sel-branch">Branch of Engineering <span class="required-star">*</span></label>
            <select id="sel-branch" class="form-control">
              ${branches.map(b => `<option value="${b}" ${this.formData.branch === b ? 'selected' : ''}>${b}</option>`).join("")}
            </select>
          </div>

          <div id="wrapper-other-branch" class="form-group" style="${this.formData.branch === 'Other' ? 'display:block;' : 'display:none;'}">
            <label class="form-label" for="inp-other-branch">Enter Branch Name <span class="required-star">*</span></label>
            <input type="text" id="inp-other-branch" class="form-control" placeholder="e.g. Aerospace Engineering" value="${this.formData.otherBranchName}">
            <div id="err-other-branch" class="error-message" style="display:none;">Please enter your branch name.</div>
          </div>

          <div class="analytics-grid-2">
            <div class="form-group">
              <label class="form-label">Current Year <span class="required-star">*</span></label>
              <select id="sel-year" class="form-control">
                ${["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => `<option value="${y}" ${this.formData.year === y ? 'selected' : ''}>${y}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Current Semester <span class="required-star">*</span></label>
              <select id="sel-semester" class="form-control">
                ${["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"].map(sem => `<option value="${sem}" ${this.formData.semester === sem ? 'selected' : ''}>${sem}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Academic Aggregate Performance <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Below 60%", "60–69%", "70–79%", "80–89%", "90%+"].map(p => `
                <label class="option-card ${this.formData.academicPerformance === p ? 'selected' : ''}">
                  <input type="radio" name="academicPerformance" value="${p}" ${this.formData.academicPerformance === p ? 'checked' : ''}>
                  <span class="option-label">${p}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Where Do You Want Your B.Tech To Take You? (Primary Career Goal) <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Software / IT", "Core Engineering", "Government Jobs", "Higher Studies", "Research", "Startup / Entrepreneurship", "Freelancing", "Business", "Teaching", "Not Sure Yet"].map(cg => `
                <label class="option-card ${this.formData.careerGoal === cg ? 'selected' : ''}">
                  <input type="radio" name="careerGoal" value="${cg}" ${this.formData.careerGoal === cg ? 'checked' : ''}>
                  <span class="option-label">${cg}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">How Clear Are You About Your Career Direction? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Very Clear", "Mostly Clear", "Somewhat Clear", "Not Clear", "Completely Unsure"].map(cc => `
                <label class="option-card ${this.formData.careerClarity === cc ? 'selected' : ''}">
                  <input type="radio" name="careerClarity" value="${cc}" ${this.formData.careerClarity === cc ? 'checked' : ''}>
                  <span class="option-label">${cc}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div id="wrapper-unclear" class="form-group" style="${this.formData.careerGoal === 'Not Sure Yet' ? 'display:block;' : 'display:none;'}">
            <label class="form-label" for="inp-unclear">What factor causes the most confusion about your direction? <span class="required-star">*</span></label>
            <input type="text" id="inp-unclear" class="form-control" placeholder="e.g. Exploring between MS abroad and campus software placement" value="${this.formData.unclearReason || ''}">
            <div id="err-unclear" class="error-message" style="display:none;">Please complete this field before continuing.</div>
          </div>
        `;

      case 4:
        return `
          <h2 class="step-heading">Common & Professional Skills</h2>
          <p class="step-subtitle">Rate yourself objectively from <strong>1 (Beginner)</strong> to <strong>5 (Strong)</strong> across core engineering competencies.</p>

          <div class="rating-list">
            ${COMMON_SKILLS.map(sk => {
              const currentVal = this.formData.commonSkills[sk.id] || 3;
              return `
                <div class="rating-item-card">
                  <div class="rating-item-header">
                    <div>
                      <div class="rating-item-name">${sk.name}</div>
                      <div class="rating-item-desc">${sk.desc}</div>
                    </div>
                    <span class="badge badge-blue">Rating: ${currentVal}/5</span>
                  </div>
                  <div class="rating-pills" data-skill-type="common" data-skill-id="${sk.id}">
                    ${[1, 2, 3, 4, 5].map(val => `
                      <div class="rating-pill ${currentVal === val ? 'selected' : ''}" data-val="${val}">
                        ${val}
                      </div>
                    `).join("")}
                  </div>
                  <div class="rating-labels-legend">
                    <span>1 (Beginner)</span>
                    <span>3 (Moderate)</span>
                    <span>5 (Mastery)</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `;

      case 5:
        const currentBranchSkills = BRANCH_SKILLS_MAP[this.formData.branch] || BRANCH_SKILLS_MAP["Other"];
        return `
          <h2 class="step-heading">Branch-Specific Technical Skills</h2>
          <p class="step-subtitle">Tailored specifically for <strong>${this.formData.branch}</strong>. Rate your familiarity and hands-on comfort level (1 to 5).</p>

          <div class="rating-list">
            ${currentBranchSkills.map((skName) => {
              const currentVal = this.formData.branchSkills[skName] || 3;
              return `
                <div class="rating-item-card">
                  <div class="rating-item-header">
                    <div class="rating-item-name">${skName}</div>
                    <span class="badge badge-purple">Rating: ${currentVal}/5</span>
                  </div>
                  <div class="rating-pills" data-skill-type="branch" data-skill-id="${skName}">
                    ${[1, 2, 3, 4, 5].map(val => `
                      <div class="rating-pill ${currentVal === val ? 'selected' : ''}" data-val="${val}">
                        ${val}
                      </div>
                    `).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `;

      case 6:
        return `
          <h2 class="step-heading">Projects & Practical Experience</h2>
          <p class="step-subtitle">Practical hands-on implementation is the single biggest differentiator for engineering careers.</p>

          <div class="form-group">
            <label class="form-label">How many meaningful projects have you completed? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["None", "1", "2", "3", "4+"].map(c => `
                <label class="option-card ${this.formData.projectsCount === c ? 'selected' : ''}">
                  <input type="radio" name="projectsCount" value="${c}" ${this.formData.projectsCount === c ? 'checked' : ''}>
                  <span class="option-label">${c}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Have you completed a real-world project (beyond textbook lab exercises)? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Yes", "No", "Currently working on one"].map(rw => `
                <label class="option-card ${this.formData.realWorldProject === rw ? 'selected' : ''}">
                  <input type="radio" name="realWorldProject" value="${rw}" ${this.formData.realWorldProject === rw ? 'checked' : ''}>
                  <span class="option-label">${rw}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">How confident are you explaining your project architecture & technical decisions? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Very Confident", "Confident", "Somewhat Confident", "Not Confident"].map(conf => `
                <label class="option-card ${this.formData.projectExplanationConfidence === conf ? 'selected' : ''}">
                  <input type="radio" name="projectExplanationConfidence" value="${conf}" ${this.formData.projectExplanationConfidence === conf ? 'checked' : ''}>
                  <span class="option-label">${conf}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Do you have an active GitHub profile, personal website, or project portfolio? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Yes", "No", "Planning to create one"].map(pf => `
                <label class="option-card ${this.formData.hasPortfolio === pf ? 'selected' : ''}">
                  <input type="radio" name="hasPortfolio" value="${pf}" ${this.formData.hasPortfolio === pf ? 'checked' : ''}>
                  <span class="option-label">${pf}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `;

      case 7:
        const showCoding = this.formData.careerGoal === "Software / IT" || this.formData.branch.includes("Computer") || this.formData.branch.includes("Data") || this.formData.branch.includes("AI");
        return `
          <h2 class="step-heading">Internships & Placement Readiness</h2>
          <p class="step-subtitle">How ready are you for corporate hiring, interviews, and the real world?</p>

          <div class="form-group">
            <label class="form-label">Have you completed an internship? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Yes", "No", "Currently doing one"].map(intp => `
                <label class="option-card ${this.formData.hasInternship === intp ? 'selected' : ''}">
                  <input type="radio" name="hasInternship" value="${intp}" ${this.formData.hasInternship === intp ? 'checked' : ''}>
                  <span class="option-label">${intp}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div id="wrapper-internship-details" style="${this.formData.hasInternship === 'Yes' || this.formData.hasInternship === 'Currently doing one' ? 'display:block;' : 'display:none;'}">
            <div class="analytics-grid-2">
              <div class="form-group">
                <label class="form-label" for="inp-intern-domain">Internship Domain <span class="required-star">*</span></label>
                <input type="text" id="inp-intern-domain" class="form-control" placeholder="e.g. Web Dev, VLSI, Embedded Systems" value="${this.formData.internshipDomain || ''}">
                <div id="err-intern-domain" class="error-message" style="display:none;">Please complete this field before continuing.</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="inp-intern-duration">Duration <span class="required-star">*</span></label>
                <input type="text" id="inp-intern-duration" class="form-control" placeholder="e.g. 2 Months, 6 Weeks" value="${this.formData.internshipDuration || ''}">
                <div id="err-intern-duration" class="error-message" style="display:none;">Please complete this field before continuing.</div>
              </div>
            </div>

            <div class="analytics-grid-2">
              <div class="form-group">
                <label class="form-label">Paid / Unpaid <span class="required-star">*</span></label>
                <div class="options-grid">
                  ${["Paid", "Unpaid"].map(tp => `
                    <label class="option-card ${this.formData.internshipType === tp ? 'selected' : ''}">
                      <input type="radio" name="internshipType" value="${tp}" ${this.formData.internshipType === tp ? 'checked' : ''}>
                      <span class="option-label">${tp}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Relevant to your career goal? <span class="required-star">*</span></label>
                <div class="options-grid">
                  ${["Yes", "Partially", "No"].map(rel => `
                    <label class="option-card ${this.formData.internshipRelevant === rel ? 'selected' : ''}">
                      <input type="radio" name="internshipRelevant" value="${rel}" ${this.formData.internshipRelevant === rel ? 'checked' : ''}>
                      <span class="option-label">${rel}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Resume Status <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Ready", "Needs Improvement", "Not Created"].map(r => `
                <label class="option-card ${this.formData.resumeReadiness === r ? 'selected' : ''}">
                  <input type="radio" name="resumeReadiness" value="${r}" ${this.formData.resumeReadiness === r ? 'checked' : ''}>
                  <span class="option-label">${r}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Quantitative Aptitude Readiness <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Strong", "Good", "Average", "Weak", "Not Started"].map(apt => `
                <label class="option-card ${this.formData.aptitudeReadiness === apt ? 'selected' : ''}">
                  <input type="radio" name="aptitudeReadiness" value="${apt}" ${this.formData.aptitudeReadiness === apt ? 'checked' : ''}>
                  <span class="option-label">${apt}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Technical Interview Readiness <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Strong", "Good", "Average", "Weak", "Not Started"].map(ti => `
                <label class="option-card ${this.formData.technicalInterviewReadiness === ti ? 'selected' : ''}">
                  <input type="radio" name="technicalInterviewReadiness" value="${ti}" ${this.formData.technicalInterviewReadiness === ti ? 'checked' : ''}>
                  <span class="option-label">${ti}</span>
                </label>
              `).join("")}
            </div>
          </div>

          ${showCoding ? `
            <div class="form-group">
              <label class="form-label">Coding & Online Test Readiness (DSA / Competitive Coding) <span class="required-star">*</span></label>
              <div class="options-grid">
                ${["Strong", "Good", "Average", "Weak", "Not Started"].map(cr => `
                  <label class="option-card ${this.formData.codingReadiness === cr ? 'selected' : ''}">
                    <input type="radio" name="codingReadiness" value="${cr}" ${this.formData.codingReadiness === cr ? 'checked' : ''}>
                    <span class="option-label">${cr}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">HR / Behavioral Interview Readiness <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Strong", "Good", "Average", "Weak", "Not Started"].map(hr => `
                <label class="option-card ${this.formData.hrInterviewReadiness === hr ? 'selected' : ''}">
                  <input type="radio" name="hrInterviewReadiness" value="${hr}" ${this.formData.hrInterviewReadiness === hr ? 'checked' : ''}>
                  <span class="option-label">${hr}</span>
                </label>
              `).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mock Interview Experience <span class="required-star">*</span></label>
            <div class="options-grid">
              ${["Multiple", "1–2", "Never"].map(mi => `
                <label class="option-card ${this.formData.mockInterviews === mi ? 'selected' : ''}">
                  <input type="radio" name="mockInterviews" value="${mi}" ${this.formData.mockInterviews === mi ? 'checked' : ''}>
                  <span class="option-label">${mi}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `;

      case 8:
        return `
          <h2 class="step-heading">AI & Emerging Technologies</h2>
          <p class="step-subtitle">How are you leveraging next-generation digital tools to accelerate your engineering journey?</p>

          <div class="form-group">
            <label class="form-label">How are you currently using AI tools (ChatGPT, Copilot, Perplexity, Claude, etc.)? <span class="required-star">*</span></label>
            <p class="form-helper">Select all that apply.</p>
            <div class="options-grid">
              ${["Learning", "Coding", "Projects", "Research", "Resume", "Content Creation", "Other", "Not using AI yet"].map(use => `
                <label class="option-card ${this.formData.aiUsage.includes(use) ? 'selected' : ''}">
                  <input type="checkbox" name="aiUsage" value="${use}" ${this.formData.aiUsage.includes(use) ? 'checked' : ''}>
                  <span class="option-label">${use}</span>
                </label>
              `).join("")}
            </div>
            <div id="err-ai-usage" class="error-message" style="display:none;">Please select an option to continue.</div>
          </div>

          <div class="form-group">
            <label class="form-label">How confident are you using AI tools responsibly for learning and real work? <span class="required-star">*</span></label>
            <div class="rating-item-card">
              <div class="rating-item-header">
                <div class="rating-item-name">AI Workflow & Prompting Confidence</div>
                <span class="badge badge-emerald">Rating: ${this.formData.aiConfidence}/5</span>
              </div>
              <div class="rating-pills" id="ai-conf-pills">
                ${[1, 2, 3, 4, 5].map(v => `
                  <div class="rating-pill ${this.formData.aiConfidence === v ? 'selected' : ''}" data-val="${v}">
                    ${v}
                  </div>
                `).join("")}
              </div>
              <div class="rating-labels-legend">
                <span>1 (Beginner)</span>
                <span>3 (Moderate)</span>
                <span>5 (Advanced Workflow)</span>
              </div>
            </div>
          </div>
        `;

      case 9:
        return `
          <h2 class="step-heading">Your Challenges & 6-Month Goals</h2>
          <p class="step-subtitle">Honest self-awareness is the crucial bridge between aspiration and achievement.</p>

          <div class="form-group">
            <label class="form-label">What is currently holding you back? (Biggest Challenges) <span class="required-star">*</span></label>
            <p class="form-helper">Select all that apply.</p>
            <div class="options-grid">
              ${[
                "Lack of technical skills", "Communication", "Confidence", "Lack of projects",
                "No internship", "Career confusion", "Lack of guidance", "Placement preparation",
                "Aptitude", "Interview skills", "Time management", "Financial limitations",
                "Lack of practical exposure", "Other"
              ].map(ch => `
                <label class="option-card ${this.formData.challenges.includes(ch) ? 'selected' : ''}">
                  <input type="checkbox" name="challenges" value="${ch}" ${this.formData.challenges.includes(ch) ? 'checked' : ''}>
                  <span class="option-label">${ch}</span>
                </label>
              `).join("")}
            </div>
            <div id="err-challenges" class="error-message" style="display:none;">Please select an option to continue.</div>
          </div>

          <div class="form-group">
            <label class="form-label">Preferred Learning Modes <span class="required-star">*</span></label>
            <p class="form-helper">Select all that match your style.</p>
            <div class="options-grid">
              ${[
                "Live classes", "Video courses", "One-to-one mentoring", "Projects",
                "Self-learning", "Workshops", "Bootcamps", "Assignments", "Group learning"
              ].map(lp => `
                <label class="option-card ${this.formData.learningPreferences.includes(lp) ? 'selected' : ''}">
                  <input type="checkbox" name="learningPreferences" value="${lp}" ${this.formData.learningPreferences.includes(lp) ? 'checked' : ''}>
                  <span class="option-label">${lp}</span>
                </label>
              `).join("")}
            </div>
            <div id="err-learning" class="error-message" style="display:none;">Please select an option to continue.</div>
          </div>

          <div class="form-group">
            <label class="form-label">If you could improve ONE thing in the next 6 months, what would it be? <span class="required-star">*</span></label>
            <div class="options-grid">
              ${[
                "Technical Skills", "Communication", "Confidence", "Projects",
                "Internship", "Interview Skills", "Aptitude", "Career Clarity",
                "Leadership", "AI Skills", "Other"
              ].map(goal => `
                <label class="option-card ${this.formData.sixMonthGoal === goal ? 'selected' : ''}">
                  <input type="radio" name="sixMonthGoal" value="${goal}" ${this.formData.sixMonthGoal === goal ? 'checked' : ''}>
                  <span class="option-label">${goal}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `;

      case 10:
        return `
          <div style="text-align:center; padding: 20px 0;">
            <div style="font-size: 3rem; margin-bottom: 12px;">🚀</div>
            <h2 class="step-heading" style="font-size: 2.2rem;">Almost There!</h2>
            <p class="step-subtitle" style="font-size: 1.1rem; max-width: 600px; margin: 0 auto 32px;">
              Your answers will help us understand where you are today and what you should focus on next.
            </p>
          </div>

          <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 1.15rem; margin-bottom: 16px; color: #93c5fd;">Summary of Your Profile</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; font-size: 0.9rem;">
              <div><span style="color:var(--text-dim)">Student:</span> <strong>${this.formData.fullName}</strong></div>
              <div><span style="color:var(--text-dim)">College:</span> <strong>${this.formData.collegeName === 'Other College' ? this.formData.otherCollegeName : this.formData.collegeName}</strong></div>
              <div><span style="color:var(--text-dim)">Branch:</span> <strong>${this.formData.branch} (${this.formData.year})</strong></div>
              <div><span style="color:var(--text-dim)">Career Target:</span> <strong>${this.formData.careerGoal}</strong></div>
              <div><span style="color:var(--text-dim)">6-Month Priority:</span> <strong>${this.formData.sixMonthGoal}</strong></div>
            </div>
          </div>

          <div style="padding: 16px; background: rgba(59, 130, 246, 0.08); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2); margin-bottom: 24px;">
            <div style="font-size: 0.85rem; color: #94a3b8; display: flex; gap: 10px; align-items: flex-start;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" style="flex-shrink:0;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span><strong>Data Privacy Notice:</strong> Your responses are collected for career assessment and aggregate educational insights to assist college development. Individual profiles are kept private.</span>
            </div>
          </div>
        `;
    }
  },

  attachStepEvents(step) {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        const name = e.target.name;
        this.formData[name] = e.target.value;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
          const card = r.closest(".option-card");
          if (card) card.classList.toggle("selected", r.checked);
        });

        if (name === "careerGoal") {
          const wrapper = document.getElementById("wrapper-unclear");
          if (wrapper) wrapper.style.display = e.target.value === "Not Sure Yet" ? "block" : "none";
        }
        if (name === "hasInternship") {
          const wrapper = document.getElementById("wrapper-internship-details");
          if (wrapper) wrapper.style.display = (e.target.value === "Yes" || e.target.value === "Currently doing one") ? "block" : "none";
        }
      });
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
      box.addEventListener("change", (e) => {
        const name = e.target.name;
        const val = e.target.value;
        const card = box.closest(".option-card");
        if (card) card.classList.toggle("selected", box.checked);

        if (!Array.isArray(this.formData[name])) {
          this.formData[name] = [];
        }

        if (box.checked) {
          if (val === "Not using AI yet" && name === "aiUsage") {
            this.formData.aiUsage = ["Not using AI yet"];
            document.querySelectorAll('input[name="aiUsage"]').forEach(other => {
              if (other.value !== "Not using AI yet") {
                other.checked = false;
                other.closest(".option-card")?.classList.remove("selected");
              }
            });
          } else {
            if (name === "aiUsage") {
              const noneBox = document.querySelector('input[name="aiUsage"][value="Not using AI yet"]');
              if (noneBox && noneBox.checked) {
                noneBox.checked = false;
                noneBox.closest(".option-card")?.classList.remove("selected");
                this.formData.aiUsage = this.formData.aiUsage.filter(x => x !== "Not using AI yet");
              }
            }
            if (!this.formData[name].includes(val)) {
              this.formData[name].push(val);
            }
          }
        } else {
          this.formData[name] = this.formData[name].filter(x => x !== val);
        }
      });
    });

    document.querySelectorAll(".rating-pills").forEach(group => {
      const type = group.getAttribute("data-skill-type");
      const skillId = group.getAttribute("data-skill-id");

      group.querySelectorAll(".rating-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          const val = Number(pill.getAttribute("data-val"));
          group.querySelectorAll(".rating-pill").forEach(p => p.classList.remove("selected"));
          pill.classList.add("selected");

          if (type === "common") {
            this.formData.commonSkills[skillId] = val;
            const badge = pill.closest(".rating-item-card").querySelector(".badge");
            if (badge) badge.innerText = `Rating: ${val}/5`;
          } else if (type === "branch") {
            this.formData.branchSkills[skillId] = val;
            const badge = pill.closest(".rating-item-card").querySelector(".badge");
            if (badge) badge.innerText = `Rating: ${val}/5`;
          }
        });
      });
    });

    const aiPills = document.getElementById("ai-conf-pills");
    if (aiPills) {
      aiPills.querySelectorAll(".rating-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          const val = Number(pill.getAttribute("data-val"));
          aiPills.querySelectorAll(".rating-pill").forEach(p => p.classList.remove("selected"));
          pill.classList.add("selected");
          this.formData.aiConfidence = val;
          const badge = pill.closest(".rating-item-card").querySelector(".badge");
          if (badge) badge.innerText = `Rating: ${val}/5`;
        });
      });
    }

    const collegeSelect = document.getElementById("sel-college");
    if (collegeSelect) {
      collegeSelect.addEventListener("change", (e) => {
        this.formData.collegeName = e.target.value;
        const otherWrap = document.getElementById("wrapper-other-college");
        if (otherWrap) {
          otherWrap.style.display = e.target.value === "Other College" ? "block" : "none";
        }
      });
    }

    const branchSelect = document.getElementById("sel-branch");
    if (branchSelect) {
      branchSelect.addEventListener("change", (e) => {
        this.formData.branch = e.target.value;
        this.updateBranchSkillsState();
        const otherBranchWrap = document.getElementById("wrapper-other-branch");
        if (otherBranchWrap) {
          otherBranchWrap.style.display = e.target.value === "Other" ? "block" : "none";
        }
      });
    }
  },

  validateCurrentStep() {
    let isValid = true;
    const hideErr = (id) => { const el = document.getElementById(id); if (el) el.style.display = "none"; };
    const showErr = (id) => { const el = document.getElementById(id); if (el) el.style.display = "flex"; isValid = false; };

    switch (this.currentStep) {
      case 1:
        const nameInp = document.getElementById("inp-fullname");
        this.formData.fullName = nameInp ? nameInp.value.trim() : "";
        if (!this.formData.fullName) showErr("err-fullname"); else hideErr("err-fullname");

        const emailInp = document.getElementById("inp-email");
        this.formData.email = emailInp ? emailInp.value.trim() : "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.formData.email || !emailRegex.test(this.formData.email)) showErr("err-email"); else hideErr("err-email");

        const mobileInp = document.getElementById("inp-mobile");
        this.formData.mobile = mobileInp ? mobileInp.value.trim().replace(/\D/g, '') : "";
        if (!this.formData.mobile || this.formData.mobile.length !== 10) showErr("err-mobile"); else hideErr("err-mobile");

        if (!this.formData.gender) showErr("err-gender"); else hideErr("err-gender");
        break;

      case 2:
        const stateSel = document.getElementById("sel-state");
        if (stateSel) this.formData.state = stateSel.value;

        const distSel = document.getElementById("sel-district");
        if (distSel) this.formData.district = distSel.value;

        const cityInp = document.getElementById("inp-city");
        this.formData.city = cityInp ? cityInp.value.trim() : "";
        if (!this.formData.city) showErr("err-city"); else hideErr("err-city");

        const colSel = document.getElementById("sel-college");
        this.formData.collegeName = colSel ? colSel.value : "";
        if (!this.formData.collegeName) showErr("err-college"); else hideErr("err-college");

        if (this.formData.collegeName === "Other College") {
          const otherColInp = document.getElementById("inp-other-college");
          this.formData.otherCollegeName = otherColInp ? otherColInp.value.trim() : "";
          if (!this.formData.otherCollegeName) showErr("err-other-college"); else hideErr("err-other-college");
        }
        break;

      case 3:
        const bSel = document.getElementById("sel-branch");
        if (bSel) this.formData.branch = bSel.value;

        if (this.formData.branch === "Other") {
          const obInp = document.getElementById("inp-other-branch");
          this.formData.otherBranchName = obInp ? obInp.value.trim() : "";
          if (!this.formData.otherBranchName) showErr("err-other-branch"); else hideErr("err-other-branch");
        }

        const ySel = document.getElementById("sel-year");
        if (ySel) this.formData.year = ySel.value;

        const sSel = document.getElementById("sel-semester");
        if (sSel) this.formData.semester = sSel.value;

        if (this.formData.careerGoal === "Not Sure Yet") {
          const uncInp = document.getElementById("inp-unclear");
          this.formData.unclearReason = uncInp ? uncInp.value.trim() : "";
          if (!this.formData.unclearReason) showErr("err-unclear"); else hideErr("err-unclear");
        }
        break;

      case 7:
        if (this.formData.hasInternship === "Yes" || this.formData.hasInternship === "Currently doing one") {
          const domInp = document.getElementById("inp-intern-domain");
          this.formData.internshipDomain = domInp ? domInp.value.trim() : "";
          if (!this.formData.internshipDomain) showErr("err-intern-domain"); else hideErr("err-intern-domain");

          const durInp = document.getElementById("inp-intern-duration");
          this.formData.internshipDuration = durInp ? durInp.value.trim() : "";
          if (!this.formData.internshipDuration) showErr("err-intern-duration"); else hideErr("err-intern-duration");
        }
        break;

      case 8:
        if (!this.formData.aiUsage || this.formData.aiUsage.length === 0) showErr("err-ai-usage"); else hideErr("err-ai-usage");
        break;

      case 9:
        if (!this.formData.challenges || this.formData.challenges.length === 0) showErr("err-challenges"); else hideErr("err-challenges");
        if (!this.formData.learningPreferences || this.formData.learningPreferences.length === 0) showErr("err-learning"); else hideErr("err-learning");
        break;
    }

    if (!isValid) {
      this.showToast("Please complete this field before continuing.", "error");
    }

    return isValid;
  },

  nextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.renderStep(this.currentStep + 1);
    } else {
      this.submitAssessment();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.renderStep(this.currentStep - 1);
    }
  },

  /**
   * Complete Survey Submission Pipeline:
   * 1. Validate required fields
   * 2. Calculate assessment scores
   * 3. Generate strengths, focus areas, and dynamic recommendations
   * 4. Submit to Google Apps Script Web App
   * 5. Disable submit button to prevent double submissions
   * 6. Show result only on success; on error show friendly alert without losing student answers
   */
  async submitAssessment() {
    if (this.isSubmitting) return;

    const nextBtn = document.getElementById("wizard-next-btn");
    const originalText = nextBtn ? nextBtn.innerText : "Get My Career Insights →";

    try {
      this.isSubmitting = true;
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.innerText = "Saving your assessment... ⏳";
      }

      // Step 1: Run Core Analytics Engine
      const assessmentResult = AssessmentEngine.analyze(this.formData);

      // Step 2: Generate Response ID
      const responseId = GoogleFormService.generateResponseId();

      // Step 3: Submit to Google Form → Private Google Sheet
      const response = await GoogleFormService.submitResponse(this.formData, assessmentResult, responseId);

      this.showToast("Assessment submitted successfully!", "info");

      // Step 4: Render Final Result Page using local payload (built inside submitResponse)
      const localPayload = GoogleFormService._buildPayload(this.formData, assessmentResult, responseId);
      this.renderStudentResult(localPayload, response.responseId || responseId);
      this.showView("result-view");

    } catch (err) {
      console.error("Submission failed:", err);
      // Student answers are preserved in memory — show friendly retry message
      this.showToast("Submission failed. Your answers have been preserved. Please try again.", "error");
    } finally {
      this.isSubmitting = false;
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.innerText = originalText;
      }
    }
  },

  renderStudentResult(record, responseId) {
    const s = record.student;
    const ac = record.academic;
    const col = record.college;
    const a = record.assessment;
    const scores = a.scores;

    const container = document.getElementById("student-result-container");
    if (!container) return;

    container.innerHTML = `
      <div class="result-header-card glass-panel">
        <div class="result-header-content">
          <div style="display:flex; justify-content:center; gap: 8px; flex-wrap:wrap; margin-bottom: 12px;">
            <div class="badge badge-emerald">Assessment Complete</div>
            <div class="badge badge-blue">Assessment ID: ${responseId}</div>
          </div>
          <h1 style="font-size: 2.2rem; margin-bottom: 6px;">${s.fullName}'s B.Tech Career Snapshot</h1>
          <p style="color: var(--text-muted); font-size: 1rem;">
            ${ac.branch} • ${ac.year} • ${col.name}
          </p>

          <div class="score-circle-wrapper">
            <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; transform: rotate(-90deg);">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"></circle>
              <circle cx="50" cy="50" r="42" fill="none" stroke="${a.readinessLevel.color}" stroke-width="8"
                stroke-dasharray="264" stroke-dashoffset="${264 - (264 * a.overallIndex) / 100}" stroke-linecap="round"></circle>
            </svg>
            <div style="position: absolute; text-align: center;">
              <div class="score-number">${a.overallIndex}</div>
              <div class="score-label">Readiness Index</div>
            </div>
          </div>

          <div style="display: inline-block; padding: 6px 16px; border-radius: 99px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass);">
            <strong style="color: ${a.readinessLevel.color};">${a.readinessLevel.label}</strong>
          </div>
        </div>
      </div>

      <!-- 8-Dimensional Competency Breakdown -->
      <h3 style="font-size: 1.3rem; margin-bottom: 18px; color: #fff;">📊 Comprehensive Readiness Breakdown</h3>
      <div class="radar-grid">
        ${[
          { label: "Technical Competency", val: scores.technicalReadiness },
          { label: "Practical Experience", val: scores.practicalExperience },
          { label: "Placement Readiness", val: scores.placementReadiness },
          { label: "Communication & Articulation", val: scores.communicationReadiness },
          { label: "Interview Readiness", val: scores.interviewReadiness },
          { label: "Career Direction Clarity", val: scores.careerClarity },
          { label: "Industry & Internship Exposure", val: scores.industryExposure },
          { label: "Modern AI & Tool Fluency", val: scores.aiReadiness }
        ].map(item => `
          <div class="dim-card glass-panel">
            <div class="dim-card-header">
              <span class="dim-card-title">${item.label}</span>
              <span class="dim-card-value">${item.val}%</span>
            </div>
            <div class="dim-bar-bg">
              <div class="dim-bar-fill" style="width: ${item.val}%;"></div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Strengths & Focus Areas Side-by-Side -->
      <div class="analytics-grid-2" style="margin-bottom: 32px;">
        <div class="glass-panel" style="padding: 28px;">
          <h3 style="font-size: 1.2rem; color: #6ee7b7; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🌟</span> Your Top Strengths
          </h3>
          ${a.strengths.map(st => `
            <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-glass-subtle);">
              <h4 style="font-size: 1rem; color: #fff; margin-bottom: 4px;">${st.title}</h4>
              <p style="font-size: 0.88rem; color: #cbd5e1;">${st.desc}</p>
            </div>
          `).join("")}
        </div>

        <div class="glass-panel" style="padding: 28px;">
          <h3 style="font-size: 1.2rem; color: #fde047; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🎯</span> Areas to Concentrate On
          </h3>
          ${a.focusAreas.map(fa => `
            <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-glass-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <h4 style="font-size: 1rem; color: #fff;">${fa.title}</h4>
                <span class="need-tag ${fa.needLevel.includes('High') ? 'need-high' : 'need-medium'}">${fa.needLevel}</span>
              </div>
              <p style="font-size: 0.88rem; color: #cbd5e1;">${fa.summary}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Recommended Next Steps -->
      <div class="glass-panel" style="padding: 32px; margin-bottom: 32px;">
        <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: #93c5fd;">🚀 Personalized 90-Day Action Roadmap</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">Configurable milestones generated for your target of <strong>${record.career.primaryGoal}</strong>.</p>
        
        <div>
          ${record.recommendations.map(r => `
            <div class="rec-step-card glass-panel">
              <div class="rec-step-num">${r.step}</div>
              <div class="rec-step-content">
                <h4>${r.title}</h4>
                <p>${r.description}</p>
                <div class="rec-meta">
                  <span>⏱️ <strong>Timeline:</strong> ${r.timeline}</span>
                  <span>💡 <strong>Target Outcome:</strong> ${r.impact}</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 40px;">
        <button class="btn btn-primary btn-lg" onclick="window.print()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print / Save PDF Snapshot
        </button>
        <button class="btn btn-secondary btn-lg" onclick="App.showView('dashboard-view')">
          View College Intelligence Dashboard →
        </button>
      </div>
    `;
  },

  // ---------------- COLLEGE ANALYTICS DASHBOARD ----------------

  async renderDashboard() {
    const filters = this.getDashboardFilters();
    const data = AnalyticsService.getAggregateData(filters);

    this.populateFilterDropdowns();

    // Check if empty dataset
    const emptyNotice = document.getElementById("dash-empty-notice");
    const contentArea = document.getElementById("dash-content-area");

    if (data.totalStudents === 0) {
      if (emptyNotice) {
        emptyNotice.style.display = "block";
        emptyNotice.innerHTML = `
          <div class="glass-panel" style="padding: 40px; text-align: center; margin-bottom: 32px;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">📊</div>
            <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 8px;">No assessment data available yet.</h3>
            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 20px;">
              No student submissions found matching the selected criteria. Once real survey responses are recorded into Google Sheets, institutional intelligence will compute automatically.
            </p>
            <button class="btn btn-primary btn-sm" data-nav="start">Take the First Assessment →</button>
          </div>
        `;
      }
      if (contentArea) contentArea.style.display = "none";
      return;
    } else {
      if (emptyNotice) emptyNotice.style.display = "none";
      if (contentArea) contentArea.style.display = "block";
    }

    // Render KPIs
    document.getElementById("kpi-total-students").innerText = data.totalStudents;
    document.getElementById("kpi-avg-readiness").innerText = `${data.averages.overall}/100`;
    document.getElementById("kpi-internship-rate").innerText = `${data.metrics.internshipPct}%`;
    document.getElementById("kpi-projects-rate").innerText = `${data.metrics.projects2PlusPct}%`;

    // Render Development Heatmap Table
    const heatmapBody = document.getElementById("heatmap-table-body");
    if (heatmapBody) {
      heatmapBody.innerHTML = data.developmentAreas.map(item => `
        <tr>
          <td><strong>${item.area}</strong></td>
          <td>
            <span class="need-tag ${item.needLevel === 'High' ? 'need-high' : item.needLevel === 'Medium' ? 'need-medium' : 'need-low'}">
              ${item.needLevel} Development Need
            </span>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="dim-bar-bg" style="width: 100px;">
                <div class="dim-bar-fill" style="width: ${item.score}%;"></div>
              </div>
              <span>${item.score}%</span>
            </div>
          </td>
          <td style="color: var(--text-muted); font-size: 0.85rem;">${item.detail}</td>
        </tr>
      `).join("");
    }

    // Render College Recommendations
    const recsContainer = document.getElementById("college-recs-container");
    if (recsContainer) {
      if (data.institutionalRecommendations.length === 0) {
        recsContainer.innerHTML = `<p style="padding: 16px; color: var(--text-dim);">No development alerts for this subset.</p>`;
      } else {
        recsContainer.innerHTML = data.institutionalRecommendations.map(rec => `
          <div class="rec-step-card glass-panel" style="margin-bottom: 12px; border-left-color: #8b5cf6;">
            <div class="rec-step-content">
              <h4 style="color: #c4b5fd;">${rec.title}</h4>
              <p style="font-size: 0.88rem; margin-bottom: 6px;"><strong>Data Observation:</strong> ${rec.observation}</p>
              <p style="font-size: 0.88rem; color: #93c5fd;"><strong>Recommended Intervention:</strong> ${rec.action}</p>
            </div>
          </div>
        `).join("");
      }
    }

    // Render Challenges List
    const challengeContainer = document.getElementById("dash-challenges-list");
    if (challengeContainer) {
      challengeContainer.innerHTML = data.topChallenges.map(([ch, count]) => {
        const pct = Math.round((count / (data.totalStudents || 1)) * 100);
        return `
          <div style="margin-bottom: 12px;">
            <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span>${ch}</span>
              <span><strong>${count}</strong> students (${pct}%)</span>
            </div>
            <div class="dim-bar-bg">
              <div class="dim-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #f43f5e, #fb7185);"></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Render Career Preferences List
    const careerContainer = document.getElementById("dash-career-dist");
    if (careerContainer) {
      careerContainer.innerHTML = Object.entries(data.distributions.career).map(([goal, count]) => {
        const pct = Math.round((count / (data.totalStudents || 1)) * 100);
        return `
          <div style="margin-bottom: 12px;">
            <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span>${goal}</span>
              <span><strong>${count}</strong> (${pct}%)</span>
            </div>
            <div class="dim-bar-bg">
              <div class="dim-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #3b82f6, #06b6d4);"></div>
            </div>
          </div>
        `;
      }).join("");
    }
  },

  getDashboardFilters() {
    return {
      college: document.getElementById("dash-filter-college")?.value || "ALL",
      district: document.getElementById("dash-filter-district")?.value || "ALL",
      city: document.getElementById("dash-filter-city")?.value || "ALL",
      branch: document.getElementById("dash-filter-branch")?.value || "ALL",
      year: document.getElementById("dash-filter-year")?.value || "ALL",
      semester: document.getElementById("dash-filter-semester")?.value || "ALL",
      careerGoal: document.getElementById("dash-filter-goal")?.value || "ALL"
    };
  },

  populateFilterDropdowns() {
    const all = StorageService.getAllResponses();
    const colleges = new Set();
    const districts = new Set();
    const cities = new Set();
    const branches = new Set();

    all.forEach(p => {
      if (p.college && p.college.name) colleges.add(p.college.name);
      if (p.college && p.college.district) districts.add(p.college.district);
      if (p.college && p.college.city) cities.add(p.college.city);
      if (p.academic && p.academic.branch) branches.add(p.academic.branch);
    });

    const colSelect = document.getElementById("dash-filter-college");
    if (colSelect && colSelect.options.length <= 1) {
      colleges.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.innerText = c;
        colSelect.appendChild(opt);
      });
    }

    const distSelect = document.getElementById("dash-filter-district");
    if (distSelect && distSelect.options.length <= 1) {
      districts.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.innerText = d;
        distSelect.appendChild(opt);
      });
    }

    const citySelect = document.getElementById("dash-filter-city");
    if (citySelect && citySelect.options.length <= 1) {
      cities.forEach(ci => {
        const opt = document.createElement("option");
        opt.value = ci;
        opt.innerText = ci;
        citySelect.appendChild(opt);
      });
    }

    const brSelect = document.getElementById("dash-filter-branch");
    if (brSelect && brSelect.options.length <= 1) {
      branches.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.innerText = b;
        brSelect.appendChild(opt);
      });
    }
  },

  resetFilters() {
    ["dash-filter-college", "dash-filter-district", "dash-filter-city", "dash-filter-branch", "dash-filter-year", "dash-filter-semester", "dash-filter-goal"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "ALL";
    });
    this.renderDashboard();
  },

};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
