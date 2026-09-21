/**
 * Google Apps Script Endpoint Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture:
 *   Student → GOLIS Website → Google Apps Script Web App → Private Google Sheet
 *
 * SECURITY:
 *   • No Google Sheets API key here.
 *   • No spreadsheet URL or spreadsheet ID here.
 *   • No OAuth or service-account credentials here.
 *   • The Apps Script Web App URL below is a WRITE-ONLY endpoint.
 *     Students can submit data — they cannot read the sheet.
 *   • The Google Sheet remains private to the owner.
 *
 * ADMIN:
 *   To update the endpoint, replace APPS_SCRIPT_URL below with your
 *   new deployed Web App URL (ends in /exec).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const GOOGLE_FORM_CONFIG = {
  /**
   * Google Apps Script Web App deployment URL.
   * Obtained via: Google Sheet → Extensions → Apps Script → Deploy → Web App
   * Execute as: Me | Who has access: Anyone
   */
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzJ7HkWkatMd_z-CLiRbGzlVesEr2l4AsJ5hT0ypw5SU1DcoRYr6QBNy3LARMq6E4DR/exec"
};
