import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 11) return value;

  const ddd = digits.slice(0, 2);
  const first = digits.slice(2, 3);
  const middle = digits.slice(3, 7);
  const last = digits.slice(7, 11);

  return `(${ddd}) ${first} ${middle}-${last}`;
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, ""); 
}
