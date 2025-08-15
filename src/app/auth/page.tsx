'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login')
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 flex items-start justify-center p-4 pt-4 sm:pt-8 pb-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-3 sm:mb-6">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-1 sm:mb-2">
            Swastik Gems & Jewels
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
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
