'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        toast.error(error.message)
      } else {
        setSent(true)
        toast.success('Password reset email sent!')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 flex items-start justify-center p-4 pt-4 sm:pt-8 pb-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Send className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-secondary">
              Email Sent
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Check your email for password reset instructions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                If you don't see the email, check your spam folder.
              </p>
            </div>

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

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 flex items-start justify-center p-4 pt-4 sm:pt-8 pb-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl text-secondary">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your email address and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 sm:h-11"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-11"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
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
