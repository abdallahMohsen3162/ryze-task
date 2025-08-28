// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;
  if(pathname == "/"){
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  
  console.log(pathname);
  console.log(pathname.startsWith("/dashboard"));
  if(!token && pathname.startsWith("/dashboard")){
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('access_token');
    
    
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  
 

  // Otherwise continue
  return NextResponse.next();
}

// Apply to ALL routes (no matcher means global)
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
