import React from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ComplaintCard from '../../components/ComplaintCard';

const OfficialDashboard: React.FC = () => {
  const complaints = [
    {
      id: 'CMP-2024-005',
      title: 'Water Supply Issue in Block C',
      description: 'Residents of Block C are experiencing low water pressure for the past 3 days.',
      category: 'Water Supply',
      status: 'pending' as const,
      date: '2024-01-22',
      location: 'Block C, Residential Complex',
      priority: 'high' as const
    },
    {
      id: 'CMP-2024-006',
      title: 'Street Cleaning Required',
      description: 'Main avenue needs urgent cleaning due to accumulated waste.',
      category: 'Waste Management',
      status: 'in-progress' as const,
      date: '2024-01-21',
      location: 'Main Avenue',
      priority: 'medium' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Department Dashboard</h1>
            <p className="text-gray-400 text-lg">Manage assigned complaints and track department performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Assigned Complaints</p>
                  <p className="text-2xl font-bold text-white">43</p>
                </div>
                <FileText className="h-8 w-8 text-teal-400" />
              </div>
            </div>
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolved Today</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="glass rounded-lg p-6 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-white">5</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Recent Assignments</h2>
            <div className="space-y-6">
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} {...complaint} />
              ))}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Department Performance</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <p>Performance analytics will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;