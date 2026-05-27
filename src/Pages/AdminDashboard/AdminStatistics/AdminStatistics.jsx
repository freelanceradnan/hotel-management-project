import { Brain, CircleGauge, DollarSign, Download, File, Gauge, House, RefreshCw, ShoppingBag, SignalHigh, UsersRound } from 'lucide-react';
import React, { useMemo } from 'react';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useGetAllRoomsQuery, useGetUserDataQuery, useSuccessAllPaymentsQuery } from '../../../Feature/ApiSlice';

const AdminStatistics = () => {
  const { data: allpayment = [], isLoading: allPaymentLoading } = useSuccessAllPaymentsQuery();
  const { data: allRooms = [], isLoading: allRoomsLoading } = useGetAllRoomsQuery();
  const { data: allUser = [], isLoading: allUserLoading } = useGetUserDataQuery();
  const globalLoading = allPaymentLoading || allRoomsLoading || allUserLoading;
  
  // Payment calculations
  const stats = useMemo(() => {
    const totalPayment = allpayment?.reduce((sum, item) => sum += item.Price, 0);
    return { totalPayment };
  }, [allpayment]);
 
  // Weekly trend metrics
  const data = [
    { name: 'Total Rooms', value: allRooms.length },
    { name: 'Completed Orders', value: allpayment.length },
    { name: 'Active Users', value: allUser.length }
  ];

  // Distribution matrix
  const piedata = [
    { name: 'Total Rooms', value: allRooms.length },
    { name: 'Completed Orders', value: allpayment.length },
    { name: 'Active Users', value: allUser.length }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  if (globalLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-transparent">
        <RefreshCw className="animate-spin text-blue-600 h-8 w-8" />
        <span className="ml-2 text-gray-600 dark:text-gray-300 font-medium">Loading Admin Data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-transparent min-h-screen transition-colors duration-300">
      
      {/* admin-statistics-top */}
      <div className='md:flex justify-between items-center py-4 gap-4'>
        <div className='flex items-center gap-4'>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Gauge size={40} />
          </div>
          <div>
            <h2 className='uppercase text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400'>Overview</h2>
            <p className='text-2xl font-extrabold text-gray-900 dark:text-gray-100'>Dashboard</p>
            <h2 className='text-gray-500 dark:text-gray-400 text-sm'>Monitor performance, sales, users, and support from one clean workspace.</h2>
          </div>
        </div>
        <div className='flex gap-2 mt-4 md:mt-0'>
          <button className='flex border border-gray-200 dark:border-zinc-700 items-center p-2 px-4 rounded-xl bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors gap-2 shadow-sm cursor-pointer font-medium text-sm uppercase tracking-wider'>
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className='flex border border-gray-200 dark:border-zinc-700 items-center p-2 px-4 rounded-xl bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors gap-2 shadow-sm cursor-pointer font-medium text-sm uppercase tracking-wider'>
            <File size={16} />
            <span>Create Report</span>
          </button>
        </div>
      </div>

      {/* statics-box */}
      <div className='my-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          
          <div className='p-5 border border-gray-100 dark:border-zinc-700/60 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all'>
            <div className='flex items-center gap-2 justify-between mb-2 text-gray-400 dark:text-gray-500'>
              <h2 className="font-semibold text-sm tracking-wide uppercase">Revenue</h2>
              <DollarSign size={20} className="text-blue-500" />
            </div>
            <div className='font-black text-3xl text-gray-900 dark:text-gray-100'>${stats.totalPayment}</div>
          </div>

          <div className='p-5 border border-gray-100 dark:border-zinc-700/60 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all'>
            <div className='flex items-center gap-2 justify-between mb-2 text-gray-400 dark:text-gray-500'>
              <h2 className="font-semibold text-sm tracking-wide uppercase">Rooms</h2>
              <House size={20} className="text-emerald-500" />
            </div>
            <div className='font-black text-3xl text-gray-900 dark:text-gray-100'>{allRooms.length}</div>
          </div>

          <div className='p-5 border border-gray-100 dark:border-zinc-700/60 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all'>
            <div className='flex items-center gap-2 justify-between mb-2 text-gray-400 dark:text-gray-500'>
              <h2 className="font-semibold text-sm tracking-wide uppercase">Orders</h2>
              <ShoppingBag size={20} className="text-amber-500" />
            </div>
            <div className='font-black text-3xl text-gray-900 dark:text-gray-100'>{allpayment.length}</div>
          </div>

          <div className='p-5 border border-gray-100 dark:border-zinc-700/60 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all'>
            <div className='flex items-center gap-2 justify-between mb-2 text-gray-400 dark:text-gray-500'>
              <h2 className="font-semibold text-sm tracking-wide uppercase">Users</h2>
              <UsersRound size={20} className="text-red-500" />
            </div>
            <div className='font-black text-3xl text-gray-900 dark:text-gray-100'>{allUser.length}</div>
          </div>
          
        </div>
      </div>

      {/* statistics-chart headers */}
      <div className='md:flex justify-between items-center py-4 border-t border-gray-100 dark:border-zinc-700 mt-8'>
        <div className='flex items-center gap-4'>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <SignalHigh size={40} />
          </div>
          <div>
            <h2 className='uppercase text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400'>Analytics</h2>
            <p className='text-2xl font-extrabold text-gray-900 dark:text-gray-100'>Charts</p>
            <h2 className='text-gray-500 dark:text-gray-400 text-sm'>Visualize revenue, channels, and operating performance</h2>
          </div>
        </div>
      </div>

      {/* Charts Layout Section */}
      <div className='flex flex-col lg:flex-row justify-between items-stretch gap-6 my-4 w-full pb-8'>
        
        {/* Left: Bar Chart Container */}
        <div className='w-full lg:w-5/12 p-6 border border-gray-100 dark:border-zinc-700/60 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex flex-col justify-between min-w-0'>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Revenue Trends</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gross metrics calculated per channel</p>
          </div>
          
          <div style={{ width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data}>
                <Tooltip cursor={{ fill: '#F3F4F6', opacity: 0.1 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Bottom Labels */}
          <div className='flex flex-wrap gap-3 justify-center mt-4 pt-2 border-t border-gray-50 dark:border-zinc-700'>
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-700 px-2.5 py-1 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
         
        {/* Right: Pie Distribution Chart Container */}
        <div className="w-full lg:w-7/12 min-w-0 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700/60 p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Analytics Distribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Percentage metrics share based on tracks</p>
          </div>

          <div style={{ width: '100%', height: '312px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip 
                  formatter={(value) => [`${value} units`, 'Total Volume']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                
                <Pie
                  data={piedata} 
                  cx="50%"
                  cy="45%"
                  dataKey="value"
                  nameKey="name"
                  outerRadius="75%"
                  innerRadius="0%"
                  isAnimationActive={true}
                  // ডার্ক মোডে পাই চার্টের টেক্সট লেবেল ফিক্সড করার জন্য কালার হ্যান্ডেল
                  label={({ name, value }) => {
                    const total = piedata?.reduce((sum, entry) => sum + (entry.value || 0), 0) || 0;
                    if (total === 0) return `${name}: 0%`;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${name}: ${percentage}%`;
                  }}
                  labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                >
                  {piedata.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStatistics;