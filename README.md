# Pregnancy Health Monitoring Application

A comprehensive web application for monitoring pregnancy health, built with React, TypeScript, and Tailwind CSS.

## Features

- **Patient Dashboard**: Track pregnancy progress, health metrics, and appointments
- **Doctor Dashboard**: Monitor multiple patients and manage care
- **Health Tracking**: Blood pressure, sugar levels, baby movements, and weekly updates
- **Emergency Contacts**: Quick access to important contacts
- **Profile Management**: Complete patient profiles with medical information
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pregnancy-health-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── DoctorDashboard.tsx
│   ├── LoginPage.tsx
│   ├── Navigation.tsx
│   ├── PatientDashboard.tsx
│   └── ProfileCompletion.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## Features Overview

### For Patients
- Complete pregnancy profile setup
- Track health metrics (blood pressure, sugar levels, baby movements)
- View pregnancy timeline and milestones
- Access educational content and tips
- Manage emergency contacts
- Communicate with healthcare providers

### For Doctors
- Monitor multiple patients
- View patient health trends
- Receive alerts for concerning metrics
- Manage appointments and schedules
- Send messages and recommendations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern React and TypeScript best practices
- Designed with accessibility and user experience in mind
- Responsive design for all device types