# Toolkit: Spotlight

**Focus:** Earn trust and reviews.

**Promise:** Systematically generate positive patient reviews on key platforms like Google, building social proof that attracts new patients.

---

## Core Components

### 1. Automated Review Request SMS/Email
*   **Goal:** Ask for a review at the moment of highest patient satisfaction.
*   **Trigger:** 1-2 hours after a completed appointment.
*   **Audience:** All patients, potentially with a filter to exclude those who have had a negative experience (requires internal feedback mechanism).
*   **Copy Snippet (A2P Compliant):**
    ```
    Hi [Patient Name], thanks for visiting [Clinic Name] today. We'd love to hear your feedback! Would you take 30 seconds to leave us a review on Google? [Link]. Reply STOP to unsubscribe.
    ```

### 2. "Review Us" On-Site Materials
*   **Goal:** Capture reviews from patients while they are still in the clinic.
*   **Materials:** A simple QR code on a postcard or at the front desk that links directly to the Google review page.

### 3. Staff Incentive Program
*   **Goal:** Encourage front desk staff to actively ask for reviews.
*   **Structure:** A simple monthly bonus or prize for the staff member who is mentioned most often in positive reviews.

## Setup & Configuration
*   **Google Business Profile:** A direct link to the "leave a review" page is required.
*   **n8n/Make:** Automation to connect to the scheduling system and trigger post-appointment messages.
*   **QR Code Generator:** To create the on-site materials.

## Metrics
*   **KPI:** Review velocity (new reviews per month); average star rating.
*   **Instrumentation:** Use a link shortener (like Bitly) for the review link to track clicks.
