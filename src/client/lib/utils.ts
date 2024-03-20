import axios from "axios";
import { isEmpty } from "lodash";

export const api = axios.create({
  baseURL: "/api",
});

export function round(number: number, decimalPlaces = 2) {
  return Math.floor(number * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function humanizeBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const digitGroups = Math.floor(Math.log(bytes) / Math.log(1024));
  const convertedSize = round(bytes / Math.pow(1024, digitGroups), 2);
  const unit = units[digitGroups];

  return `${convertedSize} ${unit}`;
}

export function log<T>(arg: T) {
  console.log(arg);
  return arg;
}

export function formatDateToYearMonthDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatMinutesToTime(minutes: number) {
  const days = Math.floor(minutes / 60 / 24);
  const hours = Math.floor((minutes / 60) % 24);
  const minutesLeft = Math.floor(minutes % 60);

  return `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${
    days > 0 ? "" : minutesLeft + "min"
  }`;
}

export function formatSize(size: number) {
  const gbs = size / 1024 / 1024 / 1024;
  const mbs = size / 1024 / 1024;

  if (gbs >= 1) {
    return `${gbs.toFixed(2)} GB`;
  } else {
    return `${mbs.toFixed(2)} MB`;
  }
}

export function notEmpty(value: any): boolean {
  return !isEmpty(value);
}
