import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useCart } from '../../../contexts/CardContext/CardContext';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { cartItems, clearCart } = useCart();

  const [error, setError] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  const card = elements.getElement(CardElement);
  if (!card) return;

  const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card,
  });

  if (paymentError) {
    setError(paymentError.message);
  } else {
    setError('');

    const transactionId = `txn_${Date.now()}`;

    const order = {
      userEmail: user?.email,
      items: cartItems,
      totalAmount: parseFloat(total),
      transactionId,
      status: 'pending',
      createdAt: new Date(),
    };

    try {
      // Save order
      await axiosSecure.post('/orders', order);

      // Save payment with all details including items and totalAmount
      const { data } = await axiosSecure.post('/payments', {
        userEmail: user?.email,
        items: cartItems,
        totalAmount: parseFloat(total),
        amount: parseFloat(total),
        transactionId,
        status: 'paid',
        createdAt: new Date(),
      });

      const invoiceNumber = data.invoiceNumber;

      clearCart();

      Swal.fire({
        title: 'Payment Successful!',
        text: `Invoice #${invoiceNumber}`,
        icon: 'success',
        confirmButtonText: 'View Invoice',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `/dashboard/invoice/${invoiceNumber}`;
        }
      });
    } catch (err) {
      console.error('Order/payment creation failed:', err);
      Swal.fire('Error', 'Something went wrong while placing the order.', 'error');
    }
    console.log('payment method',paymentMethod)
  }
};


  return (
    <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'>
      <CardElement className='p-2 border rounded' />
      <button type='submit' className='btn bg-[#82b440] text-white w-full' disabled={!stripe}>
        Pay for Medicine (${total})
      </button>
      {error && <p className='text-red-600'>{error}</p>}
    </form>
  );
};

export default PaymentForm;
