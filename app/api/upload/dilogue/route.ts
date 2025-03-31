import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the form data and file
    const formData = await request.formData();
    const file = formData.get('file') as File;
   
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate file type
    const fileType = file.type;
    const validTypes = [
      'audio/mpeg',      // MP3
      'audio/wav',       // WAV
      'audio/x-m4a',     // M4A (Apple)
      'audio/ogg',       // OGG
      'audio/flac',      // FLAC
      'audio/aac',       // AAC
      'audio/webm',      // WebM Audio
      'audio/mp4',       // MP4 Audio
      'audio/x-aiff',    // AIFF
      'audio/x-wav'      // Alternative WAV format
    ];
   
    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload MP3, WAV, or M4A files.' },
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate a unique file path
    const userId = session.user.email || 'unknown';
    const fileName = `${userId}/${uuidv4()}-${file.name}`;
   
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
   
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('dialogue-uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      });
     
    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json(
        { error: error.message },
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
   
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('dialogue-uploads')
      .getPublicUrl(fileName);

    // Log the response data for debugging
    console.log('Preparing response data:', {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      url: urlData.publicUrl
    });
     
    // Record the upload in the database
    const { error: dbError } = await supabase
      .from('uploads')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: fileName,
        file_type: 'dialogue',
        file_size: file.size,
        public_url: urlData.publicUrl
      });
     
    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB recording fails
    }
   
    return NextResponse.json(
      {
        success: true,
        fileName: file.name,
        fileSize: file.size,
        url: urlData.publicUrl
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
   
  } catch (error) {
    console.error('Dialogue upload error:', error);
    return NextResponse.json(
      {
        error: 'Server error while processing upload'
      },
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}