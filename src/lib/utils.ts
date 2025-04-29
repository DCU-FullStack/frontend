import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMenuStyle(darkStyle: string, lightStyle: string) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  return isDarkMode ? darkStyle : lightStyle;
}
