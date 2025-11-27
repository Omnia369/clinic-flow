# Toolkit: Conversational

**Focus:** Keep patients on track with engaging, two-way communication.

**Promise:** Move beyond one-way notifications. Create interactive, two-way SMS and email conversations that help patients stay engaged with their care plan.

---

## Core Components

### 1. Interactive Appointment Reminders
*   **Goal:** Not just remind, but engage.
*   **Flow:**
    *   SMS: "Hi [Patient Name], your appointment with [Clinic Name] is at [Time]. To reschedule, just reply to this message. Reply C to confirm."
    *   If patient replies with a question ("can I come at 3 instead?"), it gets flagged for the front desk.
*   **Tools:** Requires a two-way SMS platform (like Twilio with custom handling, or a dedicated platform like Attentive).

### 2. Post-Visit "How Are You Feeling?" Check-in
*   **Goal:** Proactively solicit feedback and identify potential issues early.
*   **Flow:** An automated SMS 48 hours post-visit asks "Hey [Patient Name], just wanted to check in - how are you feeling after your adjustment? (1=Great, 2=Okay, 3=Not so good)".
*   **Automation:** Responses can trigger different actions. "1" could trigger a review request. "3" could create a task for the chiropractor to personally call the patient.

### 3. "Ask the Doc" Content Series
*   **Goal:** Build authority and provide value by answering common patient questions.
*   **Format:** A weekly or bi-weekly email newsletter where the doctor answers a common question.
*   **Engagement:** Encourage patients to reply with their own questions for future newsletters.

## Setup & Configuration
*   **Two-Way SMS:** A platform capable of handling inbound replies and routing them.
*   **CRM:** To log conversational history with the patient.
*   **n8n/Make:** To build the logic for the interactive check-ins.

## Metrics
*   **KPI:** Patient engagement rate (reply rate to SMS); reduction in no-shows due to easier rescheduling.
*   **Instrumentation:** Track reply content and sentiment.
