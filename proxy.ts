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

    if (pathname === '/order') {
        url.searchParams.set('view', 'order');
        return NextResponse.rewrite(url);
    }

    if (pathname === '/history') {
        url.searchParams.set('view', 'history');
        return NextResponse.rewrite(url);
    }

    if (pathname === '/admin-queue') {
        url.searchParams.set('view', 'admin-queue');
        return NextResponse.rewrite(url);
    }

    if (pathname === '/admin-menu') {
        url.searchParams.set('view', 'admin-menu');
        return NextResponse.rewrite(url);
    }

    if (pathname === '/admin-laporan') {
        url.searchParams.set('view', 'admin-laporan');
        return NextResponse.rewrite(url);
    }
}