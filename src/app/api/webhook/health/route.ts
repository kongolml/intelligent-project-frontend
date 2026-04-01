import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    config: {
      webhookSecretConfigured: !!process.env.PAYLOAD_WEBHOOK_SECRET,
      apiUrlConfigured: !!process.env.API_URL,
    },
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
  });
}
