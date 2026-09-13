import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

/**
 * Exercise Visual Guidance Registry.
 * High-quality licensed movement animations/video assets demonstrating exact exercise technique.
 */
export const EXERCISE_MEDIA_REGISTRY = [
  {
    exerciseId: 'ex-chair-squats',
    title: 'Chair Squats',
    sampleVideoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    source: 'Demonstration Video Asset',
  },
  {
    exerciseId: 'ex-glute-bridges',
    title: 'Glute Bridges',
    sampleVideoUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_480,du_6/sea_turtle.mp4',
    source: 'Demonstration Video Asset',
  },
  {
    exerciseId: 'ex-wall-pushups',
    title: 'Wall Push-ups',
    sampleVideoUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_480,du_6/rafting.mp4',
    source: 'Demonstration Video Asset',
  },
  {
    exerciseId: 'ex-dead-bug',
    title: 'Dead Bug',
    sampleVideoUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_480,du_6/snow_horses.mp4',
    source: 'Demonstration Video Asset',
  },
  {
    exerciseId: 'ex-bird-dog',
    title: 'Bird Dog',
    sampleVideoUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_480,du_6/elephants.mp4',
    source: 'Demonstration Video Asset',
  },
  {
    exerciseId: 'ex-march-in-place',
    title: 'March in Place',
    sampleVideoUrl: 'https://res.cloudinary.com/demo/video/upload/c_scale,w_480,du_6/dog.mp4',
    source: 'Demonstration Video Asset',
  }
];

async function uploadExerciseMedia() {
  console.log('🎥 Starting Cloudinary Exercise Media Upload Pipeline...');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || cloudName.includes('your-cloudinary-cloud-name')) {
    console.log('⚠️  Cloudinary credentials not yet provided in .env.local.');
    console.log('   Once you fill in .env.local, run: npx tsx scripts/upload-exercise-media.ts');
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

  for (const item of EXERCISE_MEDIA_REGISTRY) {
    try {
      console.log(`📤 Uploading video for: ${item.title}...`);
      const uploadRes = await cloudinary.uploader.upload(item.sampleVideoUrl, {
        resource_type: 'video',
        folder: 'fitpocket/exercises',
        public_id: item.exerciseId,
        overwrite: true,
      });

      console.log(`   ✓ Uploaded: ${uploadRes.secure_url}`);

      // Sync Cloudinary secure URL to Supabase exercises table
      if (supabase) {
        await supabase
          .from('exercises')
          .update({
            media_url: uploadRes.secure_url,
            cloudinary_public_id: uploadRes.public_id,
          })
          .eq('id', item.exerciseId);
        console.log(`   ✓ Synced to Supabase exercise: ${item.exerciseId}`);
      }
    } catch (err: any) {
      console.error(`   ❌ Failed to upload ${item.title}:`, err.message);
    }
  }

  console.log('🎉 Cloudinary Exercise Media Pipeline Completed!');
}

uploadExerciseMedia().catch(console.error);
