import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices, useCreateInvoice, useDeleteInvoice } from '../hooks/useInvoices';
import { useClients } from '../hooks/useClients';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Invoices = () => {
  const { data: invoices, isLoading } = useInvoices();
  const { data: clients } = useClients();
  const createInvoice = useCreateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    currency: 'USD',
    issueDate: '',
    dueDate: '',
    description: '',
  });
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvoice.mutateAsync({
        ...formData,
        clientId: parseInt(formData.clientId),
        amount: parseFloat(formData.amount),
      });
      toast.success('Invoice created successfully!');
      setShowModal(false);
      setFormData({ clientId: '', amount: '', currency: 'USD', issueDate: '', dueDate: '', description: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error creating invoice');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await deleteInvoice.mutateAsync(id);
      toast.success('Invoice deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error deleting invoice');
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-600 mt-1">Manage and track all your invoices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
        >
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {invoices?.map((invoice: any) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/invoices/${invoice.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{invoice.client?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {invoice.currency} {parseFloat(invoice.amount.toString()).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">Create Invoice</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Client</label>
                      <select
                        required
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={createInvoice.isPending}
                      >
                        <option value="">Select a client</option>
                        {clients?.map((client: any) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Description</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        placeholder="Invoice description or reason"
                        disabled={createInvoice.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={createInvoice.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={createInvoice.isPending}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Issue Date</label>
                      <input
                        type="date"
                        required
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={createInvoice.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Due Date</label>
                      <input
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={createInvoice.isPending}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createInvoice.isPending}
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-base font-medium text-white hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {createInvoice.isPending ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={createInvoice.isPending}
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
