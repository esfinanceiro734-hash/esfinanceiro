const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidPassword(value: string): boolean {
  return value.length >= 6
}

export const PASSWORD_MIN_LENGTH = 6
