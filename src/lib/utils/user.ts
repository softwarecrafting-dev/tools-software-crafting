export function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  if (email && email.length > 0) {
    return email[0].toUpperCase();
  }

  return "?";
}
