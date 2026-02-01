// lib/vendors.ts

export async function getVendorIdForUser(
  userId: string
): Promise<string | null> {
  // TEMP stub — replace with DB lookup later
  // return `vendor_${userId}`;
  return "demo-vendor";
}
