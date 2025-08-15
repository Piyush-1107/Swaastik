'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onToggleMode: () => void
  redirectTo?: string
}

export function AuthForm({ mode, onToggleMode, redirectTo = '/' }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
      toast.error('Login timeout. Please try again.')
    }, 15000) // 15 second timeout

    try {
      if (mode === 'signup') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        // Validate password strength
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          return
        }

        console.log('🔄 Starting signup process...')
        const { user, error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          phone: formData.phone
        })

        clearTimeout(timeoutId)

        if (error) {
          console.error('❌ Signup error:', error)
          toast.error(error.message || 'Signup failed')
        } else {
          console.log('✅ Signup successful')
          toast.success('Account created successfully! Please check your email for verification.')
          router.push('/auth/verify-email')
        }
      } else {
        console.log('🔄 Starting login process...')
        const { user, error } = await signIn(formData.email, formData.password)

        clearTimeout(timeoutId)

        if (error) {
          console.error('❌ Login error:', error)
          toast.error(error.message || 'Login failed')
        } else {
          console.log('✅ Login successful, user:', user?.email)
          toast.success('Logged in successfully!')
          
          // Wait a bit for auth state to update before redirecting
          setTimeout(() => {
            router.push(redirectTo)
          }, 1000)
        }
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('❌ Unexpected error:', error)
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      // Clear timeout in case it hasn't fired
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl text-secondary">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {mode === 'login' 
            ? 'Sign in to your Swastik Gems account' 
            : 'Join the Swastik Gems family'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-10 sm:h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 h-10 sm:h-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 h-10 sm:h-11"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-10 sm:h-11"
            disabled={loading}
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={onToggleMode}
              className="ml-1 text-primary hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
