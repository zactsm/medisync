# 🩺 MediSync

MediSync is a modern, comprehensive healthcare synchronization and management platform designed to bridge the gap between patients and their caregivers/family members. It enables secure, real-time medical profile sharing, medication tracking, appointment scheduling, symptom logging, and emergency information access.

---

## 🚀 Key Features

- **📊 Patient Dashboard**: A centralized view displaying medical checklists, medication status, upcoming appointments, and recent health activity.
- **💊 Medication Tracker**: Logs daily medication schedules, tracks pill counts with low-refill alerts, and records a 30-day historical adherence log.
- **📅 Appointment Coordinator**: Manages scheduled doctor visits, directions, and organizes lists of required medical documents or preparations.
- **🧠 Term Simplifier**: A medical jargon translator that breaks down complex clinical terms (like *Myocardial Infarction* or *Hyperlipidemia*) into plain language, offering intuitive analogies, key takeaways, and recommended questions for doctor consultations.
- **📁 Document Vault**: A secure storage system for medical records, insurance policies (e.g., AIA Takaful), prescriptions, and lab results, categorized and tagged for quick retrieval.
- **👥 Caregiver Sync**: Facilitates seamless delegation by inviting family members or professional caregivers via unique synchronization codes (`MS-...`) to view or assist with healthcare routines.
- **🚨 Emergency SOS & ICE Profile**: Generates In Case of Emergency (ICE) profiles with quick-access cards showing critical vitals (blood type, allergies, conditions) and immediate contacts. Provides a **Public ICE Access Route** via a unique code (`ICE-...`) for emergency medical services (EMS) or first responders.

---

## 🛠️ Technology Stack

- **Backend**: Laravel 13.x (PHP 8.3+)
- **Frontend**: React 19, Inertia.js (React integration), Vite 8.x, Tailwind CSS 4.x
- **Database**: PostgreSQL (Default) or SQLite (Local fallback)
- **External Integrations**:
  - **Supabase**: Used for production database hosting and secure document storage (S3-compatible bucket API).
  - **Google Maps API**: To map and find nearest emergency facilities.
  - **SMS Gateway**: Simulated log-based or live SMS OTP service for secure sign-in sync.

---

## 📦 System Requirements

Ensure you have the following installed on your machine:
- **PHP v8.3** or higher
- **Composer** (PHP dependency manager)
- **Node.js v18+** & **NPM v9+**
- **SQLite** (or **PostgreSQL / Laragon PG SQL** if running default pgsql)

---

## ⚙️ Installation & Setup

Follow these steps to get the project running locally:

### 1. Configure the Environment
Clone the repository, copy the template `.env.example` file to `.env`, and configure your database settings.

```bash
cp .env.example .env
```

> [!NOTE]
> By default, the app is configured for PostgreSQL (`DB_CONNECTION=pgsql`). 
> For a quick local SQLite fallback, you can uncomment/change the following lines in your `.env` file:
> ```env
> DB_CONNECTION=sqlite
> # DB_HOST=127.0.0.1
> # DB_PORT=5432
> # ...
> ```
> And ensure `database/database.sqlite` is created, or let Laravel generate it during migration.

### 2. Automated Initial Setup
MediSync comes with an automated installer script configured in `composer.json` that installs PHP and NPM dependencies, generates the application key, runs migrations, and builds frontend assets.

Run the following command:
```bash
composer run setup
```

### 3. Seed Sample Data
Populate the database with pre-configured mock data (medical terms, emergency facilities, a patient profile, medications, and caregiver accounts):

```bash
php artisan db:seed
```

---

## 🔐 Sample Accounts & Test Credentials

The database seeder initializes a comprehensive Malaysian healthcare profile under the patient name **Hajah Fatimah binti Ahmad**. You can use the following credentials to sign in and explore the system:

### 👤 Patient Account (Primary)
- **Email**: `test@example.com`
- **Password**: `password`
- **ICE Code**: `ICE-9821-MY` (Public route: `/ice/public/ICE-9821-MY`)
- **Caregiver Sync Code**: `MS-FATIMAH-2026`

### 👥 Caregiver Accounts
- **Caregiver 1 (Ahmad Azman)**:
  - **Email**: `ahmad.azman@example.com`
  - **Password**: `password`
- **Caregiver 2 (Siti Nurhaliza)**:
  - **Email**: `siti.nurhaliza@example.com`
  - **Password**: `password`

---

## 💻 Running the Application

To start the local development server (which concurrently spawns the Laravel artisan server, queue worker, log tailer, and Vite assets watcher), run:

```bash
composer run dev
```

The application will be accessible at:
- **Web App**: [http://127.0.0.1:8000](http://127.0.0.1:8000) (or your configured `APP_URL`)
- **Vite Hot Module Reloading (HMR)**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Running Tests

To run the automated PHPUnit test suites:

```bash
composer run test
```
