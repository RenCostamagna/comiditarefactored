'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RefreshCw, AlertTriangle, Home, Bug } from 'lucide-react'
import { getErrorMessage } from '@/lib/errors'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                ¡Ups! Algo salió mal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  {getErrorMessage(this.state.error)}
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={this.handleReset} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Recargar página
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer font-medium">
                    Detalles técnicos (solo en desarrollo)
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

interface AsyncErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error) => void
}

export function AsyncErrorBoundary({ 
  children, 
  fallback,
  onError 
}: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={fallback ? undefined : <ErrorFallback />}
      onError={(error, errorInfo) => {
        onError?.(error)
        console.error('Async error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

function ErrorFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  const handleError = (error: Error) => {
    console.error('Error handled:', error)
    
    // In a real app, you might want to send this to a logging service
    // logErrorToService(error)
    
    // For now, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }
  }

  return { handleError }
}

// Component for displaying inline errors
interface InlineErrorProps {
  error: Error | string | null
  className?: string
  onRetry?: () => void
}

export function InlineError({ error, className, onRetry }: InlineErrorProps) {
  if (!error) return null

  const errorMessage = typeof error === 'string' ? error : getErrorMessage(error)

  return (
    <Alert className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{errorMessage}</span>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Component for form field errors
interface FieldErrorProps {
  error?: string
  className?: string
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null

  return (
    <p className={`text-sm text-destructive ${className}`}>
      {error}
    </p>
  )
}

// Component for API errors
interface ApiErrorProps {
  error: Error | null
  onRetry?: () => void
  className?: string
}

export function ApiError({ error, onRetry, className }: ApiErrorProps) {
  if (!error) return null

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Error de conexión</p>
            <p className="text-sm text-muted-foreground mt-1">
              {getErrorMessage(error)}
            </p>
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry} className="mt-3">
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for network errors
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Sin conexión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No se pudo conectar con el servidor. Verifica tu conexión a internet.
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Component for not found errors
export function NotFound({ 
  title = 'Página no encontrada',
  description = 'La página que buscas no existe o ha sido movida.',
  onGoHome
}: {
  title?: string
  description?: string
  onGoHome?: () => void
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          <Button onClick={onGoHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Ir al inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}