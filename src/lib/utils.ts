import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRelativeDate = (from: Date) => {
  const currentDate = new Date();

  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  }

  if (currentDate.getFullYear() === from.getFullYear()) {
    return formatDate(from, "MMM d");
  }

  return formatDate(from, "MMM d, yyyy");
};

export const formatNumber = (n: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
};

export const fileTypeChecker = ({
  file,
  extensionNames,
}: {
  file: File;
  extensionNames: String[];
}) => {
  const fileExtensionName = file.name.split(".")[1];

  if (!fileExtensionName) return false;

  if (extensionNames.includes(fileExtensionName)) {
    return true;
  }

  return false;
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
