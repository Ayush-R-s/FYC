import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Analytics = ({ analytics, isDarkMode }) => {
    const renderStars = (rating) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (<span key={i} className={i <= rating ? 'text-orange-500' : 'text-gray-300'}>★</span>))}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-8 shadow-sm border`}>
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Rating Distribution</h2>
                    <div className="flex justify-center w-full">
                        <ResponsiveContainer width="100%" height={500}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: '5 Stars', value: analytics.ratingDist[5] },
                                        { name: '4 Stars', value: analytics.ratingDist[4] },
                                        { name: '3 Stars', value: analytics.ratingDist[3] },
                                        { name: '2 Stars', value: analytics.ratingDist[2] },
                                        { name: '1 Star', value: analytics.ratingDist[1] }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={(entry) => {
                                        const { name, value, percent, x, y } = entry;
                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                fill={isDarkMode ? '#ffffff' : '#111827'}
                                                textAnchor={x > entry.cx ? 'start' : 'end'}
                                                dominantBaseline="central"
                                                fontSize="14px"
                                                fontWeight="600"
                                            >
                                                {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                            </text>
                                        );
                                    }}
                                    outerRadius={150}
                                    innerRadius={0}
                                    fill="#8884d8"
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                    onMouseEnter={(data, index, e) => {
                                        if (e && e.target) {
                                            e.target.style.transformOrigin = 'center';
                                            e.target.style.transform = 'scale(1.05)';
                                            e.target.style.transition = 'all 0.3s ease';
                                            e.target.style.cursor = 'pointer';
                                        }
                                    }}
                                    onMouseLeave={(data, index, e) => {
                                        if (e && e.target) {
                                            e.target.style.filter = 'none';
                                            e.target.style.transform = 'scale(1)';
                                        }
                                    }}
                                >
                                    <Cell fill="#f97316" style={{ transition: 'all 0.3s ease' }} />
                                    <Cell fill="#fb923c" style={{ transition: 'all 0.3s ease' }} />
                                    <Cell fill="#fdba74" style={{ transition: 'all 0.3s ease' }} />
                                    <Cell fill="#fed7aa" style={{ transition: 'all 0.3s ease' }} />
                                    <Cell fill="#94a3b8" style={{ transition: 'all 0.3s ease' }} />
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `${value} feedback`}
                                    contentStyle={{
                                        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                                        border: `2px solid #ff6b35`,
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                    labelStyle={{
                                        color: isDarkMode ? '#ffffff' : '#111827',
                                        fontWeight: '600'
                                    }}
                                    itemStyle={{
                                        color: isDarkMode ? '#ffffff' : '#111827'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    formatter={(value) => <span style={{ color: isDarkMode ? '#e5e7eb' : '#111827' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>


            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 shadow-sm border`}>
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Subject Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(analytics.subjectAvg).map(([subject, data]) => {
                        const avg = (data.sum / data.count).toFixed(1);
                        return (
                            <div
                                key={subject}
                                className={`border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'} rounded-lg p-4 cursor-pointer`}
                                style={{
                                    transition: 'all 0.3s ease',
                                    transform: 'scale(1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    // Removed glow effect
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'} mb-3`}>{subject}</p>
                                <div className="flex items-center gap-3">
                                    {renderStars(Math.round(avg))}
                                    <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{avg}/5</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
