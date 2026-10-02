# 🏥TeamFlow: Healthcare Queue Management System

## 🩻 Overview
>  At Henry Ford Health, I am a patient registration representative responsible for processing patients for walk-in ancillary services. In my department, we experience severe traffic surges that congest the waiting room and overwhelm the frontline staff. To mitigate our throughput bottleneck, I created a solution to optimize our operational workflow and improve patient experience and safety. I developed a virtual queue management system to reduce wait times, enhance team collaboration, track performance metrics, and protect sensitive PHI and PII.
<br><br>

## 💻 Tech Stack
* **Frontend Framework:** Next.js
* **Database & Backend:** Supabase
* **Authentication & Integration:** Epic Sandbox Environment (SMART on FHIR)
<br><br>

## Usage & Perspectives

### 1. 👤 Patient Perspective <br><br>
#### A. Patient Check-in Page
Complete the electronic check-in form to join the virtual queue.<br><br>

<img width="1920" height="922" alt="image" src="https://github.com/user-attachments/assets/9ddb581e-5e8e-4a2c-9dd6-18aad2829dfe" /> 

---

### 2. 🧑‍💻 Registrar Perspective <br><br>
#### A. Employee Login
Click **Employee Login**. Choose one of the following credentials to authenticate via the Epic FHIR sandbox environment: <br><br>
| Name | User Login | User Password |
| :--- | :--- | :--- |
| FHIR, USER | `FHIR` | `EpicFhir11!` |
| FHIRTWO, USER | `FHIRTWO` | `EpicFhir11!` |

<br>

<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/72df1af2-78d4-4b6f-afda-532c8ccbbce3" />

<br><br>

Click **Grant Access** to access the employee dashboard.<br><br>


<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/8f4f7011-5967-402b-93c6-40db99b56ab4" />

---
<br><br>
#### B. Employee Dashboard 
##### I. Live Queue View <br>
Monitor patient visit data including name, arrival time, reason for visit, active status, and elapsed wait time. <br><br>
<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/b779b22b-68a1-4afd-b143-a2430df6d4e0" />

---

##### II. Queue Filtering <br>
Toggle view modes to streamline workflow distribution: 
* **All Patients:** Displays all records across every stage.
* **Ready for Reg:** Filters for patients waiting to be picked up by a frontline representative.
* **In Progress:** Tracks patients currently undergoing active registration. <br><br>
  
https://github.com/user-attachments/assets/cb68876b-00cd-4da0-a548-26501ce142ea

---

##### III. Operational Actions <br>
###### Assign Registrar
Select a pending patient and click **Assign** to claim the record under your active logged-in session. <br><br>

https://github.com/user-attachments/assets/629a39b3-a0ac-4267-8d7c-ae560345c59e

<br><br>

###### Complete Registration
Click **Complete** upon finishing the check-in process to successfully archive and remove the patient from the live queue. <br><br>

https://github.com/user-attachments/assets/fa79514a-21f9-4bc9-a18f-20421764e78c



---

##### IV. 📊 Analytics & Reports <br>
Gain actionable insight into front-end hospital operations:
* Track total completed registrations and departmental average processing duration.
* Benchmark average registration times isolated by individual frontline staff members.
* Identify high-volume trends by visualizing overall average wait times and daily peak hours. <br><br>
  
https://github.com/user-attachments/assets/6323fec2-f4d8-459e-86f1-9518bb1235ed




