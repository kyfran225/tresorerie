import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    });

    return NextResponse.json({
      status: "connected",
      userCount,
      users,
      env: {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        tursoUrlPrefix: process.env.TURSO_DATABASE_URL?.substring(0, 15)
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack,
      cause: error.cause
    }, { status: 500 });
  }
}