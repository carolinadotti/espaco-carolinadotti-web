import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed...")

  // Usuários administradores
  const password = await bcrypt.hash("CarolinaDotti@2026!", 12)

  await prisma.user.upsert({
    where: { email: "fagnernlopes@gmail.com" },
    update: {},
    create: {
      email: "fagnernlopes@gmail.com",
      password,
    },
  })

  await prisma.user.upsert({
    where: { email: "carolinadotti@outlook.com" },
    update: {},
    create: {
      email: "carolinadotti@outlook.com",
      password,
    },
  })

  console.log("✅ Usuários criados:")
  console.log("   fagnernlopes@gmail.com")
  console.log("   carolinadotti@outlook.com")
  console.log("   Senha inicial: CarolinaDotti@2026!")

  // Settings padrão
  const settings = [
    { key: "instagram", value: "carolsdotti" },
    { key: "whatsapp", value: "+5553810391 03" },
    {
      key: "address",
      value:
        "Avenida Marechal Floriano, 214, Barrinha, São Lourenço do Sul, RS",
    },
    {
      key: "maps_url",
      value:
        "https://www.google.com/maps/search/?api=1&query=Avenida+Marechal+Floriano+214+Barrinha+S%C3%A3o+Louren%C3%A7o+do+Sul+RS",
    },
    { key: "hero_image", value: "" },
    { key: "about_image", value: "" },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log("✅ Settings padrão criados")
  console.log("🌱 Seed concluído!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
