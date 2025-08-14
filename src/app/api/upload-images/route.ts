/**
 * Image Upload API Route
 * Handles image uploads using admin client to bypass RLS policies
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateImageFile, generateImageFileName, resizeImage, IMAGES_BUCKET } from '@/lib/image-storage'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Image upload API called')
    
    // Get form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const productSlug = formData.get('productSlug') as string || undefined
    
    console.log(`📁 Received ${files.length} files for upload`)
    
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    const results = {
      success: true,
      urls: [] as string[],
      paths: [] as string[],
      errors: [] as string[]
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`📤 Processing file ${i + 1}/${files.length}: ${file.name}`)
      
      try {
        // Validate file
        const validation = validateImageFile(file)
        if (!validation.valid) {
          results.errors.push(`${file.name}: ${validation.error}`)
          results.success = false
          continue
        }

        // Convert file to buffer for server-side processing
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate filename
        const fileName = generateImageFileName(file.name, productSlug)
        console.log(`📝 Generated filename: ${fileName}`)

        // Upload using admin client (bypasses RLS)
        const { data, error } = await supabaseAdmin.storage
          .from(IMAGES_BUCKET)
          .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error(`❌ Upload failed for ${file.name}:`, error)
          results.errors.push(`${file.name}: ${error.message}`)
          results.success = false
          continue
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from(IMAGES_BUCKET)
          .getPublicUrl(fileName)

        results.urls.push(urlData.publicUrl)
        results.paths.push(fileName)
        
        console.log(`✅ Upload successful: ${urlData.publicUrl}`)

      } catch (fileError) {
        console.error(`❌ Error processing ${file.name}:`, fileError)
        results.errors.push(`${file.name}: Processing failed`)
        results.success = false
      }
    }

    console.log(`📊 Upload complete: ${results.urls.length} successful, ${results.errors.length} failed`)

    return NextResponse.json({
      success: results.success,
      data: {
        urls: results.urls,
        paths: results.paths,
        uploaded: results.urls.length,
        failed: results.errors.length
      },
      errors: results.errors.length > 0 ? results.errors : undefined
    })

  } catch (error) {
    console.error('❌ Image upload API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
