# Google Form Setup Guide — Admin Only

> **This guide is for the website owner/admin only.**  
> Students never see this file, never see the Google Sheet URL, and never see any credentials.

---

## Architecture Overview

```
Student
  ↓
GOLIS B.Tech Survey Website  (public)
  ↓  (form POST — no API key, no credentials)
Google Form  (submission layer)
  ↓  (automatic)
Private Google Sheet  (owner-only storage)
```

The student interacts **only** with the GOLIS website.  
The Google Form is **never shown** to the student — it is a backend submission target.  
The Google Sheet is **private** — only the owner can open it.

---

## Step 1 — Create the Private Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **B.Tech Career Assessment Responses**.
3. **Do NOT share it** — leave it private (only you, the owner, can view it).
4. Keep the spreadsheet URL to yourself. **Never paste it into any JavaScript file.**

---

## Step 2 — Create the Google Form

1. Go to [forms.google.com](https://forms.google.com) and create a new form.
2. Name it **B.Tech Career & Skill Assessment**.
3. Add the following questions (match the types carefully):

### Required Form Fields

| # | Question Title | Type |
|---|---------------|------|
| 1 | Response ID | Short answer |
| 2 | Timestamp | Short answer |
| 3 | Full Name | Short answer |
| 4 | Email Address | Short answer |
| 5 | Mobile Number | Short answer |
| 6 | Gender | Short answer |
| 7 | College | Short answer |
| 8 | District | Short answer |
| 9 | City | Short answer |
| 10 | State | Short answer |
| 11 | Area Type | Short answer |
| 12 | College Type | Short answer |
| 13 | Branch | Short answer |
| 14 | Year | Short answer |
| 15 | Semester | Short answer |
| 16 | Academic Performance | Short answer |
| 17 | Career Goal | Short answer |
| 18 | Career Clarity | Short answer |
| 19 | Skill: Communication | Short answer |
| 20 | Skill: English | Short answer |
| 21 | Skill: Problem Solving | Short answer |
| 22 | Skill: Logical Thinking | Short answer |
| 23 | Skill: Aptitude | Short answer |
| 24 | Skill: Presentation | Short answer |
| 25 | Skill: Teamwork | Short answer |
| 26 | Skill: Time Management | Short answer |
| 27 | Skill: Self Learning | Short answer |
| 28 | Skill: Confidence | Short answer |
| 29 | Skill: AI Tools | Short answer |
| 30 | Branch Skills (JSON) | Paragraph (long answer) |
| 31 | Project Count | Short answer |
| 32 | Project Real World | Short answer |
| 33 | Project Confidence | Short answer |
| 34 | Has Portfolio | Short answer |
| 35 | Internship Status | Short answer |
| 36 | Internship Domain | Short answer |
| 37 | Internship Duration | Short answer |
| 38 | Internship Type | Short answer |
| 39 | Internship Relevant | Short answer |
| 40 | Resume Readiness | Short answer |
| 41 | Aptitude Readiness | Short answer |
| 42 | Technical Interview Readiness | Short answer |
| 43 | HR Interview Readiness | Short answer |
| 44 | Coding Readiness | Short answer |
| 45 | Mock Interviews | Short answer |
| 46 | AI Usage | Short answer |
| 47 | AI Confidence | Short answer |
| 48 | Challenges | Short answer |
| 49 | Learning Preferences | Short answer |
| 50 | Six Month Goal | Short answer |
| 51 | Overall Index | Short answer |
| 52 | Readiness Level | Short answer |
| 53 | Strengths | Paragraph (long answer) |
| 54 | Focus Areas | Paragraph (long answer) |
| 55 | Recommendations | Paragraph (long answer) |

> **Tip:** You can mark all questions as **not required** on the form itself —  
> validation is handled by the GOLIS website before submission.

---

## Step 3 — Link the Form to Your Private Google Sheet

1. In your Google Form, click the **Responses** tab at the top.
2. Click the green Sheets icon **"Link to Sheets"**.
3. Select **"Select existing spreadsheet"** and choose the sheet you created in Step 1.
4. Click **Create / Select**.

Google Forms will now automatically write every submission into your private sheet.

---

## Step 4 — Find the Entry IDs

Each Google Form field has a hidden `entry.XXXXXXXXX` ID used for form POST submissions.

### Method A — Browser DevTools (recommended)

1. Open your Google Form in Chrome/Edge.
2. Press **F12** → open the **Elements** tab.
3. Press **Ctrl+F** and search for `entry.`.
4. You will see each input element with `name="entry.XXXXXXXXX"`.
5. Match each entry ID to the corresponding field by its position/label.

### Method B — View Page Source

1. Open your Google Form.
2. Press **Ctrl+U** to view source.
3. Search for `entry.` — you'll find all field IDs listed.

### Method C — Pre-filled Form URL

1. In your Google Form, click the **⋮ menu** → **"Get pre-filled link"**.
2. Fill in one field at a time with unique test values (e.g., `TEST_NAME`, `TEST_EMAIL`).
3. Click **"Get Link"** and inspect the URL — it will contain `entry.XXXXXXX=TEST_NAME` etc.

---

## Step 5 — Update googleFormConfig.js

Open `js/googleFormConfig.js` in a text editor and:

1. Replace `PLACEHOLDER_FORM_ID` in `FORM_ACTION_URL` with your real Google Form ID.  
   The form ID is in your form's edit URL:  
   `https://docs.google.com/forms/d/e/`**`1FAIpQLSxxxxxxxxxxxxxxxxxx`**`/viewform`  
   The `FORM_ACTION_URL` should be:  
   `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`

2. Replace each `entry.PLACEHOLDER_XXXX` with the real entry ID you found in Step 4.

**Example (after filling in real IDs):**

```javascript
FORM_ACTION_URL: "https://docs.google.com/forms/d/e/1FAIpQLSaBcDeFgH.../formResponse",

FIELDS: {
  responseId:   "entry.123456789",
  timestamp:    "entry.234567890",
  fullName:     "entry.345678901",
  email:        "entry.456789012",
  mobile:       "entry.567890123",
  // ... and so on for all 55 fields
}
```

---

## Step 6 — Test the Submission

1. Open the GOLIS website (`index.html`) in your browser.
2. Complete the assessment with test data.
3. Click **"Get My Career Insights →"**.
4. Open your private Google Sheet — you should see a new row with the test submission.

If no row appears:
- Double-check `FORM_ACTION_URL` is correct (ends in `/formResponse`, not `/viewform`).
- Double-check the entry IDs match the correct fields.
- Verify the Form → Sheet link is set up (Step 3).

---

## Security Checklist

| Item | Status |
|------|--------|
| Google Sheet is private (owner-only) | ✅ Ensure this |
| Spreadsheet URL is NOT in any JS file | ✅ Correct — only form URL is in googleFormConfig.js |
| No Google API key in any JS file | ✅ Correct — Google Forms does not need an API key |
| No OAuth or service-account credentials in JS | ✅ Correct |
| Students can only POST — never read the sheet | ✅ Correct — Google Forms is write-only from the browser |
| `google-apps-script.js` is NOT loaded in index.html | ✅ Correct |
| Google Fonts CDN removed | ✅ Correct — system font stack used |
| External image CDN removed | ✅ Correct — no external image URLs |

---

## College Intelligence Dashboard

The **College Intelligence** dashboard on the GOLIS website is powered by **localStorage** data on the **admin's own device**.

When the admin (you) takes the assessment on a device, or when submissions are collected through other admin-controlled means, the dashboard reflects that local data.

The dashboard does **not** fetch or display data from the Google Sheet.  
Students' personal data in the sheet is never exposed to any browser via API calls.

If you want a full multi-device admin dashboard backed by the Google Sheet, that would require a separate secure backend (e.g., Apps Script or a server-side API with authentication) — which is out of scope for this public static website.

---

## File Reference

| File | Purpose | Loaded by students? |
|------|---------|---------------------|
| `js/googleFormConfig.js` | Form URL + field entry IDs | Yes (submission config only) |
| `js/googleFormService.js` | Handles form POST logic | Yes (submit action only) |
| `google-apps-script.js` | Legacy Apps Script reference | **NO — admin only** |
| `GOOGLE_FORM_SETUP.md` | This guide | **NO — admin only** |
