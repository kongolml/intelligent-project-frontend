import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '../../lib/api';
import { rateLimit } from '../../lib/rate-limit';

export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const secret = request.headers.get('x-webhook-secret');
  if (secret !== process.env.PAYLOAD_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tags = Object.values(CACHE_TAGS);
  tags.forEach(tag => revalidateTag(tag, 'max'));

  console.log(`[revalidate] Manual revalidation triggered for tags: ${tags.join(', ')}`);

  return NextResponse.json({
    success: true,
    revalidated: tags,
    timestamp: new Date().toISOString(),
  });
}
