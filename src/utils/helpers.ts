export const findMissingLetter = (name: string): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const nameLetters = new Set(name.toLowerCase().replace(/\s/g, ''));
  
  for (const letter of alphabet) {
    if (!nameLetters.has(letter)) {
      return letter.toUpperCase();
    }
  }
  
  return '-';
};

export const hasAllLetters = (name: string): boolean => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const nameLetters = new Set(name.toLowerCase().replace(/\s/g, ''));
  
  return alphabet.split('').every(letter => nameLetters.has(letter));
};

export const getGreeting = (): string => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};