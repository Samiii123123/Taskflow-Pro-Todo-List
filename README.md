# 🎯 TaskFlow Pro - Advanced React To-Do List

A modern, feature-rich to-do list application built with React, TypeScript, and Tailwind CSS. TaskFlow Pro combines beautiful design with powerful productivity features to help you organize your life and boost your efficiency.

## ✨ Features

### 🎨 **Beautiful Design**
- **Gradient Themes**: Professional blue-black gradient with smooth animations
- **Glass Morphism**: Modern frosted glass effects with backdrop blur
- **Smooth Animations**: Optimized micro-interactions and transitions
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Rich Icons**: Comprehensive icon system using Lucide React

### 📋 **Core Task Management**
- ✅ **Add Tasks**: Quick add or advanced form with detailed options
- ✏️ **Edit Tasks**: Inline editing for task titles and descriptions
- 🗑️ **Delete Tasks**: Remove individual tasks or bulk clear completed
- ☑️ **Mark Complete**: Toggle task completion with visual feedback
- 📝 **Task Descriptions**: Add detailed notes to any task

### 🏷️ **Advanced Organization**
- **Categories**: Organize tasks by Work, Personal, Health, Learning, Shopping, and more
- **Priority Levels**: High, Medium, Low priority with color coding and icons
- **Tags System**: Add multiple tags for flexible organization
- **Due Dates**: Set deadlines with overdue notifications
- **Time Estimation**: Track estimated time for better planning

### 🔍 **Enhanced Search & Filtering**
- **Comprehensive Search**: Search across task titles, descriptions, tags, priority, and category names
- **Real-time Results**: Instant search results as you type
- **Case-insensitive**: Works regardless of text case
- **Partial Matching**: Finds partial matches within any text field
- **Category Filtering**: Filter by specific categories
- **Status Filters**: View All, Active, Completed, Overdue, Today, or This Week
- **Multiple Sort Options**: Sort by date, priority, category, or alphabetically
- **Show/Hide Completed**: Toggle completed task visibility

### 📊 **Analytics & Insights**
- **Task Statistics**: Total, completed, active, and overdue counts
- **Completion Rate**: Visual progress tracking with percentage
- **Category Distribution**: See task breakdown by category
- **Time Tracking**: Monitor estimated vs actual time spent

### 💾 **Advanced Data Management**
- **Local Storage**: Automatic saving and loading of all data
- **Multi-format Export**: Export to PDF, Excel/CSV, or JSON formats
- **Smart Import**: Import from JSON or CSV/Excel files with intelligent field mapping
- **Data Persistence**: Never lose your tasks between sessions
- **Error Handling**: Graceful handling of data corruption and import errors

### 📤 **Import/Export Features**
- **Excel/CSV Import**: Import tasks from spreadsheet files with flexible column mapping
- **Supported Import Fields**: Task, Description, Status, Priority, Category, Created Date, Due Date, Tags, Estimated Time
- **PDF Export**: Professional formatted task reports
- **CSV Export**: Spreadsheet-compatible format with all task data
- **JSON Backup**: Complete data backup including categories and settings
- **Import Validation**: Automatic data validation and error reporting

### ⌨️ **User Experience**
- **Keyboard Shortcuts**: Press Enter to quickly add tasks
- **Input Validation**: Prevent duplicate and invalid tasks
- **Error Messages**: Clear feedback for user actions
- **Loading States**: Smooth transitions and feedback
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Optimized Animations**: Smooth, conflict-free CSS animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/taskflow-pro.git
   cd taskflow-pro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\` to see the application.

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icon library
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Data Persistence**: Browser localStorage API
- **Build Tool**: Next.js built-in bundler
- **Animations**: Optimized CSS animations with proper property separation

## 📁 Project Structure

\`\`\`
taskflow-pro/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── todo-app.tsx        # Main application component
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Home page
├── lib/
│   └── utils.ts           # Utility functions
└── README.md              # Project documentation
\`\`\`

## 🎯 Usage Guide

### Adding Tasks
1. **Quick Add**: Type in the main input and press Enter
2. **Advanced Add**: Click "Advanced" for detailed task creation with:
   - Task description
   - Category selection
   - Priority level
   - Due date and time
   - Estimated duration
   - Tags

### Managing Tasks
- **Complete**: Click the checkbox to mark tasks as done
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the trash icon to remove tasks
- **Bulk Actions**: Use "Clear Completed" to remove all finished tasks

### Organizing Tasks
- **Filter by Category**: Use the category dropdown to focus on specific areas
- **Set Priorities**: Assign High (🔴), Medium (🟡), or Low (🟢) priorities
- **Add Tags**: Use comma-separated tags for flexible organization
- **Set Due Dates**: Add deadlines to stay on track

### Searching & Filtering
- **Enhanced Search**: Search across titles, descriptions, tags, priorities, and categories
- **Real-time Results**: Instant filtering as you type
- **Advanced Filters**: Choose from All, Active, Completed, Overdue, Today, or This Week
- **Smart Sorting**: Organize by newest, oldest, priority, due date, category, or alphabetically

### Data Management
- **Auto-Save**: All changes are automatically saved to your browser
- **Export Options**: Download as PDF report, Excel/CSV spreadsheet, or JSON backup
- **Import Data**: Upload JSON backups or CSV/Excel files with automatic field mapping
- **Supported CSV Columns**: Task, Description, Status, Priority, Category, Created Date, Due Date, Tags, Estimated Time

## 📊 Import/Export Guide

### CSV/Excel Import Format
Your CSV file can include any of these columns (column names are flexible):

| Column | Alternative Names | Description | Example |
|--------|------------------|-------------|---------|
| Task | Title, Name, Text | Task title (required) | "Complete project proposal" |
| Description | - | Task details | "Review and finalize the Q4 proposal" |
| Status | - | Completion status | "Active", "Completed", "Done" |
| Priority | - | Task priority | "High", "Medium", "Low", "Urgent" |
| Category | - | Task category | "Work", "Personal", "Health" |
| Created Date | CreatedDate | When task was created | "12/15/2024" |
| Due Date | DueDate, Due | Task deadline | "12/20/2024" |
| Tags | Tag | Comma-separated tags | "urgent, meeting, review" |
| Estimated Time | EstimatedTime, Estimate | Time in minutes | "60" |

### Export Formats
- **PDF**: Professional report with statistics and formatted task list
- **Excel/CSV**: Spreadsheet format with all task data and dates
- **JSON**: Complete backup including categories and all metadata

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: \`git checkout -b feature/amazing-feature\`
3. **Commit your changes**: \`git commit -m 'Add amazing feature'\`
4. **Push to the branch**: \`git push origin feature/amazing-feature\`
5. **Open a Pull Request**

**© 2024 TaskFlow Pro. All rights reserved.**

*Made by Lakshay Dhoundiyal*

*Boost your productivity, organize your life, achieve your goals.*
