'use client'

import React, { useState, useCallback, useRef } from 'react'
import { uploadMultipleImages, validateImageFile, IMAGE_CONFIG } from '@/lib/image-storage'

interface ImageUploadProps {
  onImagesUploaded: (urls: string[], paths: string[]) => void
  productSlug?: string
  maxImages?: number
  existingImages?: string[]
  className?: string
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
}

export default function ImageUpload({
  onImagesUploaded,
  productSlug,
  maxImages = 5,
  existingImages = [],
  className = ''
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null
  })
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  // File selection handler
  const handleFiles = useCallback((files: File[]) => {
    const remainingSlots = maxImages - existingImages.length
    const filesToProcess = files.slice(0, remainingSlots)
    
    // Validate files
    const validFiles: File[] = []
    const errors: string[] = []

    filesToProcess.forEach(file => {
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
    } else {
      setUploadState(prev => ({ ...prev, error: null }))
    }

    setSelectedFiles(validFiles)
  }, [maxImages, existingImages.length])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  // Upload handler
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploadState({
      uploading: true,
      progress: 0,
      error: null
    })

    try {
      const result = await uploadMultipleImages(
        selectedFiles,
        productSlug,
        (completed, total) => {
          setUploadState(prev => ({
            ...prev,
            progress: Math.round((completed / total) * 100)
          }))
        }
      )

      if (result.success) {
        onImagesUploaded(result.urls, result.paths)
        setSelectedFiles([])
        setUploadState({
          uploading: false,
          progress: 100,
          error: null
        })
      } else {
        setUploadState({
          uploading: false,
          progress: 0,
          error: result.errors.join(', ') || 'Upload failed'
        })
      }
    } catch (error) {
      setUploadState({
        uploading: false,
        progress: 0,
        error: 'Upload failed'
      })
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const remainingSlots = maxImages - existingImages.length
  const canUpload = selectedFiles.length > 0 && !uploadState.uploading

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${remainingSlots === 0 ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={IMAGE_CONFIG.allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={remainingSlots === 0}
        />

        <div className="space-y-2">
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={remainingSlots === 0}
              className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
            >
              Upload images
            </button>
            <span className="text-gray-500"> or drag and drop</span>
          </div>
          
          <p className="text-sm text-gray-500">
            PNG, JPG, WEBP up to {IMAGE_CONFIG.maxSize / (1024 * 1024)}MB
            {remainingSlots > 0 && ` (${remainingSlots} slots remaining)`}
          </p>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Selected Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeSelectedFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
              </div>
            ))}
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{uploadState.error}</p>
        </div>
      )}

      {/* Upload Button */}
      {canUpload && (
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''}
        </button>
      )}

      {/* Existing Images Display */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Current Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingImages.map((url, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
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
