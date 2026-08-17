import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roomName = body.roomName || 'vidhyora-cohort-1';
    const participantName = body.participantName || 'Admin Host';

    // Fetch keys from .env.local
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing LiveKit API Keys in .env.local" }, 
        { status: 500 }
      );
    }

    // Create a new token valid for 4 hours
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: '4h',
    });

    // Grant permissions to join the specific room and broadcast video
    at.addGrant({ 
      roomJoin: true, 
      room: roomName, 
      canPublish: true, 
      canSubscribe: true 
    });

    const token = await at.toJwt();
    return NextResponse.json({ token });

  } catch (error) {
    console.error("Token Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
