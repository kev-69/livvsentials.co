import React, { forwardRef } from 'react';
import './PrintableInvoice.css';

interface PrintableInvoiceProps {
  order: any;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
  };
}

const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ order, companyInfo }, ref) => {
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
      }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Ensure order items is an array
    const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];

    return (
      <div ref={ref} className="print-container">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="company-details">
            <h1>{companyInfo.name}</h1>
            <p>{companyInfo.address}</p>
            <p>Phone: {companyInfo.phone}</p>
            <p>Email: {companyInfo.email}</p>
            <p>Website: {companyInfo.website}</p>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="invoice-title">
          <h2>INVOICE</h2>
          <div className="invoice-info">
            <div>
              <p><strong>Invoice No:</strong> INV-{order.orderNumber}</p>
              <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
              <p><strong>Due Date:</strong> {formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Order ID:</strong> {order.orderNumber}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-section">
          <div className="section-title">Bill To:</div>
          <div className="customer-details">
            <p><strong>{order.user?.firstName} {order.user?.lastName}</strong></p>
            <p>{order.user?.email}</p>
            <p>{order.user?.phone || 'No phone provided'}</p>
            {order.shippingAddress && <p>{order.shippingAddress}</p>}
          </div>
        </div>

        {/* Order Items */}
        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? (
              orderItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.product?.name || 'Product'}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price || 0)}</td>
                  <td>{formatCurrency((item.quantity || 0) * (item.price || 0))}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>No items in this order</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal || order.totalAmount || 0)}</span>
          </div>
          {order.shippingFee !== undefined && (
            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="summary-row">
              <span>Discount:</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatCurrency(order.totalAmount || 0)}</span>
          </div>
        </div>

        {/* Payment Information */}
        {order.payments && order.payments.length > 0 && (
          <div className="payment-info">
            <div className="section-title">Payment Information:</div>
            <p><strong>Method:</strong> {order.payments[0].paymentMethod || 'N/A'}</p>
            <p><strong>Status:</strong> {order.payments[0].paymentStatus}</p>
            <p><strong>Amount Paid:</strong> {formatCurrency(order.payments[0].amount)}</p>
          </div>
        )}

        {/* Footer */}
        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <p>This invoice was generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    );
  }
);

export default PrintableInvoice;