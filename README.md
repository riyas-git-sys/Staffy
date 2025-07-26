# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Employee Dashboard App

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange)
![Vite](https://img.shields.io/badge/Vite-4.3.9-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.2-blueviolet)

A modern employee management dashboard with authentication, authorization, and CRUD operations for employee profiles.

## Live Demo

[View Live Demo](https://staffy-blond.vercel.app/)

## Features

- 🔐 Firebase Authentication (Email/Password)
- 🛡️ Role-based protected routes
- 👥 Employee profile management
- 📊 Dashboard with key metrics
- 📢 Announcements system
- 📂 Project management
- 🌐 Social links integration
- 📱 Fully responsive design

## Project Structure

employee-dashboard-app/  
├── public/  
├── src/  
│ ├── assets/  
│ ├── components/  
│ ├── config/  
│ ├── context/  
│ ├── hooks/  
│ ├── pages/  
│ ├── services/  
│ ├── styles/  
│ ├── utils/  
│ ├── App.jsx  
│ ├── main.jsx  
│ └── routes.jsx  
├── .env  
├── package.json  
└── vercel.json  


## Employee Roles

- Software Engineer
- UI/UX Designer
- Data Scientist/Analyst
- Sales Executive
- DevOps Engineer
- Product Manager
- Digital Marketing Specialist
- Customer Service Manager
- Financial Analyst
- HR Business Partner
- Operations Manager
- Project Manager

## Departments

- Information Technology (IT)
- Information Technology (IT) / R&D
- Sales & Business Development
- Engineering / R&D
- Marketing
- Customer Service/Support
- Finance & Accounting
- Human Resources (HR)
- Operations

## Prerequisites

- Node.js (v16+ recommended)
- Firebase account
- Vercel account (for deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/employee-dashboard-app.git
   cd employee-dashboard-app
   npm install
   ```

2. Start the Application:
   ```bash
   # Start development server
   npm run dev
   ```

3. For Build:
   ```bash
   # Build for production
   npm run build
   
   # Preview production build locally
   npm run preview
  
   # Run linter
   npm run lint
  
   # Fix linting errors
   npm run lint:fix
   ```

## Deployment

1. First, link your Vercel project:
   ```bash
   vercel login
   vercel link
   ```

2. Deploy to production:
   ```bash
   vercel --prod
   ```

3. First, link your Vercel project:
   ```bash
   npm run full-deploy
   ```
## Create a .env file in the root directory with your Firebase config:

  ```txt
  VITE_FIREBASE_API_KEY=your_api_key  
  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain  
  VITE_FIREBASE_PROJECT_ID=your_project_id  
  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket  
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id  
  VITE_FIREBASE_APP_ID=your_app_id  
  VITE_IMGBB_API_KEY=your_imgbb_key  
  ```

## Technologies Used
⚡ Vite - Next generation frontend tooling

⚛️ React - JavaScript library for building user interfaces

🔥 Firebase - Backend services (Auth, Firestore)

🎨 Tailwind CSS - Utility-first CSS framework

🚀 React Router - Client-side routing

📦 React Icons - Popular icons library

## Contributing 

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Distributed under the MIT License. See LICENSE for more information.

## Contact
Name - @Riznexus - ecriyasahameda@gmail.com - +91 6380123825

Project Link: [Staffy Blond](https://staffy-blond.vercel.app/)

## Additional Notes

1. Make sure to replace placeholder values (like `your_api_key`, `yourusername`, etc.) with your actual information.

2. For the `npm run full-deploy` command to work, add this to your `package.json` scripts:
  ```json
  "scripts": {
    "full-deploy": "npm run build && vercel --prod"
  }
  ```

## License

And here's the separate `LICENSE` file content (should be saved as `LICENSE` in your project root):
MIT License

Copyright (c) 2023 Riznexus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




# @riznexus


.
