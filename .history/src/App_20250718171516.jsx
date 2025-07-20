import tailwind from 'eslint-plugin-tailwindcss';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Employee Dashboard App
      </h1>
      <h1 className="!text-red-500">Test</h1>
      <p className="mt-4 text-gray-700">
        This page is using Tailwind CSS!
      </p>
    </div>
  );
}
