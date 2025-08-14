'use client'

import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Shield, LogOut, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AuthTestPage() {
  const { user, isAdmin, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Authentication Test Page
          </CardTitle>
          <CardDescription>
            Test authentication flows and protected routes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <strong>Status:</strong> {user ? 'Logged In' : 'Not Logged In'}
            </div>
            {user && (
              <Badge variant={isAdmin ? 'default' : 'secondary'}>
                <Shield className="h-3 w-3 mr-1" />
                {isAdmin ? 'Admin' : 'Regular User'}
              </Badge>
            )}
          </div>

          {user && (
            <div className="space-y-2">
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>User ID:</strong> <span className="font-mono text-xs">{user.id}</span></div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => router.push('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            {user ? (
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => router.push('/auth')}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Links */}
      <Card>
        <CardHeader>
          <CardTitle>Test Protected Routes</CardTitle>
          <CardDescription>
            Try accessing these routes to test authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Admin Routes (require admin)</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push('/admin')}
                >
                  Admin Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push('/admin/products')}
                >
                  Admin Products
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push('/admin/orders')}
                >
                  Admin Orders
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">User Routes (require login)</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push('/profile')}
                >
                  Profile (if exists)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push('/orders')}
                >
                  My Orders (if exists)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Panel */}
      <AuthDebugPanel />
    </div>
  )
}
