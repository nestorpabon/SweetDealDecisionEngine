// DASHBOARD — Home screen with deal statistics overview
// Shows summary stats from all deals in localStorage

import { useState, useEffect } from 'react';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';
import { loadAllDeals } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

// Format a dollar amount with $ and commas, no cents
function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  // --- Load deal data and compute stats on mount ---
  useEffect(() => {
    console.log('📊 Dashboard: Loading deal stats...');
    const deals = loadAllDeals();

    // Count deals by status category
    const activeDeals = deals.filter((d) => d.status === 'active' && d.pipeline_stage !== 'dead');
    const soldDeals = deals.filter((d) => d.pipeline_stage === 'sold');
    const lettersSent = deals.filter((d) =>
      ['letter_sent', 'seller_responded', 'negotiating', 'under_contract', 'closed_bought', 'for_sale', 'sold'].includes(d.pipeline_stage)
    );

    // Calculate total profit from sold deals
    const totalProfit = soldDeals.reduce((sum, deal) => {
      const profit = deal.sell_details?.profit || 0;
      return sum + profit;
    }, 0);

    // Calculate average ROI across sold deals
    const avgRoi = soldDeals.length > 0
      ? soldDeals.reduce((sum, deal) => {
          const cost = deal.buy_details?.total_cost || 1;
          const profit = deal.sell_details?.profit || 0;
          return sum + (profit / cost);
        }, 0) / soldDeals.length
      : 0;

    setStats({
      totalDeals: deals.length,
      activeDeals: activeDeals.length,
      lettersSent: lettersSent.length,
      soldDeals: soldDeals.length,
      totalProfit,
      avgRoi,
    });

    console.log('✅ Dashboard stats loaded:', {
      total: deals.length,
      active: activeDeals.length,
      sold: soldDeals.length,
    });
  }, []);

  // --- Render ---
  return (
    <>
      <TopBar title="Dashboard" />
      <PageWrapper>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deal Overview</h1>
          <p className="text-gray-500 mt-1">Track your land flipping business at a glance.</p>
        </div>

        {/* Show empty state if no deals yet */}
        {stats && stats.totalDeals === 0 ? (
          <EmptyState
            icon="🏠"
            title="No Deals Yet"
            message="Start by finding a target market, uploading a property list, and creating your first deal."
            actionLabel="Find a Market"
            onAction={() => navigate('/market-finder')}
          />
        ) : (
          /* Stats Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Active Deals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">Active Deals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeDeals || 0}</p>
            </div>

            {/* Letters Sent */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">Letters Sent</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.lettersSent || 0}</p>
            </div>

            {/* Deals Sold */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">Deals Sold</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats?.soldDeals || 0}</p>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">Total Profit</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatMoney(stats?.totalProfit || 0)}
              </p>
            </div>

            {/* Average ROI */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">Average ROI</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.avgRoi ? `${(stats.avgRoi * 100).toFixed(0)}%` : '—'}
              </p>
            </div>

            {/* Total Deals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-500">Total Deals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalDeals || 0}</p>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
