# TeamFlow: Healthcare Queue Management System

## Overview
At Henry Ford Health, I am a patient registration representative responsible for processing patients for walk-in ancillary services. In my department, we experience severe traffic surges that congest the waiting room and overwhelm the frontline staff. To mitigate our throughput bottleneck, I created a solution to optimize our operational workflow and improve patient experience and safety. I developed a virtual queue management system to reduce wait times, enhance team collaboration, track performance metrics, and protect sensitive PHI and PII. The web application integrates Next.js with Supabase for database management and the Epic sandbox environment for SMART on FHIR authentication. 

## 💻 Tech Stack
* **Frontend Framework:** Next.js
* **Database & Backend:** Supabase
* **Authentication & Integration:** Epic Sandbox Environment (SMART on FHIR)

## Netlify Supabase Configuration

Set `SUPABASE_URL` in Netlify's environment settings to the same project URL as `NEXT_PUBLIC_SUPABASE_URL`. Make it available to the Functions scope and to every deploy context that runs the application. If server code runs during prerendering, also include the Builds scope.

The server-side admin and cookie-based clients use `SUPABASE_URL`. Keep `SUPABASE_SERVICE_ROLE_KEY` private and available to server-side code only. The browser client still requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at build time.

Next.js embeds `NEXT_PUBLIC_` values in generated JavaScript. Changing the server clients does not remove the public URL from browser bundles. If Netlify flags that intentionally public URL, review its secret classification or narrowly exclude `NEXT_PUBLIC_SUPABASE_URL` using `SECRETS_SCAN_OMIT_KEYS`. Never exclude the service-role key or disable secret scanning globally. Redeploy after updating the environment settings, clearing the build cache if it retains old output.

---

## Usage & Perspectives

### Patient Perspective

#### 1. Registration Home Page
* Complete the electronic check-in form to join the virtual queue.
* *[Insert Screenshot of completed form]*

#### 2. Check-In Confirmation
* Receive immediate confirmation and view the department’s real-time average wait time.
* *[Insert Screenshot of check-in confirmation]*

---

### Registrar Perspective

#### 1. Employee Login
Click **Employee Login** to authenticate via the Epic FHIR sandbox environment. 

| Name | User Login | User Password |
| :--- | :--- | :--- |
| FHIR, USER | `FHIR` | `EpicFhir11!` |
| FHIRTWO, USER | `FHIRTWO` | `EpicFhir11!` |

**[Insert Screenshot of Epic Login Page with credentials]*

#### 2. Dashboard & Queue Management
* **Live Queue View:** Monitor patient visit data including name, arrival time, reason for visit, active status, and elapsed wait time.
* *[Insert Screenshot of queue dashboard]*

#### 3. Queue Filtering
Toggle view modes to streamline workflow distribution:
* **All Patients:** Displays all records across every stage.
* **Ready for Reg:** Filters for patients waiting to be picked up by a frontline representative.
* **In Progress:** Tracks patients currently undergoing active registration.
* *[Insert Video of flipping through filters]*

#### 4. Operational Actions
* **Assign Registrar:** Select a pending patient and click **Assign** to claim the record under your active logged-in session.
* **Complete Registration:** Click **Complete** upon finishing the check-in process to successfully archive and remove the patient from the live queue.

---

## 📊 Analytics & Reports Page
Gain actionable insight into front-end hospital operations:
* Track total completed registrations and departmental average processing duration.
* Benchmark average registration times isolated by individual frontline staff members.
* Identify high-volume trends by visualizing overall average wait times and daily peak hours.
* *[Insert Screenshots of report page]*
