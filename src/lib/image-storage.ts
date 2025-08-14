/**
 * Supabase Image Storage Utilities
 * Handles image upload, management, and URL generation for product images
 */

import { supabase, supabaseAdmin } from './supabase'

// Storage bucket name for product images
export const IMAGES_BUCKET = 'product-images'

// Image configuration
export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
  thumbnailSize: 300
}

/**
 * Initialize storage bucket (run this once during setup)
 */
export const initializeImageBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return false
    }

    const bucketExists = buckets?.some(bucket => bucket.name === IMAGES_BUCKET)

    if (!bucketExists) {
      // Create bucket
      const { data, error } = await supabaseAdmin.storage.createBucket(IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: IMAGE_CONFIG.maxSize,
        allowedMimeTypes: IMAGE_CONFIG.allowedTypes
      })

      if (error) {
        console.error('Error creating bucket:', error)
        return false
      }

      console.log('✅ Image bucket created successfully')
    } else {
      console.log('✅ Image bucket already exists')
    }

    return true
  } catch (error) {
    console.error('Error initializing image bucket:', error)
    return false
  }
}

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${IMAGE_CONFIG.allowedTypes.join(', ')}`
    }
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`
    }
  }

  return { valid: true }
}

/**
 * Resize image on client side
 */
export const resizeImage = (file: File, maxWidth: number = IMAGE_CONFIG.maxWidth, maxHeight: number = IMAGE_CONFIG.maxHeight): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Failed to resize image'))
          }
        },
        file.type,
        IMAGE_CONFIG.quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate unique filename
 */
export const generateImageFileName = (originalName: string, productSlug?: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  
  if (productSlug) {
    return `${productSlug}/${timestamp}-${random}.${extension}`
  }
  
  return `${timestamp}-${random}.${extension}`
}

/**
 * Upload single image to Supabase Storage
 */
export const uploadImage = async (
  file: File, 
  productSlug?: string,
  resize: boolean = true
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> => {
  try {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Resize if needed
    let fileToUpload = file
    if (resize) {
      try {
        fileToUpload = await resizeImage(file)
      } catch (resizeError) {
        console.warn('Image resize failed, using original:', resizeError)
        fileToUpload = file
      }
    }

    // Generate filename
    const fileName = generateImageFileName(file.name, productSlug)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(IMAGES_BUCKET)
      .getPublicUrl(fileName)

    return {
      success: true,
      url: urlData.publicUrl,
      path: fileName
    }

  } catch (error) {
    console.error('Image upload error:', error)
    return { success: false, error: 'Upload failed' }
  }
}

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (
  files: File[],
  productSlug?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: boolean; urls: string[]; paths: string[]; errors: string[] }> => {
  const results = {
    success: true,
    urls: [] as string[],
    paths: [] as string[],
    errors: [] as string[]
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const result = await uploadImage(file, productSlug)

    if (result.success && result.url && result.path) {
      results.urls.push(result.url)
      results.paths.push(result.path)
    } else {
      results.errors.push(result.error || `Failed to upload ${file.name}`)
      results.success = false
    }

    // Report progress
    onProgress?.(i + 1, files.length)
  }

  return results
}

/**
 * Delete image from storage
 */
export const deleteImage = async (imagePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .remove([imagePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete image error:', error)
    return { success: false, error: 'Delete failed' }
  }
}

/**
 * Delete multiple images
 */
export const deleteMultipleImages = async (imagePaths: string[]): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .remove(imagePaths)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete images error:', error)
    return { success: false, error: 'Delete failed' }
  }
}

/**
 * Get image URL from path
 */
export const getImageUrl = (imagePath: string): string => {
  const { data } = supabase.storage
    .from(IMAGES_BUCKET)
    .getPublicUrl(imagePath)
  
  return data.publicUrl
}

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  imagePath: string, 
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  } = {}
): string => {
  const baseUrl = getImageUrl(imagePath)
  
  // Supabase doesn't have built-in image transformations
  // But we can add query parameters for frontend optimization
  const params = new URLSearchParams()
  
  if (options.width) params.set('width', options.width.toString())
  if (options.height) params.set('height', options.height.toString())
  if (options.quality) params.set('quality', options.quality.toString())
  if (options.format) params.set('format', options.format)
  
  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl
}

/**
 * Generate thumbnail URL
 */
export const getThumbnailUrl = (imagePath: string): string => {
  return getOptimizedImageUrl(imagePath, {
    width: IMAGE_CONFIG.thumbnailSize,
    height: IMAGE_CONFIG.thumbnailSize,
    quality: 80,
    format: 'webp'
  })
}

/**
 * List all images for a product
 */
export const listProductImages = async (productSlug: string): Promise<{ success: boolean; images: string[]; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .list(productSlug)

    if (error) {
      return { success: false, images: [], error: error.message }
    }

    const images = data?.map(file => `${productSlug}/${file.name}`) || []
    return { success: true, images }
  } catch (error) {
    console.error('List images error:', error)
    return { success: false, images: [], error: 'Failed to list images' }
  }
}

/**
 * Get storage usage statistics
 */
export const getStorageStats = async (): Promise<{
  success: boolean
  totalSize?: number
  fileCount?: number
  error?: string
}> => {
  try {
    // Note: Supabase doesn't provide direct storage stats
    // This would need to be implemented with a database function
    // For now, we'll return a placeholder
    return {
      success: true,
      totalSize: 0,
      fileCount: 0
    }
  } catch (error) {
    return { success: false, error: 'Failed to get storage stats' }
  }
}
