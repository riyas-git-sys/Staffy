import tailwind from 'eslint-plugin-tailwindcss';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  return (
    <div style={{ backgroundColor: 'red', padding: '20px' }}>
      <h1 style={{ color: 'white' }}>RAW HTML TEST (no Tailwind)</h1>
      <p>If you see this, React is working but Tailwind isn't</p>
    </div>
  )
}