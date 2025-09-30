const DEFAULT_LOCALE = 'pt-BR';
const DEFAULT_CURRENCY = 'BRL';

export const formatCurrency = (
  value,
  locale = DEFAULT_LOCALE, 
  currency = DEFAULT_CURRENCY
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value || 0);
};