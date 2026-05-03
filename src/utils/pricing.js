/**
 * Pricing Utility for Regional Context
 */

const getPriceForRegion = (product, region = 'IN') => {
  if (!product.pricing) return product.price || 0;
  
  const regionalData = product.pricing[region] || product.pricing['IN'];
  return {
    amount: regionalData.price,
    currency: regionalData.currency,
    symbol: regionalData.symbol
  };
};

module.exports = { getPriceForRegion };
