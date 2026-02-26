export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email é obrigatório';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Formato de email inválido';
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} é obrigatório`;
  return null;
}

export function validateMinLength(value: string, min: number, label: string): string | null {
  if (value.trim().length < min) return `${label} deve ter pelo menos ${min} caracteres`;
  return null;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Muito fraca' | 'Fraca' | 'Razoável' | 'Forte' | 'Muito forte';
  color: string;
  suggestions: string[];
}

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) {
    score++;
  } else {
    suggestions.push('Use ao menos 8 caracteres');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    suggestions.push('Inclua letras maiúsculas');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    suggestions.push('Inclua letras minúsculas');
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    suggestions.push('Inclua números');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    suggestions.push('Inclua caracteres especiais (!@#$%)');
  }

  const labels: PasswordStrength['label'][] = [
    'Muito fraca',
    'Fraca',
    'Razoável',
    'Forte',
    'Muito forte',
  ];
  const colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'];

  const idx = Math.min(score, 4);

  return {
    score,
    label: labels[idx],
    color: colors[idx],
    suggestions,
  };
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Senha é obrigatória';
  if (password.length <= 4) return 'Senha deve ter mais de 4 caracteres';
  return null;
}

export function sanitizeText(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizeName(value: string): string {
  return value.replace(/[<>"'/\\]/g, '').replace(/\s{2,}/g, ' ').trim();
}
