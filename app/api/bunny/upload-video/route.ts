import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const libId = process.env.BUNNY_LIBRARY_ID;
    const key = process.env.BUNNY_API_KEY;

    if (!libId || !key) {
      return NextResponse.json({ error: 'Bunny.net credentials missing' }, { status: 400 });
    }

    // 1. Initialize the video container on Bunny.net
    const bunnyResponse = await fetch(`https://video.bunnycdn.com/library/${libId}/videos`, {
      method: 'POST',
      headers: {
        'AccessKey': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    const videoData = await bunnyResponse.json();

    if (!bunnyResponse.ok) {
      return NextResponse.json({ error: 'Failed to create video on Bunny.net', details: videoData }, { status: 500 });
    }

    // 2. Return the GUID and the Upload Key so the client can stream the file directly
    return NextResponse.json({ 
      success: true, 
      videoId: videoData.guid,
      libraryId: libId,
      uploadKey: key 
    });

  } catch (error) {
    console.error("Bunny API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}