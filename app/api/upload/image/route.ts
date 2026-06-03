import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import sharp from "sharp"
import { put } from "@vercel/blob"
import path from "path"
import fs from "fs/promises"

const STATIC_SPECS = {
  hero:  { width: 1920, height: 1080, settingKey: "hero_image" },
  about: { width: 800,  height: 1067, settingKey: "about_image" },
} as const

type StaticType = keyof typeof STATIC_SPECS

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file   = formData.get("file")  as File   | null
    const type   = formData.get("type")  as string | null

    if (!file || !type) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // ── Imagem de serviço: type = "service-{id}" ──────────────────
    if (type.startsWith("service-")) {
      const serviceId = type.replace("service-", "")

      const processed = await sharp(buffer)
        .resize(800, 1000, { fit: "cover", position: "centre" }) // 4:5
        .webp({ quality: 85 })
        .toBuffer()

      const imageUrl = await saveFile(processed, `service-${serviceId}-${Date.now()}.webp`)

      await prisma.service.update({
        where: { id: serviceId },
        data: { imageUrl },
      })

      return NextResponse.json({ ok: true, url: imageUrl })
    }

    // ── Hero / About ──────────────────────────────────────────────
    if (!(type in STATIC_SPECS)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
    }

    const spec = STATIC_SPECS[type as StaticType]

    const processed = await sharp(buffer)
      .resize(spec.width, spec.height, { fit: "cover", position: "centre" })
      .webp({ quality: 85 })
      .toBuffer()

    const imageUrl = await saveFile(processed, `${type}-${Date.now()}.webp`)

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

async function saveFile(buffer: Buffer, filename: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: "image/webp",
    })
    return blob.url
  }

  // Fallback local apenas em desenvolvimento
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN não configurado. Configure a variável de ambiente no painel da Vercel."
    )
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadsDir, { recursive: true })
  await fs.writeFile(path.join(uploadsDir, filename), buffer)
  return `/uploads/${filename}`
}
