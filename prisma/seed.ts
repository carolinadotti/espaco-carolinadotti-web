import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

// Torna 'verify-full' explícito: o pg/pg-connection-string v3 deixará de tratar
// 'require'/'prefer'/'verify-ca' como aliases de 'verify-full'. Mantém a mesma
// segurança/comportamento atual e silencia o aviso de depreciação.
function normalizeSslMode(connectionString: string): string {
  return connectionString.replace(
    /sslmode=(require|prefer|verify-ca)\b/gi,
    "sslmode=verify-full"
  )
}

const pool = new Pool({
  connectionString: normalizeSslMode(
    process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ""
  ),
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const SERVICES = [
  {
    order: 1,
    title: "Mechas",
    subtitle: "Luz e dimensão",
    description:
      "Mechas que dialogam com o tom natural dos fios, criando profundidade e movimento. Cada aplicação é pensada como uma composição de luz, respeitando a personalidade e o estilo de vida de quem as carrega.",
    imageUrl: "",
  },
  {
    order: 2,
    title: "Penteados",
    subtitle: "Gestos de elegância",
    description:
      "Penteados que capturam a essência de um momento — seja uma celebração, um encontro especial ou simplesmente a vontade de se sentir extraordinária. Cada fio é posicionado com intenção e delicadeza.",
    imageUrl: "",
  },
  {
    order: 3,
    title: "Maquiagem",
    subtitle: "Pele como tela",
    description:
      "Uma maquiagem que realça sem mascarar, que ilumina sem ofuscar. Trabalhamos com texturas leves e tons que conversam com sua pele natural, criando uma beleza que parece ter sempre estado ali.",
    imageUrl: "",
  },
  {
    order: 4,
    title: "Coloração",
    subtitle: "A cor certa",
    description:
      "Coloração personalizada que respeita a integridade dos fios enquanto revela nuances inesperadas. Cada tom é escolhido em diálogo com a pele, os olhos e a luz natural do ambiente onde você vive.",
    imageUrl: "",
  },
  {
    order: 5,
    title: "Corte",
    subtitle: "Forma e movimento",
    description:
      "Um corte que entende a geometria natural dos seus fios e a arquitetura do seu rosto. Menos sobre tendências passageiras, mais sobre encontrar a forma que faz você se reconhecer ao espelho.",
    imageUrl: "",
  },
  {
    order: 6,
    title: "Tratamentos",
    subtitle: "Hidratação, nutrição e reconstrução",
    description:
      "Protocolos cuidadosamente selecionados para devolver aos fios sua vitalidade natural. Hidratação profunda, nutrição com óleos nobres e reconstrução da fibra capilar — cada etapa é um ritual de cuidado.",
    imageUrl: "",
  },
  {
    order: 7,
    title: "Escova",
    subtitle: "Fluidez natural",
    description:
      "Uma escova que valoriza o movimento dos fios com naturalidade e leveza. O resultado é um cabelo que parece cuidado sem esforço, com brilho e caimento perfeitos.",
    imageUrl: "",
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
    { key: "hero_image_mobile", value: "" },
    { key: "hero_title", value: "Carolina\nDotti" },
    {
      key: "hero_subtitle",
      value: "A beleza que já existe em você, revelada com elegância",
    },
    { key: "about_image", value: "" },
    { key: "about_title", value: "Um olhar que\nrevela beleza" },
    {
      key: "about_text",
      value:
        "Cada pessoa carrega consigo uma beleza singular, muitas vezes adormecida sob a rotina do cotidiano. Meu trabalho é criar um espaço onde essa beleza possa respirar e se revelar naturalmente.\n\nCom anos de dedicação e uma busca constante pela excelência, desenvolvi uma abordagem que valoriza a individualidade de cada cliente. Não transformo — revelo. Não imponho — escuto. O resultado é uma versão sua que você reconhece como a mais autêntica.",
    },
    { key: "gallery_title", value: "" },
    { key: "gallery_description", value: "" },
    { key: "clients_title", value: "Resultados que\nfalam por si" },
    {
      key: "clients_description",
      value:
        "Cada cliente, uma transformação única. Veja de perto alguns dos nossos trabalhos.",
    },
    { key: "contact_title", value: "Agende seu\nhorário" },
    {
      key: "contact_description",
      value:
        "Cada atendimento é uma experiência única e exclusiva. Entre em contato para encontrarmos o melhor horário para você.",
    },
    { key: "contact_cta_label", value: "Agendar via WhatsApp" },
    { key: "site_title", value: "Carolina Dotti — Beleza e Elegância" },
    {
      key: "site_description",
      value:
        "Espaço de beleza especializado em mechas, coloração, penteados, maquiagem, corte e tratamentos capilares. Atendimento personalizado em São Lourenço do Sul, RS.",
    },
    {
      key: "site_keywords",
      value:
        "salão de beleza, mechas, coloração, penteados, maquiagem, corte de cabelo, tratamentos capilares, São Lourenço do Sul, RS",
    },
    { key: "og_image", value: "" },
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

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          subtitle: service.subtitle,
          description: service.description,
          order: service.order,
        },
      })
    } else {
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
