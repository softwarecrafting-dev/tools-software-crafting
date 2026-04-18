import crypto from "crypto";

/**
 * Generates a secure random hex token.
 * @param bytes Number of bytes to generate (default 32)
 */
export function generateToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}
