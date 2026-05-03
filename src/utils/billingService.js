const Invoice = require('../models/Invoice');
const crypto = require('crypto');

/**
 * EduSync Core Billing Service (Internal)
 * Generates and manages institutional invoices
 */

const generateInternalInvoice = async (order, user) => {
  console.log(`🏗️ Generating Internal EduSync Invoice for Order: ${order._id}`);

  const invoiceNumber = `ES-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // Create the record in our own database
  const invoice = await Invoice.create({
    invoiceNumber,
    order: order._id,
    user: user._id,
    amount: {
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      currency: order.currency
    },
    billingDetails: {
      name: order.billing?.name || user.name,
      address: `${order.billing?.address}, ${order.billing?.city}, ${order.billing?.zip}`,
      email: order.billing?.email || user.email,
      phone: order.billing?.phone || user.phone || 'N/A',
      gstin: order.billing?.gstin || ''
    },
    status: 'paid'
  });

  return {
    success: true,
    invoiceId: invoice.invoiceNumber,
    dbId: invoice._id,
    message: "Invoice generated and archived in EduSync Core."
  };
};

module.exports = { generateInternalInvoice };
