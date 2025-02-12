# Interview Scheduler

A React application that allows HR/Recruiters to schedule, manage, and view interviews efficiently.

## Features

- **Interview Scheduling**
  - Schedule interviews with candidate name, interviewer, date, time, and type
  - Automatic conflict detection for overlapping interviews
  - Support for multiple interview types (Technical, HR, Behavioral)

- **Interview Dashboard**
  - Calendar view of all scheduled interviews
  - Filter interviews by:
    - Interviewer
    - Candidate
    - Date range
  - Real-time updates with Redux state management

- **Interview Management**
  - Edit existing interviews
  - Delete interviews with confirmation
  - Success/error notifications
  - Data persistence using localStorage

## Tech Stack

- React (with Hooks)
- Redux Toolkit for state management
- FullCalendar for calendar view
- TailwindCSS for styling
- Vite for build tooling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd interview-scheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Design Decisions

1. **State Management**
   - Used Redux Toolkit for centralized state management
   - Implemented localStorage persistence for data retention
   - Separate slices for interviews and UI state

2. **UI/UX**
   - Responsive design using TailwindCSS
   - Intuitive calendar interface with FullCalendar
   - Modal-based forms for interview scheduling
   - Real-time notifications for user actions

3. **Data Structure**
   - Interviews stored with unique IDs
   - Conflict detection for overlapping schedules
   - Efficient filtering system

## Assumptions

1. Interviews are 1 hour long by default
2. Working hours are not restricted
3. Interviewers are predefined in the system
4. All times are in the local timezone
