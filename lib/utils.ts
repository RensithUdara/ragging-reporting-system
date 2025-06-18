import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date) {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateComplaintNumber() {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `RA-${year}${month}-${randomDigits}`
}

export function generateVerificationToken() {
  return uuidv4()
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "amber"
    case "under review":
      return "purple"
    case "investigating":
      return "teal"
    case "resolved":
      return "green"
    case "closed":
      return "gray"
    default:
      return "gray"
  }
}
