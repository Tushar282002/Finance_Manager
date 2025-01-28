import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types/database';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// Custom label renderer for the pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  if (percent < 0.05) return null; // Don't show labels for very small segments
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0
  });

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(*)')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    setTransactions(data || []);
    processTransactionData(data || []);
  };

  const processTransactionData = (transactions: Transaction[]) => {
    // Calculate totals
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = monthlyTransactions.reduce((sum, t) => t.amount > 0 ? sum + t.amount : sum, 0);
    const monthlyExpenses = Math.abs(monthlyTransactions.reduce((sum, t) => t.amount < 0 ? sum + t.amount : sum, 0));

    setTotals({
      balance: totalBalance,
      monthlyIncome,
      monthlyExpenses
    });

    // Process monthly data
    const monthlyDataMap = new Map();
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { month: monthYear, income: 0, expenses: 0 });
      }
      
      const data = monthlyDataMap.get(monthYear);
      if (t.amount > 0) {
        data.income += t.amount;
      } else {
        data.expenses += Math.abs(t.amount);
      }
    });

    const monthlyDataArray = Array.from(monthlyDataMap.values())
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months

    setMonthlyData(monthlyDataArray);

    // Process category data for expenses
    const categoryDataMap = new Map();
    transactions
      .filter(t => t.amount < 0) // Only expenses
      .forEach(t => {
        const categoryName = t.category?.name || 'Uncategorized';
        if (!categoryDataMap.has(categoryName)) {
          categoryDataMap.set(categoryName, { name: categoryName, value: 0 });
        }
        categoryDataMap.get(categoryName).value += Math.abs(t.amount);
      });

    setCategoryData(Array.from(categoryDataMap.values()));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, {user?.email}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Balance</h3>
          <p className={`text-3xl font-bold ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totals.balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Income</h3>
          <p className="text-3xl font-bold text-blue-600">${totals.monthlyIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-red-600">${totals.monthlyExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Income vs Expenses</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="income" fill="#0088FE" name="Income" />
                <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Expense Categories</h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${value.toFixed(2)}`}
                    labelFormatter={(name) => `${name}`}
                  />
                  <Legend 
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value, entry) => (
                      <span className="text-sm">
                        {value}: ${entry.payload.value.toFixed(2)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 flex items-center justify-center h-full">
                No expense data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}