import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return crypto.randomUUID()
}

export function generateComplaintNumber() {
  return `RA-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, "0")}`
}

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex")
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(time: string) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
