// InvoicePageWrapper.jsx
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import InvoicePage from './InvoicePage';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const fetchInvoice = async (axiosSecure, invoiceNumber) => {
  const res = await axiosSecure.get(`/payments/invoice/${invoiceNumber}`);
  return res.data;
};

const InvoicePageWrapper = () => {
 const { invoiceNumber } = useParams();
const axiosSecure = useAxiosSecure();

const isAxiosReady = !!axiosSecure;

const { data: paymentData, isLoading, isError } = useQuery({
  queryKey: ['invoice', invoiceNumber],
  queryFn: async () => {
    if (!axiosSecure || !invoiceNumber) return null;
    const res = await axiosSecure.get(`/payments/invoice/${invoiceNumber}`);
    return res.data;
    
  },
  
  enabled: !!invoiceNumber && isAxiosReady, // only run when both are ready
});
console.log('invoiceNumber:', invoiceNumber);
console.log('axiosSecure ready:', !!axiosSecure);
console.log('paymentData:', paymentData);



  if (isLoading) return <p>Loading invoice...</p>;
  if (isError || !paymentData) return <p>Invoice not found or failed to load.</p>;

  return <InvoicePage paymentData={paymentData} />;

  
};

export default InvoicePageWrapper;
