import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

    const revalidatedPaths: string[] = [];

    // Revalidate pages based on content type
    if (model === 'portfolio-items') {
      // Revalidate the homepage
      revalidatePath('/', 'layout');
      revalidatedPaths.push('/');
      
      // Revalidate portfolio list page
      revalidatePath('/projects', 'layout');
      revalidatedPaths.push('/projects');
      
      // Revalidate individual project page if slug exists
      const slug = payload?.doc?.slug;
      if (slug) {
        revalidatePath(`/projects/${slug}`);
        revalidatedPaths.push(`/projects/${slug}`);
      }
    } else if (model === 'portfolio-categories') {
      // Revalidate portfolio and homepage if categories change
      revalidatePath('/projects', 'layout');
      revalidatedPaths.push('/projects');
      revalidatePath('/', 'layout');
      revalidatedPaths.push('/');
    } else if (model === 'teammates') {
      // Revalidate about-us page
      revalidatePath('/about-us', 'layout');
      revalidatedPaths.push('/about-us');
    }

    const duration = Date.now() - startTime;
    
    console.log(`✅ Revalidation complete (${duration}ms)`, {
      paths: revalidatedPaths,
      duration,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true,
      revalidated: revalidatedPaths,
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