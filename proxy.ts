import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone();

    url.pathname = '/';

    if (pathname === '/home-user') {
        url.searchParams.set('view', 'home-user');
        return NextResponse.rewrite(url);
    }

    if (pathname === '/home-admin') {
        url.searchParams.set('view', 'home-admin');
        return NextResponse.rewrite(url);
    }

    if (pathname === '/register') {
        url.searchParams.set('view', 'register');
        return NextResponse.rewrite(url);
    }
}