'use client'

import React, { useState, useCallback } from 'react'
import { validateImageFile, IMAGE_CONFIG } from '@/lib/image-storage'

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  productSlug?: string
  maxImages?: number
  existingImages?: string[]
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  productSlug,
  maxImages = 5,
  existingImages = []
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false
  })

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  // Process selected files
  const handleFiles = (files: File[]) => {
    console.log('📁 Processing files:', files.length)
    
    // Reset previous state
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false
    })

    // Validate files
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach(file => {
      const validation = validateImageFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })

    if (errors.length > 0) {
      setUploadState(prev => ({
        ...prev,
        error: errors.join(', ')
      }))
    }

    // Check total images limit
    const totalImages = existingImages.length + validFiles.length
    if (totalImages > maxImages) {
      setUploadState(prev => ({
        ...prev,
        error: `Too many images. Maximum ${maxImages} allowed.`
      }))
      return
    }

    setSelectedFiles(validFiles)
    console.log('✅ Valid files selected:', validFiles.length)
  }

  // Upload images using API endpoint
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadState(prev => ({
        ...prev,
        error: 'No files selected'
      }))
      return
    }

    console.log('🚀 Starting upload for', selectedFiles.length, 'files')
    
    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      success: false
    })

    try {
      // Create form data for API upload
      const formData = new FormData()
      
      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })
      
      if (productSlug) {
        formData.append('productSlug', productSlug)
      }

      console.log('� Uploading via API endpoint...')

      // Upload via API endpoint (uses admin client)
      const response = await fetch('/api/upload-images', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('📤 Upload result:', result)

      if (result.success && result.data.urls && result.data.urls.length > 0) {
        setUploadState({
          uploading: false,
          progress: 100,
          error: null,
          success: true
        })
        onImagesUploaded(result.data.urls)
        setSelectedFiles([])
        console.log('✅ Upload completed successfully')
      } else {
        throw new Error(result.errors?.join(', ') || result.error || 'Upload failed')
      }

    } catch (error) {
      console.error('❌ Upload error:', error)
      setUploadState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
        success: false
      })
    }
  }

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Clear all
  const clearAll = () => {
    setSelectedFiles([])
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      success: false
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploadState.uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl">📷</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {dragActive ? 'Drop images here' : 'Upload Product Images'}
            </h3>
            <p className="text-gray-600 mt-1">
              Drag & drop images or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: {IMAGE_CONFIG.allowedTypes.join(', ')} • Max {IMAGE_CONFIG.maxSize / (1024 * 1024)}MB each • Up to {maxImages} images
            </p>
          </div>
          
          <input
            type="file"
            multiple
            accept={IMAGE_CONFIG.allowedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={uploadState.uploading}
          />
          
          <label
            htmlFor="image-upload"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            Select Images
          </label>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Selected Images ({selectedFiles.length})</h4>
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 text-sm"
              disabled={uploadState.uploading}
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!uploadState.uploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={uploadState.uploading || selectedFiles.length === 0}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${uploadState.uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }
              `}
            >
              {uploadState.uploading 
                ? `Uploading... ${uploadState.progress}%` 
                : 'Upload Images'
              }
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadState.uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadState.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadState.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            <span className="font-semibold">Error:</span> {uploadState.error}
          </p>
          <details className="mt-2">
            <summary className="text-sm text-red-600 cursor-pointer">Debug Info</summary>
            <div className="mt-2 text-xs text-red-600 font-mono">
              <p>Selected files: {selectedFiles.length}</p>
              <p>Product slug: {productSlug || 'none'}</p>
              <p>Existing images: {existingImages.length}</p>
              <p>Upload state: {JSON.stringify(uploadState, null, 2)}</p>
            </div>
          </details>
        </div>
      )}

      {/* Success Message */}
      {uploadState.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            ✅ Images uploaded successfully!
          </p>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Existing Images ({existingImages.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Existing image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
