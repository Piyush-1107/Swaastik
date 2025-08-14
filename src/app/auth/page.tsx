'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-secondary mb-2">
            Swastik Gems & Jewels
          </h1>
          <p className="text-muted-foreground">
            Authentic Jewelry, Timeless Elegance
          </p>
        </div>
        
        <AuthForm 
          mode={mode} 
          onToggleMode={toggleMode}
          redirectTo="/"
        />
      </div>
    </div>
  )
}
