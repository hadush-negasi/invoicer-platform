import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useInvoice, useSendInvoiceEmail } from '../hooks/useInvoices';
import { stripeService } from '../services/api';
import toast from 'react-hot-toast';

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: invoice, isLoading, refetch } = useInvoice(id ? parseInt(id) : 0);
  const sendEmail = useSendInvoiceEmail();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment successful!');
      refetch();
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled');
    }
  }, [searchParams, refetch]);

  const handlePayNow = async () => {
    if (!invoice || !id) return;
    setProcessing(true);
    try {
      const { url } = await stripeService.createCheckoutSession(invoice.id);
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error creating payment session');
      setProcessing(false);
    }
  };

  const handleSendEmail = async () => {
    if (!invoice || !id) return;
    try {
      await sendEmail.mutateAsync(invoice.id);
      toast.success('Invoice email sent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error sending invoice email');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-slate-600">Invoice not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-success-100 text-success-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="px-4 py-6 sm:p-6">
      <button
        onClick={() => navigate('/invoices')}
        className="mb-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Invoices
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{invoice.invoiceNumber}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSendEmail}
                disabled={sendEmail.isPending}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {sendEmail.isPending ? 'Sending...' : 'Send Invoice Email'}
              </button>
              {invoice.status === 'Pending' && (
                <button
                  onClick={handlePayNow}
                  disabled={processing}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 disabled:opacity-50 transition-all shadow-lg"
                >
                  {processing ? 'Processing...' : 'Pay Now'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Bill To</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-900">{invoice.client?.name}</p>
                {invoice.client?.companyName && (
                  <p className="text-slate-600">{invoice.client.companyName}</p>
                )}
                <p className="text-slate-600 mt-1">{invoice.client?.email}</p>
                <p className="text-slate-600">{invoice.client?.phone}</p>
                <p className="text-slate-600 mt-2">{invoice.client?.address}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Invoice Details</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Issue Date:</span>
                  <span className="text-slate-900 font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Due Date:</span>
                  <span className="text-slate-900 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Currency:</span>
                  <span className="text-slate-900 font-medium">{invoice.currency}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Description</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-900">{invoice.description}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg p-6 border border-indigo-100">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-slate-700">Total Amount</span>
              <span className="text-3xl font-bold text-indigo-600">
                {invoice.currency} {parseFloat(invoice.amount.toString()).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
