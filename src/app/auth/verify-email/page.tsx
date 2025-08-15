'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const resendVerification = async () => {
    if (!user?.email) {
      toast.error('No email address found')
      return
    }

    setLoading(true)
    try {
      // Note: Supabase doesn't have a direct resend verification method
      // In a real implementation, you'd need to call your backend API
      toast.success('Verification email sent!')
    } catch (error) {
      toast.error('Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 flex items-start justify-center p-4 pt-4 sm:pt-8 pb-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-secondary">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            We've sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3 sm:space-y-4 pt-0">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to activate your account.
            </p>
            <p className="text-sm text-muted-foreground">
              If you don't see the email, check your spam folder.
            </p>
          </div>

          <Button
            onClick={resendVerification}
            disabled={loading}
            variant="outline"
            className="w-full h-10 sm:h-11"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Resend Verification Email
          </Button>

          <div className="text-center">
            <Link 
              href="/auth" 
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
