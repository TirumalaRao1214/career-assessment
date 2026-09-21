# B.Tech Career & Skill Assessment Platform

> **Tagline:** Understand Where You Are. Discover What To Focus On Next.

A modern, responsive, and data-driven platform built for **all B.Tech students across all branches, colleges, years, cities, and districts** in India.

---

## 🏛️ Architecture Overview

The application is architected as a lightweight, high-performance static frontend ready for deployment on **Render, Netlify, Vercel, or GitHub Pages**, securely integrated with **Google Sheets via Google Apps Script Web App**:

```
Student Survey (Frontend)
   └── JavaScript Validation & Assessment Engine
         └── `googleSheetsService.js` (Decoupled Service Layer)
               └── Google Apps Script Web App Endpoint (`doPost` / `doGet`)
                     └── Google Spreadsheet Worksheets
                           ├── 1. Responses
                           ├── 2. Colleges
                           ├── 3. Recommendations
                           └── 4. Questions
```

> **Security Guarantee:** Zero Google API credentials, service-account secrets, or spreadsheet private keys are exposed in the frontend code.

---

## 📊 Google Spreadsheet Worksheets Specification

### 1. `Responses` Worksheet
Stores every completed student survey as one row:
- `Timestamp`, `Response ID`, `Full Name`, `Email`, `Mobile`, `College`, `District`, `City`, `State`, `Area Type`, `College Type`
- `Branch`, `Year`, `Semester`, `Academic Performance`, `Career Goal`, `Career Clarity`
- `Communication Score`, `English Score`, `Problem Solving Score`, `Logical Thinking Score`, `Aptitude Score`, `Presentation Score`, `Teamwork Score`, `Time Management Score`, `Self Learning Score`, `Confidence Score`, `AI Skills Score`
- `Technical Skills`, `Programming Skills`, `SQL Skills`
- `Project Count`, `Project Experience`, `Internship Status`, `Internship Domain`
- `Resume Readiness`, `Aptitude Readiness`, `Technical Interview Readiness`, `HR Interview Readiness`, `Coding Readiness`
- `AI Usage`, `Challenges`, `Learning Preferences`, `Six Month Goal`
- `Overall Assessment`, `Strengths`, `Focus Areas`, `Recommendations`

### 2. `Colleges` Worksheet
Master list of active institutions:
- `College ID`, `College Name`, `District`, `City`, `State`, `College Type`, `Active`

### 3. `Recommendations` Worksheet
Configurable recommendation rules enabling non-hardcoded guidance logic:
- `Rule ID`, `Branch`, `Career Goal`, `Skill`, `Minimum Score`, `Maximum Score`, `Priority`, `Recommendation`, `Recommended Action`

### 4. `Questions` Worksheet
Survey metadata and maintainability:
- `Question ID`, `Section`, `Question`, `Branch`, `Question Type`, `Required`, `Options`, `Weight`, `Active`

---

## 🛠️ Step-by-Step Google Sheets Setup Guide

1. **Create a Google Spreadsheet:**
   - Go to [Google Sheets](https://sheets.new) and create a new spreadsheet named `BTech Career & Skill Assessment DB`.

2. **Open Apps Script Editor:**
   - In the top menu, click **Extensions** → **Apps Script**.

3. **Copy Code:**
   - Delete any default code in `Code.gs`.
   - Copy and paste the complete content of [`google-apps-script.js`](./google-apps-script.js).

4. **Initialize Spreadsheet Structure:**
   - In the Apps Script toolbar, select the function dropdown, choose `setupSpreadsheet`, and click **Run**.
   - Grant the required Google authorizations. This automatically creates the 4 worksheets (`Responses`, `Colleges`, `Recommendations`, `Questions`) with formatted header rows and seed data.

5. **Deploy as Web App:**
   - Click **Deploy** (top right) → **New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Description:** `BTech Career Assessment Web App Endpoint`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` *(Crucial for static web clients to post without exposing credentials)*.
   - Click **Deploy** and copy the generated **Web App URL** (`https://script.google.com/macros/s/.../exec`).

6. **Connect the Web App to the Website:**
   - Open [`index.html`](./index.html) in your browser.
   - Click **Google Sheets / API** button in the top navbar.
   - Paste the Web App URL into the **Google Apps Script Web App Endpoint URL** field and click **Save Configuration**.
   - Alternatively, you can paste the URL directly into `DEFAULT_ENDPOINT_URL` inside [`js/googleSheetsService.js`](./js/googleSheetsService.js).

---

## 🚀 Frontend Submission Pipeline

When a student finishes the 10th step and clicks **Get My Career Insights →**:
1. All mandatory fields across contact, college, branch, skills, projects, placement, and goals are strictly validated.
2. The core analytics engine computes 8 holistic dimensions (*Technical, Practical, Placement, Communication, Interview, Clarity, Industry, AI*).
3. Configurable recommendation rules from Google Sheets are evaluated.
4. Unique collision-resistant Response ID is created (e.g. `BT2026-000001` / `BT2026-XXXXXX`).
5. Button is disabled during transmission to prevent accidental duplicates.
6. Answers are preserved in memory if network drops occur; if submission fails, a friendly alert **"We couldn't save your assessment. Please try again."** is displayed.
7. Upon successful confirmation, the personalized **B.Tech Career Snapshot** is displayed showing the Assessment ID and 90-day action roadmap.

---

## 📈 Real-Time College Intelligence Dashboard

- Filters aggregate responses by **College, District, City, Branch, Year, Semester, and Career Goal**.
- **Student Skill Development Heatmap** identifies cohort areas of development (*High / Medium / Low*).
- **Institutional Interventions** translates real responses into actionable college programs.
- **Strict Data Rule:** No fake statistics or mock rankings. If zero submissions exist, displays `"No assessment data available yet."`
- **CSV Data Export:** One-click download of all response data.

---

## 🔮 Future ASP.NET Core & SQL Server Migration

The backend integration is isolated inside [`js/googleSheetsService.js`](./js/googleSheetsService.js) and [`js/storage.js`](./js/storage.js). To switch to **ASP.NET Core Web API + SQL Server**:
1. Change `backendType` in configuration to `aspnet_api`.
2. Point the API endpoint to your ASP.NET Core controller.
3. No changes to the survey UI, wizard steps, or scoring calculation logic are needed.
