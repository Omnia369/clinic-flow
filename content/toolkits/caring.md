# Toolkit: Caring

**Focus:** Keep patients on track & earn trust.

**Promise:** Strengthen patient relationships and improve retention with thoughtful, automated touchpoints that show you care beyond the adjustment.

---

## Core Components

### 1. Post-Appointment Follow-up SMS
*   **Goal:** Check in on a patient 24 hours after their appointment, especially a first visit or a new treatment type.
*   **Audience:** All patients, with specific message variations for new vs. existing.
*   **Copy Snippet (A2P Compliant):**
    ```
    Hi [Patient Name], [Clinic Name] checking in. Hope you're feeling good after your visit yesterday. Any questions, just reply here or call us at [Phone]. Reply STOP to unsubscribe.
    ```

### 2. "We Miss You" Reactivation Email
*   **Goal:** Re-engage patients who haven't booked in a while (e.g., 90 days).
*   **Offer:** A gentle nudge, often with a soft offer like a "complimentary wellness check-in."
*   **Template:** (To be added)

### 3. Birthday & Anniversary Messages
*   **Goal:** A simple, personal touch to build loyalty.
*   **Automation:** Triggered by a date field in the patient's CRM record.
*   **Channel:** Can be SMS or Email.

## Setup & Configuration
*   **CRM:** Requires accurate appointment history and patient date-of-birth fields.
*   **n8n/Make:** Automation flows to monitor appointment dates and trigger messages.

## Metrics
*   **KPI:** Patient retention rate; reactivation success rate.
*   **Instrumentation:** Track replies and re-booking rates from reactivation campaigns.
