import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date|undefined): string {
  const now = new Date();

  if(!date)return ""

  // Check if the date is today
  if (now.toDateString() === date.toDateString()) {
      return `Today, ${formatTime(date)}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
      return `Yesterday, ${formatTime(date)}`;
  }

  // For older dates
  return date.toLocaleDateString("en-US", { day: '2-digit', month: 'short' });
}

// Helper function to format time
function formatTime(date: Date): string {
  const hours = date.getHours() % 12 || 12; // Convert 24-hour to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Add leading zero
  const period = date.getHours() >= 12 ? "pm" : "am";
  return `${hours}:${minutes} ${period}`;
}
