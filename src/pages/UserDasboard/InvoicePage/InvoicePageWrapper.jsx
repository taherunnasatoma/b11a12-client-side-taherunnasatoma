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

  const { data: paymentData, isLoading, isError } = useQuery({
    queryKey: ['invoice', invoiceNumber],
    queryFn: () => fetchInvoice(axiosSecure, invoiceNumber),
    enabled: !!invoiceNumber, // don't run until invoiceNumber is available
  });

  if (isLoading) return <p>Loading invoice...</p>;
  if (isError || !paymentData) return <p>Invoice not found or failed to load.</p>;

  return <InvoicePage paymentData={paymentData} />;
};

export default InvoicePageWrapper;
