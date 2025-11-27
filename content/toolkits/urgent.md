# Toolkit: Urgent

**Focus:** Fill the calendar, now.

**Promise:** Immediately deployable campaigns to fill near-term appointment gaps caused by last-minute cancellations or seasonal lulls.

---

## Core Components

### 1. SMS "Short Notice" Campaign
*   **Goal:** Fill a same-day or next-day opening.
*   **Audience:** Segment of patients who have opted-in to a "short notice list" or patients with a history of booking last-minute.
*   **Copy Snippet (A2P Compliant):**
    ```
    Hi [Patient Name]. Clinic Flow here for [Clinic Name]. We had a last-minute opening for [Service] at [Time] today. First come, first served. Reply YES to book or call [Phone]. Reply STOP to unsubscribe.
    ```

### 2. "Flash Offer" Email
*   **Goal:** Drive bookings for the upcoming 3-5 days.
*   **Offer:** A time-sensitive, high-value offer (e.g., "Book a consultation in the next 72 hours and receive a complimentary foam roller.").
*   **Template:** (To be added)

### 3. n8n/Make Automation Flow
*   **Trigger:** Manual trigger (e.g., a webhook triggered by a staff member).
*   **Action:**
    1.  Pulls the "short notice" patient segment from the CRM (Airtable/Notion).
    2.  Sends the SMS campaign via Twilio.
    3.  Waits for replies and notifies front desk.

## Setup & Configuration
*   **CRM:** Requires a patient list with a tag/field for "short_notice_list".
*   **Twilio:** Requires an A2P-compliant number and credentials.
*   **n8n/Make:** Pre-built template URL to be provided.

## Metrics
*   **KPI:** Gap-fill rate (number of appointments booked from campaign / number of openings).
*   **Instrumentation:** Track link clicks (if applicable) and use a unique phone number or keyword for SMS replies to attribute bookings.
