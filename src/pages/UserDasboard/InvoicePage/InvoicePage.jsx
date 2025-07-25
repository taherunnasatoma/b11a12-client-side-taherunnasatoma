import React, {  useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import useAuth from '../../../hooks/useAuth';

const InvoicePage = ({ paymentData }) => {
  const { user } = useAuth();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${paymentData?.invoiceNumber || 'N/A'}`,
  });

  const {
    invoiceNumber,
    items = [],
    amount,
    transactionId,
    status,
    paidAt,
    createdAt,
  } = paymentData || {};

  // Calculate totalAmount manually
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const dateString = paidAt || createdAt || null;
  const formattedDate = dateString ? new Date(dateString).toLocaleString() : "Invalid Date";

  return (
    <div className='p-6'>
      <div className='flex justify-center mb-4'>
        <button
          onClick={handlePrint}
          className='bg-[#82b440] hover:bg-[#6fa234] text-white px-6 py-2 rounded shadow'
        >
          Download Invoice
        </button>
      </div>

      <div ref={componentRef} className='bg-white p-8 shadow-md max-w-3xl mx-auto border'>
        <div className='flex items-center justify-between mb-8'>
          <div className='text-right'>
            <h2 className='text-xl font-bold'>Invoice</h2>
            <p>Invoice No: {invoiceNumber || 'N/A'}</p>
            <p>Date: {formattedDate}</p>
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Customer Information</h3>
          <p>Name: {user?.displayName || 'N/A'}</p>
          <p>Email: {user?.email}</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Purchased Items</h3>
          <table className='w-full table-auto border'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-2 border'>#</th>
                <th className='p-2 border'>Item</th>
                <th className='p-2 border'>Company</th>
                <th className='p-2 border'>Quantity</th>
                <th className='p-2 border'>Price</th>
                <th className='p-2 border'>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">No items found</td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={idx}>
                    <td className='p-2 border'>{idx + 1}</td>
                    <td className='p-2 border'>{item.itemName || item.name || 'N/A'}</td>
                    <td className='p-2 border'>{item.company || 'N/A'}</td>
                    <td className='p-2 border'>{item.quantity || 1}</td>
                    <td className='p-2 border'>${item.price?.toFixed(2) || '0.00'}</td>
                    <td className='p-2 border'>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='text-right'>
          <p className='font-semibold'>Transaction ID: {transactionId || 'N/A'}</p>
          <p className='font-semibold'>Status: {status || 'N/A'}</p>
          <p className='text-xl font-bold mt-2'>Total: ${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};


export default InvoicePage;
