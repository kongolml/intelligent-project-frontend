import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '../../lib/api';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Validate webhook secret for security
    const secret = request.headers.get('x-webhook-secret');
    if (secret !== process.env.PAYLOAD_WEBHOOK_SECRET) {
      console.warn('⚠️ Unauthorized webhook attempt:', {
        hasSecret: !!secret,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    // PayloadCMS sends collection as a top-level string, event as "afterChange" etc.
    const model = payload?.collection;
    const eventType = payload?.event;

    console.log(`📡 Webhook received: ${eventType} ${model}`, {
      slug: payload?.doc?.slug,
      timestamp: new Date().toISOString()
    });

    const revalidatedTags: string[] = [];

    if (model === 'portfolio-items') {
      revalidateTag(CACHE_TAGS.portfolioItems);
      revalidatedTags.push(CACHE_TAGS.portfolioItems);
    } else if (model === 'portfolio-categories') {
      revalidateTag(CACHE_TAGS.portfolioCategories);
      revalidatedTags.push(CACHE_TAGS.portfolioCategories);
    } else if (model === 'teammates') {
      revalidateTag(CACHE_TAGS.teammates);
      revalidatedTags.push(CACHE_TAGS.teammates);
    }

    const duration = Date.now() - startTime;

    console.log(`✅ Revalidation complete (${duration}ms)`, {
      tags: revalidatedTags,
      duration,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      revalidated: revalidatedTags,
      duration,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Webhook processing failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to revalidate pages',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}