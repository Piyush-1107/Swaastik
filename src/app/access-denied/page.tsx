'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Home, LogIn, ArrowLeft } from 'lucide-react'

function AccessDeniedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const getErrorMessage = () => {
    switch (reason) {
      case 'admin_required':
        return {
          title: 'Administrator Access Required',
          description: 'This page is restricted to administrators only. You need admin privileges to access this section.',
          suggestion: 'Contact your system administrator if you believe you should have access to this area.'
        }
      case 'verification_failed':
        return {
          title: 'Verification Failed',
          description: 'We could not verify your permissions at this time. This might be due to a temporary issue.',
          suggestion: 'Please try logging out and logging back in, or contact support if the problem persists.'
        }
      case 'auth_required':
        return {
          title: 'Authentication Required',
          description: 'You need to be logged in to access this page.',
          suggestion: 'Please log in with your account to continue.'
        }
      default:
        return {
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          suggestion: 'Contact support if you believe this is an error.'
        }
    }
  }

  const { title, description, suggestion } = getErrorMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {suggestion}
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Redirecting to home page in {countdown} seconds...</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => router.push('/')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
            
            {reason === 'auth_required' ? (
              <Button 
                onClick={() => router.push('/auth')}
                variant="outline"
                className="flex-1"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            ) : (
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setCountdown(0)
                router.push('/')
              }}
              className="text-xs"
            >
              Skip countdown
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <AccessDeniedContent />
    </Suspense>
  )
}
