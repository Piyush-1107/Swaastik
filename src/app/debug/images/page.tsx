'use client'

import { ImageDebugPanel } from '@/components/debug/ImageDebugPanel'

export default function ImageDebugPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Image Loading Debug</h1>
        <p className="text-gray-600 mt-2">
          Debug image loading issues with your product images
        </p>
      </div>
      
      <ImageDebugPanel />
    </div>
  )
}
