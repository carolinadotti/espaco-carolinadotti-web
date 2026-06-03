import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const pool = new Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const SERVICES = [
  {
    order: 1,
    title: "Mechas",
    subtitle: "Luz e Dimensão",
    description:
      "Técnicas exclusivas de mechas que trazem luz natural e dimensão aos fios, criando movimento e luminosidade personalizados para cada tipo de cabelo.",
    imageUrl: "/images/service-mechas.jpg",
  },
  {
    order: 2,
    title: "Penteados",
    subtitle: "Gestos de Elegância",
    description:
      "Penteados artesanais que equilibram sofisticação e personalidade. Da noiva ao evento casual, cada criação é única e pensada para realçar sua beleza.",
    imageUrl: "/images/service-penteados.jpg",
  },
  {
    order: 3,
    title: "Maquiagem",
    subtitle: "Pele como Tela",
    description:
      "Maquiagem artística e profissional que valoriza seus traços naturais. Técnicas modernas para realçar sua beleza com leveza e elegância.",
    imageUrl: "/images/service-maquiagem.jpg",
  },
  {
    order: 4,
    title: "Coloração",
    subtitle: "A Cor Certa",
    description:
      "Coloração precisa e harmoniosa que respeita a saúde dos fios. Do tom natural ao ousado, encontramos juntas a cor que revela sua essência.",
    imageUrl: "/images/service-coloracao.jpg",
  },
  {
    order: 5,
    title: "Corte",
    subtitle: "Forma e Movimento",
    description:
      "Cortes que combinam técnica e sensibilidade, criando formas que valorizam seu rosto e se adaptam ao seu estilo de vida com leveza.",
    imageUrl: "/images/service-corte.jpg",
  },
  {
    order: 6,
    title: "Tratamentos",
    subtitle: "Saúde e Vitalidade",
    description:
      "Hidratação, nutrição e reconstrução capilar com produtos selecionados. Devolvemos a saúde e o brilho que seus fios merecem.",
    imageUrl: "/images/service-tratamentos.jpg",
  },
  {
    order: 7,
    title: "Escova",
    subtitle: "Fluidez Natural",
    description:
      "Escova modeladora que traz fluidez, brilho e movimento natural aos fios. O acabamento perfeito para qualquer ocasião.",
    imageUrl: "/images/service-escova.jpg",
  },
]

async function main() {
  console.log("🌱 Iniciando seed...")

  // ── Usuários ──────────────────────────────────────────────────────
  const password = await bcrypt.hash("CarolinaDotti@2026!", 12)

  await prisma.user.upsert({
    where: { email: "fagnernlopes@gmail.com" },
    update: {},
    create: { email: "fagnernlopes@gmail.com", password },
  })

  await prisma.user.upsert({
    where: { email: "carolinadotti@outlook.com" },
    update: {},
    create: { email: "carolinadotti@outlook.com", password },
  })

  console.log("✅ Usuários criados")

  // ── Settings ──────────────────────────────────────────────────────
  const settings = [
    { key: "instagram", value: "carolsdotti" },
    { key: "whatsapp", value: "+55 53 8103-9103" },
    {
      key: "address",
      value: "Avenida Marechal Floriano, 214, Barrinha, São Lourenço do Sul, RS",
    },
    {
      key: "maps_url",
      value:
        "https://www.google.com/maps/search/?api=1&query=Avenida+Marechal+Floriano+214+Barrinha+S%C3%A3o+Louren%C3%A7o+do+Sul+RS",
    },
    { key: "hero_image", value: "" },
    { key: "about_image", value: "" },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }

  console.log("✅ Settings criados")

  // ── Serviços ──────────────────────────────────────────────────────
  for (const service of SERVICES) {
    const existing = await prisma.service.findFirst({
      where: { title: service.title },
    })

    if (!existing) {
      await prisma.service.create({ data: service })
    }
  }

  console.log("✅ Serviços criados")
  console.log("🌱 Seed concluído!")
  console.log("")
  console.log("   fagnernlopes@gmail.com  |  CarolinaDotti@2026!")
  console.log("   carolinadotti@outlook.com  |  CarolinaDotti@2026!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
