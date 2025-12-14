import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { publicInvoiceService } from '../services/api';
import toast from 'react-hot-toast';

interface Invoice {
  id: number;
  invoiceNumber: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: string;
  description: string;
  client: {
    name: string;
    email: string;
    companyName?: string;
  } | null;
}

const PublicInvoicePayment = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [searchParams] = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Your invoice has been paid.');
      fetchInvoice(); // Refresh to show updated status
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled. You can try again when ready.');
    }
  }, [searchParams, invoiceId]);

  const fetchInvoice = async () => {
    try {
      const data = await publicInvoiceService.getInvoice(parseInt(invoiceId!));
      setInvoice(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error loading invoice');
      toast.error(err.response?.data?.error || 'Error loading invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!invoice || !invoiceId) return;
    setProcessing(true);
    setError('');

    try {
      const { url } = await publicInvoiceService.createCheckoutSession(invoice.id);
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error creating payment session';
      setError(errorMsg);
      toast.error(errorMsg);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Loading invoice...</div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 max-w-md w-full">
          <div className="text-red-600 mb-4">{error}</div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Invoice Payment</h1>
            <p className="text-indigo-100">Invoice #{invoice.invoiceNumber}</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Invoice Details */}
            <div className="space-y-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Bill To</h2>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium text-slate-900">{invoice.client?.name}</p>
                  {invoice.client?.companyName && (
                    <p className="text-slate-600">{invoice.client.companyName}</p>
                  )}
                  <p className="text-slate-600">{invoice.client?.email}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h2>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Issue Date:</span>
                    <span className="text-slate-900">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Due Date:</span>
                    <span className="text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600">Description:</span>
                    <p className="text-slate-900 mt-1">{invoice.description}</p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg p-6 border border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-slate-700">Total Amount</span>
                  <span className="text-3xl font-bold text-indigo-600">
                    {invoice.currency} {parseFloat(invoice.amount.toString()).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            {invoice.status === 'Pending' && (
              <button
                onClick={handlePayNow}
                disabled={processing}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
            )}

            {invoice.status === 'Paid' && (
              <div className="w-full bg-success-100 text-success-800 py-4 px-6 rounded-lg font-semibold text-center">
                ✓ This invoice has been paid
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInvoicePayment;
