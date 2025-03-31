import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Maximum file size: 10MB (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data and file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    const validTypes = [
      'audio/mpeg',        // MP3
      'audio/mp4',         // MP4 audio
      'audio/wav',         // WAV
      'audio/x-wav',       // WAV (alternative MIME type)
      'audio/ogg',         // OGG
      'audio/flac',        // FLAC
      'audio/aac',         // AAC
      'audio/webm',        // WebM audio
      'audio/x-m4a',       // M4A
      'audio/x-aiff',      // AIFF
      'audio/x-ms-wma'     // WMA
    ];

    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a supported audio file.' },
        { status: 400 }
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
      .from('voice-uploads')  // Changed bucket name
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('voice-uploads')  // Changed bucket name
      .getPublicUrl(fileName);

    // Record the upload in the database
    const { error: dbError } = await supabase
      .from('uploads')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: fileName,
        file_type: 'audio',  // Changed file type
        file_size: file.size,
        public_url: urlData.publicUrl
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB recording fails
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      url: urlData.publicUrl
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    return NextResponse.json(
      { error: 'Server error while processing upload' },
      { status: 500 }
    );
  }
}