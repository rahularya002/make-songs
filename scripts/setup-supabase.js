// scripts/setup-supabase.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

// Make sure to use the service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupSupabase() {
  console.log('Setting up Supabase storage buckets...');
 
  // Define storage buckets
  const buckets = [
    { name: 'voice-uploads', public: true },
    { name: 'lyrics-uploads', public: true },
    { name: 'dialogue-uploads', public: true }
  ];

  try {
    // Get existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      // If we can't even list buckets, there might be an issue with the service role key
      console.log('Please check that:');
      console.log('1. You are using the service role key (starts with "eyJh..."), not the anon key');
      console.log('2. The key has been properly copied to your .env file without extra spaces');
      throw listError;
    }

    for (const bucket of buckets) {
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name);
      if (!bucketExists) {
        console.log(`Creating bucket: ${bucket.name}`);
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public
        });
        
        if (error) {
          console.error(`Error creating ${bucket.name}:`, error);
          console.log('This is likely a permissions issue with your service role key or RLS policies.');
        } else {
          console.log(`Created bucket: ${bucket.name}`);
        }
      } else {
        console.log(`Bucket ${bucket.name} already exists`);
      }
    }
  } catch (error) {
    console.error('Error processing buckets:', error);
  }

  console.log('Setting up uploads table...');
 
  // Check if uploads table exists and create it if it doesn't
  try {
    const { data, error: checkError } = await supabase
      .from('uploads')
      .select('id')
      .limit(1);
   
    if (checkError && checkError.code === '42P01') {
      console.log('Uploads table does not exist. Creating it now...');
      
      // Create the table using SQL query
      const { error: createError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE uploads (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            public_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          CREATE INDEX idx_uploads_user_id ON uploads(user_id);
        `
      });
      
      if (createError) {
        console.error('Error creating uploads table:', createError);
        console.log('Please create it manually in the Supabase SQL Editor with the following SQL:');
        console.log(`
          CREATE TABLE uploads (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            public_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          CREATE INDEX idx_uploads_user_id ON uploads(user_id);
        `);
      } else {
        console.log('Uploads table created successfully.');
      }
    } else if (checkError) {
      console.error('Error checking uploads table:', checkError);
      console.log('Please check your database connection and permissions.');
    } else {
      console.log('Uploads table already exists.');
    }
  } catch (error) {
    console.error('Error with uploads table operation:', error);
  }

  console.log('Supabase setup complete!');
}

setupSupabase().catch(console.error);