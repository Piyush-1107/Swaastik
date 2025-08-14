/**
 * Auth Debug Component
 * Add this to any page to debug authentication issues
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, RefreshCw, User, Shield, Database } from 'lucide-react'

export function AuthDebugPanel() {
  const { user, session, loading, isAdmin } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [refreshing, setRefreshing] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const refreshDebugInfo = async () => {
    setRefreshing(true)
    try {
      // Get session info
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      // Check admin status if user exists
      let adminCheck = null
      if (sessionData.session?.user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single()
        
        adminCheck = { data: adminData, error: adminError }
      }

      // Get user metadata
      const userMetadata = sessionData.session?.user?.user_metadata || {}
      const appMetadata = sessionData.session?.user?.app_metadata || {}

      setDebugInfo({
        timestamp: new Date().toISOString(),
        session: {
          exists: !!sessionData.session,
          error: sessionError?.message,
          accessToken: sessionData.session?.access_token ? 'Present' : 'Missing',
          refreshToken: sessionData.session?.refresh_token ? 'Present' : 'Missing',
          expiresAt: sessionData.session?.expires_at 
            ? new Date(sessionData.session.expires_at * 1000).toISOString()
            : 'Unknown'
        },
        user: {
          id: sessionData.session?.user?.id,
          email: sessionData.session?.user?.email,
          emailConfirmed: sessionData.session?.user?.email_confirmed_at ? 'Yes' : 'No',
          createdAt: sessionData.session?.user?.created_at,
          lastSignIn: sessionData.session?.user?.last_sign_in_at,
          userMetadata,
          appMetadata
        },
        admin: {
          isAdmin: isAdmin,
          checkData: adminCheck?.data,
          checkError: adminCheck?.error?.message,
          errorCode: adminCheck?.error?.code
        },
        context: {
          loading,
          userFromContext: !!user,
          sessionFromContext: !!session,
          isAdminFromContext: isAdmin
        },
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
        }
      })
    } catch (error) {
      console.error('Debug refresh error:', error)
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
    setRefreshing(false)
  }

  useEffect(() => {
    refreshDebugInfo()
  }, [user, session, isAdmin, loading])

  const getStatusBadge = (status: boolean | string | null | undefined, trueLabel = 'Yes', falseLabel = 'No') => {
    if (status === true || status === trueLabel) {
      return <Badge variant="default" className="bg-green-100 text-green-800">✅ {trueLabel}</Badge>
    }
    if (status === false || status === falseLabel) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">❌ {falseLabel}</Badge>
    }
    return <Badge variant="outline">❓ Unknown</Badge>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Debug Panel
            </CardTitle>
            <CardDescription>
              Current status: {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
              {user && ` • ${isAdmin ? 'Admin' : 'Regular user'}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                refreshDebugInfo()
              }}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
            {/* Quick Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <User className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">User Status</div>
                {getStatusBadge(!!user, 'Logged In', 'Not Logged In')}
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Admin Status</div>
                {getStatusBadge(isAdmin, 'Admin', 'Regular')}
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Database className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Session</div>
                {getStatusBadge(!!session, 'Active', 'None')}
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">Loading</div>
                {getStatusBadge(loading, 'Loading', 'Ready')}
              </div>
            </div>

            {/* Detailed Info */}
            {debugInfo.timestamp && (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(debugInfo.timestamp).toLocaleString()}
                </div>

                {/* Session Info */}
                <div>
                  <h4 className="font-semibold mb-2">Session Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded">
                    <div>Session Exists: {getStatusBadge(debugInfo.session?.exists)}</div>
                    <div>Access Token: {getStatusBadge(debugInfo.session?.accessToken === 'Present')}</div>
                    <div>Refresh Token: {getStatusBadge(debugInfo.session?.refreshToken === 'Present')}</div>
                    <div>Expires At: <span className="font-mono text-xs">{debugInfo.session?.expiresAt}</span></div>
                    {debugInfo.session?.error && (
                      <div className="col-span-2 text-red-600">Error: {debugInfo.session.error}</div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                {debugInfo.user?.id && (
                  <div>
                    <h4 className="font-semibold mb-2">User Information</h4>
                    <div className="text-sm bg-muted/30 p-3 rounded space-y-1">
                      <div><strong>ID:</strong> <span className="font-mono text-xs">{debugInfo.user.id}</span></div>
                      <div><strong>Email:</strong> {debugInfo.user.email}</div>
                      <div><strong>Email Confirmed:</strong> {getStatusBadge(debugInfo.user.emailConfirmed === 'Yes')}</div>
                      <div><strong>Created:</strong> {new Date(debugInfo.user.createdAt).toLocaleString()}</div>
                      <div><strong>Last Sign In:</strong> {debugInfo.user.lastSignIn ? new Date(debugInfo.user.lastSignIn).toLocaleString() : 'Never'}</div>
                    </div>
                  </div>
                )}

                {/* Admin Info */}
                <div>
                  <h4 className="font-semibold mb-2">Admin Status</h4>
                  <div className="text-sm bg-muted/30 p-3 rounded space-y-1">
                    <div><strong>Is Admin (Context):</strong> {getStatusBadge(debugInfo.admin?.isAdmin)}</div>
                    <div><strong>Admin Record:</strong> {debugInfo.admin?.checkData ? 'Found' : 'Not Found'}</div>
                    {debugInfo.admin?.checkData && (
                      <div><strong>Role:</strong> <Badge>{debugInfo.admin.checkData.role}</Badge></div>
                    )}
                    {debugInfo.admin?.checkError && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {debugInfo.admin.checkError} 
                        {debugInfo.admin.errorCode && ` (${debugInfo.admin.errorCode})`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Raw Debug Data */}
                <details className="text-xs">
                  <summary className="cursor-pointer font-semibold mb-2">Raw Debug Data</summary>
                  <pre className="bg-muted/50 p-3 rounded overflow-auto max-h-60">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}
        </CardContent>
      )}
    </Card>
  )
}
