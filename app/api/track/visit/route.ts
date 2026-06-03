import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { UAParser } from "ua-parser-js"

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown"
    const userAgent = req.headers.get("user-agent") || "unknown"

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "unknown"
    const os = parser.getOS().name || "unknown"

    await prisma.visit.create({ data: { ip, userAgent, browser, os } })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
