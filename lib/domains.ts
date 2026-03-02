export type DomainKey = 'work' | 'time' | 'value' | 'identity' | 'income' | 'learning' | 'social';

export const DOMAIN_COLORS: Record<DomainKey, string> = {
  work: '#8BC48A', time: '#5BBFB5', value: '#4AA8D8',
  identity: '#6B8FD4', income: '#C46BA8', learning: '#E8925A', social: '#A87ED4',
};

export const DOMAIN_LABELS: Record<DomainKey, string> = {
  work: 'WORK · ORGANIZATION', time: 'TIME · STRUCTURE', value: 'VALUE · REDISTRIBUTION',
  identity: 'IDENTITY · ROLE', income: 'INCOME · SURVIVAL', learning: 'LEARNING · TRANSITION',
  social: 'SOCIAL · COORDINATION',
};

// Icon names to use with lucide-react
export const DOMAIN_ICON_NAMES: Record<DomainKey, string> = {
  work: 'Layers', time: 'Clock', value: 'Zap',
  identity: 'Shield', income: 'DollarSign', learning: 'BookOpen', social: 'Network',
};
