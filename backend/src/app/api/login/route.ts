export function detectDevice(userAgent: string) {

  let browser = "Unknown";
  let os = "Unknown";
  let device = "desktop";

  if (userAgent.includes("Chrome")) browser = "Chrome";
  if (userAgent.includes("Edg")) browser = "Microsoft Edge";

  if (userAgent.includes("Windows")) os = "Windows";
  if (userAgent.includes("Mac")) os = "MacOS";
  if (userAgent.includes("Android")) os = "Android";
  if (userAgent.includes("iPhone")) os = "iOS";

  if (userAgent.includes("Mobile")) device = "mobile";

  return { browser, os, device };
}