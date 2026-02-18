export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumSignificantDigits: 3,
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(value);
};

export const formatPercent = (value) => {
  return `${value.toFixed(2)}%`;
};

export const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCompactNumber = (value) => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};
