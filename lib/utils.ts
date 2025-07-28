export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRiskColor = (risk: string): string => {
  switch (risk?.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'text-red-400 bg-red-500/20';
    case 'medium':
      return 'text-yellow-400 bg-yellow-500/20';
    case 'low':
      return 'text-green-400 bg-green-500/20';
    default:
      return 'text-gray-400 bg-gray-500/20';
  }
};

export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};
