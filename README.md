# MCQ Exam Preparation Web App

A full-stack Multiple Choice Question (MCQ) exam preparation system built with Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, and Supabase.

## Features

### Admin Panel
- Secure admin login with session management
- Complete CRUD operations for questions
- Manage questions by subject
- Beautiful card-based UI for question management

### User Interface
- Subject selection homepage
- Interactive quiz interface with one question per page
- Progress tracking and question navigation
- Real-time answer selection
- Comprehensive result page with detailed analysis

### API Routes
- `/api/admin/login` - Admin authentication
- `/api/admin/logout` - Admin logout
- `/api/admin/verify` - Verify admin session
- `/api/questions` - Get/Create questions
- `/api/questions/[id]` - Update/Delete questions
- `/api/subjects` - Get all available subjects
- `/api/quiz/submit` - Submit quiz and calculate score

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              # Admin login page
│   │   └── dashboard/
│   │       └── page.tsx              # Admin dashboard with CRUD
│   ├── quiz/
│   │   └── [subject]/
│   │       ├── page.tsx              # Quiz interface
│   │       └── result/
│   │           └── page.tsx          # Quiz results page
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts        # Admin login API
│   │   │   ├── logout/route.ts       # Admin logout API
│   │   │   └── verify/route.ts       # Verify admin session
│   │   ├── questions/
│   │   │   ├── route.ts              # Get/Create questions
│   │   │   └── [id]/route.ts         # Update/Delete questions
│   │   ├── subjects/
│   │   │   └── route.ts              # Get all subjects
│   │   └── quiz/
│   │       └── submit/route.ts       # Submit quiz
│   ├── layout.tsx
│   ├── page.tsx                      # Homepage (subject selection)
│   └── globals.css
├── components/
│   └── ui/                           # Shadcn UI components
├── lib/
│   ├── supabase.ts                   # Supabase client
│   ├── types.ts                      # TypeScript types
│   ├── auth.ts                       # Authentication utilities
│   └── utils.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Database Schema

### Tables

#### `admins`
- `id` (uuid, primary key)
- `username` (text, unique)
- `password` (text, bcrypt hashed)
- `created_at` (timestamptz)

#### `questions`
- `id` (uuid, primary key)
- `question_text` (text)
- `option_a` (text)
- `option_b` (text)
- `option_c` (text)
- `option_d` (text)
- `correct_index` (integer, 0-3)
- `subject` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### `quiz_results`
- `id` (uuid, primary key)
- `subject` (text)
- `total_questions` (integer)
- `correct_answers` (integer)
- `wrong_answers` (integer)
- `score_percentage` (numeric)
- `created_at` (timestamptz)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get these values from your Supabase project settings:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL, anon/public key, and service_role key

### 3. Database Setup

The database schema has already been created via migrations. The default admin credentials are:
- Username: `admin`
- Password: `admin123`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### For Administrators

1. **Login**: Navigate to `/admin/login` or click "Admin Login" from the homepage
2. **Add Questions**: Click "Add Question" button on the dashboard
3. **Fill in Details**:
   - Subject (e.g., Mathematics, Science, History)
   - Question text
   - Four options (A, B, C, D)
   - Select the correct answer
4. **Edit Questions**: Click the edit icon on any question card
5. **Delete Questions**: Click the delete icon (requires confirmation)

### For Users

1. **Select Subject**: Choose a subject from the homepage
2. **Take Quiz**:
   - Read each question carefully
   - Select your answer using radio buttons
   - Navigate between questions using Next/Previous buttons
   - Track your progress at the top
   - Use question navigation to jump to specific questions
3. **Submit Quiz**: Click "Submit Quiz" on the last question
4. **View Results**: See your score, detailed breakdown, and which answers were correct/incorrect

## Key Features Explained

### Question Management
- Questions are organized by subject
- Each question has 4 options with one correct answer
- Questions can be edited or deleted at any time
- Real-time updates on the dashboard

### Quiz Interface
- One question per page for focused attention
- Progress bar showing completion status
- Answer selection preserved when navigating
- Question grid for quick navigation
- Warning before submitting incomplete quizzes

### Result Analysis
- Overall score percentage
- Total questions count
- Correct and wrong answers breakdown
- Detailed question-by-question review
- Color-coded results for easy understanding
- Option to retake quiz or return home

### Security
- Admin sessions managed with HTTP-only cookies
- Passwords hashed with bcrypt
- Row Level Security (RLS) enabled on all tables
- API routes protected with session verification
- Secure service role access for admin operations

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Beautiful, accessible components
- **Supabase**: Database and backend services
- **bcryptjs**: Password hashing
- **Lucide React**: Icon library

## Building for Production

```bash
npm run build
npm run start
```

## Notes

- The app uses Supabase for database operations
- Admin authentication uses cookie-based sessions
- All API routes are server-side for security
- The UI is fully responsive and works on all devices
- Questions are fetched dynamically based on selected subject

## Support

For issues or questions, please refer to the documentation or check the API routes implementation.
