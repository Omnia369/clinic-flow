# Toolkit: Balanced

**Focus:** Run a tight front desk.

**Promise:** Streamline front desk operations, reduce administrative overhead, and create a smoother patient experience from booking to billing.

---

## Core Components

### 1. Digital Intake Forms
*   **Goal:** Eliminate paper forms and manual data entry.
*   **Flow:** New patients receive a link to a secure online intake form upon booking. Their answers are automatically synced to the CRM.
*   **Tools:** JotForm, Typeform, or a custom form solution integrated with the CRM.

### 2. Automated Appointment Reminders
*   **Goal:** Drastically reduce no-shows.
*   **Sequence:**
    *   72-hour email reminder.
    *   24-hour SMS reminder with confirmation (Reply YES to confirm).
    *   (Optional) 1-hour SMS reminder.
*   **n8n/Make:** Connects to the calendar/scheduling system to trigger reminders.

### 3. End-of-Day Reconciliation Report
*   **Goal:** Provide a daily snapshot of clinic performance.
*   **Automation:** An automated script runs at the end of each day, pulling data from the scheduling and payment systems.
*   **Report:** A simple email or Slack message with key metrics: appointments completed, no-shows, new patients, and total revenue.

## Setup & Configuration
*   **Scheduling System:** Must have API access (like Google Calendar) for n8n/Make to connect to.
*   **CRM:** To store patient data from intake forms.
*   **Twilio:** For sending SMS reminders.

## Metrics
*   **KPI:** No-show rate; administrative time spent on intake; staff satisfaction.
*   **Instrumentation:** Track confirmation rates on SMS reminders.
