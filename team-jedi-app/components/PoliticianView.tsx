// User story: As a politician, I want to view and manage Medicaid benefit recipients, so that this data can be viewed.
// Author: Calis W. - Jedi
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from './Header';
import Footer from './Footer';

interface Application {
  id: string;
  employer_name: string;
  employer_tax_id: string;
  job_title: string;
  monthly_hours_worked: number;
  employment_status: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  applicant_name?: string;
  applicant_address?: string;
  applicant_id_number?: string;
  politician_viewed: boolean;
  politician_notes?: string;
}

export default function PoliticianView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [politicianNotes, setPoliticianNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    viewed: 0
  });

  useEffect(() => {
    fetchAllApplications();
  }, []); // grab data from all the other displays the team has established

  useEffect(() => {
    filterApplications();
  }, [filterStatus, searchTerm, applications]);

  const fetchAllApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      alert('Error loading applications: ' + error.message);
    } else {
      setApplications(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  };

  const calculateStats = (apps: Application[]) => {
    setStats({
      total: apps.length,
      approved: apps.filter(a => a.verification_status === 'approved').length,
      pending: apps.filter(a => a.verification_status === 'pending').length,
      rejected: apps.filter(a => a.verification_status === 'rejected').length,
      viewed: apps.filter(a => a.politician_viewed).length
    });
  };

  const filterApplications = () => {
    let filtered = [...applications];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.verification_status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.employer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.applicant_name && app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredApps(filtered);
  };

  const markAsViewed = async (appId: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ 
        politician_viewed: true, 
        politician_viewed_at: new Date().toISOString() 
      })
      .eq('id', appId);

    if (error) {
      console.error('Error marking as viewed:', error);
    } else {
      // Log the view for audit trail
      await supabase
        .from('politician_views')
        .insert([{
          politician_email: 'politician@mo.gov', // In real app, get from auth
          application_id: appId,
          action_taken: 'viewed'
        }]);
      
      fetchAllApplications();
    }
  };

  const savePoliticianNotes = async (appId: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ politician_notes: politicianNotes })
      .eq('id', appId);

    if (error) {
      alert('Error saving notes: ' + error.message);
    } else {
      alert('Notes saved successfully!');
      fetchAllApplications();
      setSelectedApp(null);
      setPoliticianNotes('');
    }
  };

  const exportToCSV = () => {
    const headers = ['Applicant Name', 'Employer', 'Job Title', 'Hours', 'Status', 'Submitted Date', 'Viewed'];
    const csvData = filteredApps.map(app => [
      app.applicant_name || 'N/A',
      app.employer_name,
      app.job_title,
      app.monthly_hours_worked,
      app.verification_status,
      new Date(app.created_at).toLocaleDateString(),
      app.politician_viewed ? 'Yes' : 'No'
    ]); // allow politician to interact with data in ways that are most useful to them
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicaid_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-black">Medicaid Benefits Management Dashboard</h1>
          <p className="text-gray-600">Politician View: Monitor and manage Medicaid benefit recipients</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <h3 className="text-sm text-green-600">Approved</h3>
            <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <h3 className="text-sm text-yellow-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <h3 className="text-sm text-red-600">Rejected</h3>
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <h3 className="text-sm text-blue-600">Viewed by Politician</h3>
            <p className="text-2xl font-bold text-blue-700">{stats.viewed}</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-4 py-2 rounded ${filterStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-black'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-4 py-2 rounded ${filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}
              >
                Rejected
              </button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name or employer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-3 py-2 text-black w-64"
              />
              <button
                onClick={exportToCSV}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Export to CSV
              </button>
              <button
                onClick={fetchAllApplications}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-black">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
            No applications found matching the criteria.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viewed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {app.applicant_name || 'Not provided'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {app.employer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {app.job_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {app.monthly_hours_worked}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.politician_viewed ? (
                        <span className="text-green-600">✓ Viewed</span>
                      ) : (
                        <button
                          onClick={() => markAsViewed(app.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Mark Viewed
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setPoliticianNotes(app.politician_notes || '');
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-black">Application Details</h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4 text-black">
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-lg text-black mb-2">Applicant Information</h3>
                    <p><strong>Name:</strong> {selectedApp.applicant_name || 'Not provided'}</p>
                    <p><strong>Address:</strong> {selectedApp.applicant_address || 'Not provided'}</p>
                    <p><strong>ID Number:</strong> {selectedApp.applicant_id_number || 'Not provided'}</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-lg text-black mb-2">Employment Information</h3>
                    <p><strong>Employer:</strong> {selectedApp.employer_name}</p>
                    <p><strong>Tax ID:</strong> {selectedApp.employer_tax_id}</p>
                    <p><strong>Job Title:</strong> {selectedApp.job_title}</p>
                    <p><strong>Hours/Week:</strong> {selectedApp.monthly_hours_worked}</p>
                    <p><strong>Status:</strong> {selectedApp.employment_status}</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-lg text-black mb-2">Application Status</h3>
                    <p><strong>Verification:</strong> {selectedApp.verification_status}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedApp.created_at).toLocaleString()}</p>
                    <p><strong>Politician Viewed:</strong> {selectedApp.politician_viewed ? 'Yes' : 'No'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-black mb-2">Politician Notes</h3>
                    <textarea
                      value={politicianNotes}
                      onChange={(e) => setPoliticianNotes(e.target.value)}
                      className="w-full p-3 border rounded text-black"
                      rows={4}
                      placeholder="Add notes about this application..."
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => savePoliticianNotes(selectedApp.id)}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Save Notes
                    </button>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}