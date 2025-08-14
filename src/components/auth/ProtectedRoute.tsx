'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, ShieldAlert, Home, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
  showAccessDenied?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = '/auth',
  showAccessDenied = true
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    if (!loading) {
      console.log('🔐 ProtectedRoute check:', {
        user: !!user,
        isAdmin,
        requireAdmin,
        userEmail: user?.email
      })

      if (!user) {
        console.log('❌ No user found, redirecting to login')
        setShouldRedirect(true)
        // Small delay to prevent flash
        setTimeout(() => {
          router.push(redirectTo)
        }, 500)
        return
      }

      if (requireAdmin && !isAdmin) {
        console.log('❌ Admin required but user is not admin')
        setAccessDenied(true)
        return
      }

      console.log('✅ Access granted')
    }
  }, [user, loading, isAdmin, requireAdmin, router, redirectTo])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Loading...</h2>
              <p className="text-muted-foreground">
                Checking your authentication status
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show redirecting state
  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <LogIn className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Redirecting you to the login page...
              </p>
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied for non-admin users trying to access admin pages
  if (accessDenied && showAccessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have the necessary permissions to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>This page is restricted to administrators only.</p>
              <p className="mt-2">
                Contact support if you believe this is an error.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.push('/')}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
              <Button 
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and has proper permissions
  if (user && (!requireAdmin || isAdmin)) {
    return <>{children}</>
  }

  // Fallback - shouldn't reach here but just in case
  return null
}
