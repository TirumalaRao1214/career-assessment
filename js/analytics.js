/**
 * Analytics Service
 * Computes aggregate intelligence dynamically from actual recorded responses.
 * Strict Rule: Do NOT invent statistics or display sample fake college results.
 * Supports multi-dimensional filtering by College, District, City, Branch, Year, Semester, and Career Goal.
 */

const AnalyticsService = {
  getAggregateData(filters = {}) {
    const all = StorageService.getAllResponses();
    if (!all || all.length === 0) {
      return this.getEmptyStats(false);
    }

    // Apply active filters
    const filtered = all.filter(p => {
      const s = p.student || {};
      const col = p.college || {};
      const ac = p.academic || {};
      const car = p.career || {};

      if (filters.college && filters.college !== "ALL" && col.name !== filters.college) return false;
      if (filters.district && filters.district !== "ALL" && col.district !== filters.district) return false;
      if (filters.city && filters.city !== "ALL" && col.city !== filters.city) return false;
      if (filters.branch && filters.branch !== "ALL" && ac.branch !== filters.branch) return false;
      if (filters.year && filters.year !== "ALL" && ac.year !== filters.year) return false;
      if (filters.semester && filters.semester !== "ALL" && ac.semester !== filters.semester) return false;
      if (filters.careerGoal && filters.careerGoal !== "ALL" && car.primaryGoal !== filters.careerGoal) return false;
      return true;
    });

    if (filtered.length === 0) {
      return this.getEmptyStats(true);
    }

    return this.computeMetrics(filtered);
  },

  computeMetrics(records) {
    const total = records.length;

    let sumOverall = 0;
    let sumTech = 0;
    let sumPract = 0;
    let sumPlace = 0;
    let sumComm = 0;
    let sumInter = 0;
    let sumInd = 0;
    let sumAI = 0;
    let sumClarity = 0;

    const careerDist = {};
    const branchDist = {};
    const yearDist = {};
    const districtDist = {};
    const cityDist = {};
    const collegeDist = {};

    let internshipCount = 0;
    let portfolioCount = 0;
    let projects2PlusCount = 0;
    let resumeReadyCount = 0;
    let aptitudeStrongCount = 0;
    let aiActiveCount = 0;

    const commonSkillSums = {};
    const challengeCounts = {};
    const goalCounts = {};

    records.forEach(p => {
      const s = p.student || {};
      const col = p.college || {};
      const ac = p.academic || {};
      const car = p.career || {};
      const sk = p.skills || {};
      const cSk = sk.common || {};
      const pr = p.projects || {};
      const intp = p.internship || {};
      const pl = p.placement || {};
      const ai = p.ai || {};
      const goals = p.goals || {};
      const ass = p.assessment || {};
      const scores = ass.scores || {};

      sumOverall += (ass.overallIndex || 0);
      sumTech += (scores.technicalReadiness || 0);
      sumPract += (scores.practicalExperience || 0);
      sumPlace += (scores.placementReadiness || 0);
      sumComm += (scores.communicationReadiness || 0);
      sumInter += (scores.interviewReadiness || 0);
      sumInd += (scores.industryExposure || 0);
      sumAI += (scores.aiReadiness || 0);
      sumClarity += (scores.careerClarity || 0);

      if (car.primaryGoal) careerDist[car.primaryGoal] = (careerDist[car.primaryGoal] || 0) + 1;
      if (ac.branch) branchDist[ac.branch] = (branchDist[ac.branch] || 0) + 1;
      if (ac.year) yearDist[ac.year] = (yearDist[ac.year] || 0) + 1;
      if (col.district) districtDist[col.district] = (districtDist[col.district] || 0) + 1;
      if (col.city) cityDist[col.city] = (cityDist[col.city] || 0) + 1;
      if (col.name) collegeDist[col.name] = (collegeDist[col.name] || 0) + 1;

      if (intp.completed === "Yes" || intp.completed === "Currently doing one") internshipCount++;
      if (pr.portfolio === "Yes") portfolioCount++;
      if (pr.count === "2" || pr.count === "3" || pr.count === "4+") projects2PlusCount++;
      if (pl.resume === "Ready") resumeReadyCount++;
      if (pl.aptitude === "Strong" || pl.aptitude === "Good") aptitudeStrongCount++;

      if (Array.isArray(ai.usage) && !ai.usage.includes("Not using AI yet") && ai.usage.length > 0) {
        aiActiveCount++;
      }

      Object.entries(cSk).forEach(([k, v]) => {
        commonSkillSums[k] = (commonSkillSums[k] || 0) + Number(v);
      });

      if (Array.isArray(p.challenges)) {
        p.challenges.forEach(ch => {
          challengeCounts[ch] = (challengeCounts[ch] || 0) + 1;
        });
      }

      if (goals.sixMonthGoal) {
        goalCounts[goals.sixMonthGoal] = (goalCounts[goals.sixMonthGoal] || 0) + 1;
      }
    });

    const avgOverall = Math.round(sumOverall / total);
    const avgTech = Math.round(sumTech / total);
    const avgPract = Math.round(sumPract / total);
    const avgPlace = Math.round(sumPlace / total);
    const avgComm = Math.round(sumComm / total);
    const avgInter = Math.round(sumInter / total);
    const avgInd = Math.round(sumInd / total);
    const avgAI = Math.round(sumAI / total);
    const avgClarity = Math.round(sumClarity / total);

    const commonSkillAverages = {};
    Object.keys(commonSkillSums).forEach(k => {
      commonSkillAverages[k] = Number((commonSkillSums[k] / total).toFixed(1));
    });

    const developmentAreas = [
      {
        area: "Practical Capstone Projects",
        score: avgPract,
        needLevel: avgPract < 50 ? "High" : avgPract < 70 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (projects2PlusCount / total) * 100),
        detail: `${Math.round((projects2PlusCount / total) * 100)}% of students have built 2+ meaningful projects.`
      },
      {
        area: "Internship & Industry Exposure",
        score: avgInd,
        needLevel: avgInd < 50 ? "High" : avgInd < 70 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (internshipCount / total) * 100),
        detail: `${Math.round((internshipCount / total) * 100)}% of students have industry internship exposure.`
      },
      {
        area: "Technical Communication & Articulation",
        score: avgComm,
        needLevel: avgComm < 55 ? "High" : avgComm < 72 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (avgComm / 100) * 100),
        detail: `Average communication rating is ${(commonSkillAverages.communication || 3.0)}/5.`
      },
      {
        area: "Technical & Coding Interview Readiness",
        score: avgTech,
        needLevel: avgTech < 55 ? "High" : avgTech < 72 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (avgTech / 100) * 100),
        detail: `Core technical mastery average index stands at ${avgTech}/100.`
      },
      {
        area: "Quantitative Aptitude & Placement Tests",
        score: avgPlace,
        needLevel: avgPlace < 55 ? "High" : avgPlace < 70 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (aptitudeStrongCount / total) * 100),
        detail: `${Math.round((aptitudeStrongCount / total) * 100)}% rate aptitude as strong or good.`
      },
      {
        area: "Mock Interviews & HR Readiness",
        score: avgInter,
        needLevel: avgInter < 55 ? "High" : avgInter < 70 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (avgInter / 100) * 100),
        detail: `Average mock interview readiness score is ${avgInter}/100.`
      },
      {
        area: "Modern AI & Tool Fluency",
        score: avgAI,
        needLevel: avgAI < 50 ? "High" : avgAI < 70 ? "Medium" : "Low",
        pctNeedingSupport: Math.round(100 - (aiActiveCount / total) * 100),
        detail: `${Math.round((aiActiveCount / total) * 100)}% of students utilize AI tools for learning & coding.`
      }
    ];

    const institutionalRecommendations = this.generateInstitutionalRecs({
      total,
      avgPract,
      avgInd,
      avgComm,
      avgTech,
      avgPlace,
      avgAI,
      internshipPct: Math.round((internshipCount / total) * 100),
      portfolioPct: Math.round((portfolioCount / total) * 100),
      projectsPct: Math.round((projects2PlusCount / total) * 100),
      resumePct: Math.round((resumeReadyCount / total) * 100),
      topChallenges: Object.entries(challengeCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)
    });

    return {
      totalStudents: total,
      averages: {
        overall: avgOverall,
        technical: avgTech,
        practical: avgPract,
        placement: avgPlace,
        communication: avgComm,
        interview: avgInter,
        industry: avgInd,
        ai: avgAI,
        clarity: avgClarity
      },
      distributions: {
        career: careerDist,
        branch: branchDist,
        year: yearDist,
        district: districtDist,
        city: cityDist,
        college: collegeDist
      },
      metrics: {
        internshipPct: Math.round((internshipCount / total) * 100),
        portfolioPct: Math.round((portfolioCount / total) * 100),
        projects2PlusPct: Math.round((projects2PlusCount / total) * 100),
        resumeReadyPct: Math.round((resumeReadyCount / total) * 100),
        aiActivePct: Math.round((aiActiveCount / total) * 100)
      },
      commonSkillAverages,
      topChallenges: Object.entries(challengeCounts).sort((a, b) => b[1] - a[1]).slice(0, 6),
      topGoals: Object.entries(goalCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
      developmentAreas,
      institutionalRecommendations
    };
  },

  generateInstitutionalRecs(data) {
    const recs = [];

    if (data.projectsPct < 60) {
      recs.push({
        title: "Project-Based Learning & Hackathons",
        observation: `Only ${data.projectsPct}% of assessed students have completed 2+ hands-on projects.`,
        action: "Incorporate semester mini-capstones into laboratory credits and host campus-wide weekend hackathons."
      });
    }

    if (data.internshipPct < 50) {
      recs.push({
        title: "Industry Linkages & Structured Internships",
        observation: `${data.internshipPct}% student internship penetration indicates a clear industry disconnect.`,
        action: "Partner with regional MSMEs and tech firms for structured 6-8 week summer internship pipelines."
      });
    }

    if (data.avgComm < 70) {
      recs.push({
        title: "Technical Communication & Presentation Labs",
        observation: `Communication readiness index (${data.avgComm}/100) highlights a need for articulation practice.`,
        action: "Introduce 3-minute project pitch rounds and peer group discussions in regular curriculum."
      });
    }

    if (data.resumePct < 70 || data.avgPlace < 70) {
      recs.push({
        title: "Structured Placement & Mock Interview Clinics",
        observation: `Aptitude & placement readiness indicates students need structured preparatory cadence.`,
        action: "Schedule weekly proctored aptitude tests and 1-on-1 alumni mock interview clinics."
      });
    }

    if (data.aiActivePct < 75) {
      recs.push({
        title: "Responsible AI & Modern Tooling Workshops",
        observation: `${100 - data.aiActivePct}% of students have not integrated modern AI tools into workflow.`,
        action: "Conduct hands-on masterclasses on GenAI, prompt engineering, and GitHub Copilot."
      });
    }

    return recs;
  },

  getEmptyStats(hasFilters = false) {
    return {
      totalStudents: 0,
      hasFilters,
      averages: { overall: 0, technical: 0, practical: 0, placement: 0, communication: 0, interview: 0, industry: 0, ai: 0, clarity: 0 },
      distributions: { career: {}, branch: {}, year: {}, district: {}, city: {}, college: {} },
      metrics: { internshipPct: 0, portfolioPct: 0, projects2PlusPct: 0, resumeReadyPct: 0, aiActivePct: 0 },
      commonSkillAverages: {},
      topChallenges: [],
      topGoals: [],
      developmentAreas: [],
      institutionalRecommendations: []
    };
  }
};
