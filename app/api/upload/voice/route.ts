import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
    externalResolver: true, // Enable external resolver to handle large file uploads
  },
};

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // File validation
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // File type validation
    const validTypes = [
      'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav',
      'audio/ogg', 'audio/flac', 'audio/aac', 'audio/webm',
      'audio/x-m4a', 'audio/x-aiff', 'audio/x-ms-wma'
    ];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // File path generation
    const userId = session.user.email || 'unknown';
    const fileName = `${userId}/${uuidv4()}-${file.name}`;

    // Convert to readable stream
    const fileStream = file.stream();
    const readableStream = new ReadableStream({
      start(controller) {
        const reader = fileStream.getReader();
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          });
        }
        push();
      }
    });

    // Upload to Supabase using streams
    const { error: uploadError } = await supabase.storage
      .from('voice-uploads')
      .upload(fileName, readableStream, {
        contentType: file.type,
        cacheControl: '3600',
        duplex: 'half' // Required for streaming
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'File upload failed' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('voice-uploads')
      .getPublicUrl(fileName);

    // Database record (fire-and-forget)
    supabase
      .from('uploads')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: fileName,
        file_type: 'audio',
        file_size: file.size,
        public_url: urlData.publicUrl
      })
      .then(({ error }) => {
        if (error) console.error('DB insert error:', error);
      });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      url: urlData.publicUrl
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}