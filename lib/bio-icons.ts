import {
  AtSign,
  Calendar,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export const BIO_ICONS = {
  Globe: { icon: Globe, label: "Site / Web" },
  AtSign: { icon: AtSign, label: "Instagram" },
  MessageCircle: { icon: MessageCircle, label: "WhatsApp / Mensagem" },
  Phone: { icon: Phone, label: "Telefone" },
  MapPin: { icon: MapPin, label: "Localização" },
  Mail: { icon: Mail, label: "E-mail" },
  Calendar: { icon: Calendar, label: "Agendamento" },
  ExternalLink: { icon: ExternalLink, label: "Link externo" },
  Scissors: { icon: Scissors, label: "Salão / Corte" },
  Sparkles: { icon: Sparkles, label: "Beleza / Serviços" },
} as const

export type BioIconName = keyof typeof BIO_ICONS

export function getBioIcon(name: string): LucideIcon | null {
  if (!name || !(name in BIO_ICONS)) return null
  return BIO_ICONS[name as BioIconName].icon
}

export function isValidBioIcon(name: string): name is BioIconName {
  return name in BIO_ICONS
}
