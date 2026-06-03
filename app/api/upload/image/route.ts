import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import sharp from "sharp"
import { put } from "@vercel/blob"
import path from "path"
import fs from "fs/promises"

const SPECS = {
  hero: { width: 1920, height: 1080, settingKey: "hero_image" },
  about: { width: 800, height: 1067, settingKey: "about_image" }, // ~3:4
} as const

type ImageType = keyof typeof SPECS

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as ImageType | null

    if (!file || !type || !(type in SPECS)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const spec = SPECS[type]
    const buffer = Buffer.from(await file.arrayBuffer())

    // Process with sharp: resize + convert to WebP
    const processed = await sharp(buffer)
      .resize(spec.width, spec.height, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 85 })
      .toBuffer()

    let imageUrl: string

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Vercel Blob
      const filename = `${type}-${Date.now()}.webp`
      const blob = await put(filename, processed, {
        access: "public",
        contentType: "image/webp",
      })
      imageUrl = blob.url
    } else {
      // Development: local /public/uploads
      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      await fs.mkdir(uploadsDir, { recursive: true })
      const filename = `${type}-${Date.now()}.webp`
      const filePath = path.join(uploadsDir, filename)
      await fs.writeFile(filePath, processed)
      imageUrl = `/uploads/${filename}`
    }

    // Save URL to settings
    await prisma.setting.upsert({
      where: { key: spec.settingKey },
      update: { value: imageUrl },
      create: { key: spec.settingKey, value: imageUrl },
    })

    return NextResponse.json({ ok: true, url: imageUrl })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 })
  }
}
