import { Link } from 'react-router-dom';
import { useInvoiceStats } from '../hooks/useInvoices';

const Dashboard = () => {
  const { data: stats, isLoading } = useInvoiceStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-slate-600">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your invoicing activity</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-success-600">{stats.paidInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdueInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg p-8 text-white mb-8">
        <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
        <p className="text-4xl font-bold">${stats.totalAmount.toFixed(2)}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/invoices"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all"
        >
          View All Invoices
        </Link>
        <Link
          to="/clients"
          className="inline-flex items-center px-6 py-3 bg-white text-slate-700 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 shadow-md hover:shadow-lg transition-all"
        >
          Manage Clients
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
