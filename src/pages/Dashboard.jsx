// DASHBOARD — Home screen with deal statistics overview
// Shows summary stats, pipeline breakdown, and a bar chart from all deals in localStorage

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageWrapper from '../components/Layout/PageWrapper';
import TopBar from '../components/Layout/TopBar';
import EmptyState from '../components/shared/EmptyState';
import { loadAllDeals } from '../utils/storage';
import { formatMoney } from '../utils/calculations';
import { PIPELINE_STAGES, getStageByKey } from '../constants/pipelineStages';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pipelineData, setPipelineData] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);

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

    // Calculate total offer value across all active deals
    const totalOfferValue = activeDeals.reduce((sum, deal) => {
      return sum + (deal.offer?.locked_offer || 0);
    }, 0);

    setStats({
      totalDeals: deals.length,
      activeDeals: activeDeals.length,
      lettersSent: lettersSent.length,
      soldDeals: soldDeals.length,
      totalProfit,
      avgRoi,
      totalOfferValue,
    });

    // --- Build pipeline chart data ---
    const chartData = PIPELINE_STAGES.map((stage) => ({
      name: stage.label,
      count: deals.filter((d) => d.pipeline_stage === stage.key).length,
      color: stage.color,
    }));
    setPipelineData(chartData);

    // --- Get 5 most recently updated deals ---
    const sorted = [...deals].sort((a, b) =>
      new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    );
    setRecentDeals(sorted.slice(0, 5));

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
          <>
            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-500">Active Deals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeDeals || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-500">Letters Sent</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.lettersSent || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-500">Deals Sold</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats?.soldDeals || 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-500">Total Profit</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatMoney(stats?.totalProfit || 0)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-500">Average ROI</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats?.avgRoi ? `${(stats.avgRoi * 100).toFixed(0)}%` : '—'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-500">Total Offer Value</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {formatMoney(stats?.totalOfferValue || 0)}
                </p>
              </div>
            </div>

            {/* --- Pipeline Chart --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Deal Pipeline</h2>
              {pipelineData.some((d) => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={pipelineData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip
                      formatter={(value) => [`${value} deal(s)`, 'Count']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {pipelineData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">
                  Pipeline chart will appear once you have deals in different stages.
                </p>
              )}
            </div>

            {/* --- Recent Deals --- */}
            {recentDeals.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Recent Deals</h2>
                  <button
                    onClick={() => navigate('/deal-tracker')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {recentDeals.map((deal) => {
                    const stage = getStageByKey(deal.pipeline_stage);
                    return (
                      <div
                        key={deal.id}
                        onClick={() => navigate('/deal-tracker')}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: stage.color }}
                          ></span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {deal.owner?.name || 'Unknown Owner'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {deal.property?.address || 'No address'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: stage.color }}
                          >
                            {stage.label}
                          </span>
                          {deal.offer?.locked_offer > 0 && (
                            <p className="text-xs font-bold text-blue-600 mt-1">
                              {formatMoney(deal.offer.locked_offer)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}
