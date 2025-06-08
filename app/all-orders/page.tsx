'use client';

import { useEffect, useState } from 'react';
import { fetchOrders, Order } from '../../lib/fetchOrders';
import Sidebar from '../../components/Sidebar';

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      const allOrders = await fetchOrders();
      setOrders(allOrders);
      setLoading(false);
    };

    getOrders();
  }, []);

  if (loading) return (
    <p style={{
      padding: '40px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      fontSize: '18px',
      color: '#6b7280',
      textAlign: 'center',
    }}>
      Loading...
    </p>
  );

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#f9fafb',
      color: '#374151',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: isCollapsed ? '80px' : '280px',  // example collapse width
        borderRight: '1px solid #e5e7eb',
        backgroundColor: '#fff',
        boxShadow: '2px 0 6px rgba(0,0,0,0.05)',
        overflowY: 'auto',
        transition: 'width 0.3s ease',
      }}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </aside>

      {/* Main content */}
      <main style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '40px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontWeight: '700',
          fontSize: '2rem',
          marginBottom: '24px',
          color: '#111827',
          textAlign: 'center',
        }}>
          All Orders
        </h1>

        {orders.length === 0 ? (
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            textAlign: 'center',
            padding: '40px 0',
          }}>
            No orders found.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 12px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '700px', // prevent collapsing on narrow screens
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: '8px',
                }}>
                  <th style={{ padding: '12px 16px' }}>Name</th>
                  <th style={{ padding: '12px 16px' }}>Mobile</th>
                  <th style={{ padding: '12px 16px' }}>Address</th>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Price</th>
                  <th style={{ padding: '12px 16px' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: '#fefefe',
                      borderBottom: '1px solid #e5e7eb',
                      fontSize: '15px',
                      color: '#4b5563',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fefefe')}
                  >
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{order.name}</td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{order.mobile}</td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{order.address}</td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{order.productName}</td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>{order.productPrice}</td>
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      {order.createdAt ? order.createdAt.toDate().toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
