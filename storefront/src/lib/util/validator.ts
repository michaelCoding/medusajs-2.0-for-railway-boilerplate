export type ValidationError = {
  field: string
  message: string
}

export const validatePassword = (password: string): string[] => {
  const unmetRequirements: string[] = []

  if (password.length < 8) {
    unmetRequirements.push('At least 8 characters')
  }
  if (!/[a-z]/.test(password)) {
    unmetRequirements.push('One lowercase letter')
  }
  if (!/[A-Z]/.test(password)) {
    unmetRequirements.push('One uppercase letter')
  }
  if (
    !/[0-9]/.test(password) &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    unmetRequirements.push('One number or symbol')
  }

  return unmetRequirements
}
