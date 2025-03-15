'use client'

import { useState, useEffect } from 'react';
import { Product, Order, Customer } from '../../../src';
import { getDashboardData } from '../actions/admin-actions';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface DashboardData {
  recentProducts: Product[];
  recentOrders: Order[];
  stats: DashboardStats;
}

/**
 * Dashboard component to display Vendure admin data
 */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your API connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="dashboard">
      <h1>Vendure Admin Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h2>Products</h2>
          <p className="stat-value">{data.stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h2>Orders</h2>
          <p className="stat-value">{data.stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h2>Customers</h2>
          <p className="stat-value">{data.stats.totalCustomers}</p>
        </div>
        <div className="stat-card">
          <h2>Revenue</h2>
          <p className="stat-value">£{data.stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h2>Avg. Order Value</h2>
          <p className="stat-value">£{data.stats.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="recent-data">
        <div className="recent-section">
          <h2>Recent Products</h2>
          <ul>
            {data.recentProducts.map(product => (
              <li key={product.id}>
                {product.name} {product.enabled ? '(Active)' : '(Inactive)'}
              </li>
            ))}
          </ul>
        </div>

        <div className="recent-section">
          <h2>Recent Orders</h2>
          <ul>
            {data.recentOrders.map(order => (
              <li key={order.id}>
                {order.code} - {order.state} - £{order.total}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
