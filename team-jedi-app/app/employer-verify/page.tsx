'use client';

// Calis Ward sprint 4
// Alec Schulte Final Presentation Edits

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/browser-client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Application {
  id: string;
  applicant_id_number: string;
  employer_name: string;
  job_title: string;
  monthly_hours_worked: number;
  employment_status: string;
  document_url: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'pre_verified';
  created_at: string;
  applicant_name?: string;
  employer_tax_id?: string;
  employer_verified?: boolean;
  employer_notes?: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient() as any, []);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [relatedApplications, setRelatedApplications] = useState<Application[]>([]);
  const [preVerifiedApplicants, setPreVerifiedApplicants] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [employmentNotes, setEmploymentNotes] = useState('');
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: any } | null }) => {
      if (!data?.user) {
        router.replace('/email-password');
      } else {
        setCheckingAuth(false);
        fetchPendingApplications();
        fetchPreVerifiedApplicants();
      }
    });
  }, []);

  const fetchPendingApplications = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
      return;
    }

    const allPending = data || [];

    const uniqueApplicants = Object.values(
      allPending.reduce((acc: Record<string, Application>, app: Application) => {
        if (!acc[app.applicant_id_number]) {
          acc[app.applicant_id_number] = app;
        }
        return acc;
      }, {})
    );

    setApplications(uniqueApplicants);

    if (uniqueApplicants.length > 0) {
      const firstApplicant = uniqueApplicants[0];

      const firstApplicantRecords = allPending.filter(
        (app: Application) =>
          app.applicant_id_number === firstApplicant.applicant_id_number
      );

      setSelectedApp(firstApplicantRecords[0]);
      setRelatedApplications(firstApplicantRecords);
      setEmploymentNotes(firstApplicantRecords[0]?.employer_notes || '');
    } else {
      setSelectedApp(null);
      setRelatedApplications([]);
      setEmploymentNotes('');
    }

    setLoading(false);
  };

  const fetchPreVerifiedApplicants = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('verification_status', 'pre_verified');

    if (!error && data) {
      setPreVerifiedApplicants(data);
    }
  };

  const loadRelatedApplications = async (app: Application) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('applicant_id_number', app.applicant_id_number)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading related applications:', error);
      return;
    }

    const records = data || [];

    setSelectedApp(records[0] || app);
    setRelatedApplications(records);
    setEmploymentNotes(records[0]?.employer_notes || '');
  };

  const verifyEmployment = async (id: string, confirmed: boolean) => {
    const updateData: any = {
      employer_verified: confirmed,
      employer_notes: employmentNotes,
      employer_verification_date: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      alert('Error updating employment: ' + error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert('No row was updated.');
      return;
    }

    setRelatedApplications((current) =>
      current.map((app) =>
        app.id === id
          ? {
              ...app,
              employer_verified: confirmed,
              employer_notes: employmentNotes,
            }
          : app
      )
    );

    if (selectedApp?.id === id) {
      setSelectedApp({
        ...selectedApp,
        employer_verified: confirmed,
        employer_notes: employmentNotes,
      });
    }

    setEmploymentNotes('');
    alert(`Employment ${confirmed ? 'verified' : 'denied'} successfully.`);
  };

  const allEmploymentsVerified =
    relatedApplications.length > 0 &&
    relatedApplications.every((app) => app.employer_verified === true);

  const verifyFullApplication = async (status: 'approved' | 'rejected') => {
    if (!selectedApp) return;

    const updateData: any = { verification_status: status };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const relatedIds = relatedApplications.map((app) => app.id);

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .in('id', relatedIds)
      .select();

    if (error) {
      alert('Error updating application: ' + error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert('No rows were updated. Check your RLS policy.');
      return;
    }

    alert(`Full application ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);

    setApplications((currentApplications) =>
      currentApplications.filter(
        (application) =>
          application.applicant_id_number !== selectedApp.applicant_id_number
      )
    );

    setRelatedApplications([]);
    setSelectedApp(null);
    setRejectionReason('');
    setEmploymentNotes('');
    fetchPreVerifiedApplicants();
  };

  const viewDocument = (url: string) => {
    const { data } = supabase.storage.from('employment-proof').getPublicUrl(url);
    window.open(data.publicUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="p-10">
        {checkingAuth ? (
          <p>Checking authentication...</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-black">
              Verify Employment Applications
            </h1>

            <p className="mb-6 text-gray-600">
              Review employer verification first, then approve or reject the full application.
            </p>

            {preVerifiedApplicants.length > 0 && (
              <div className="bg-green-50 border border-green-400 rounded-lg p-4 mb-6">
                <h3 className="text-green-800 font-semibold mb-2">
                  ✨ Pre-Verified Applicants
                </h3>

                <p className="text-green-700 mb-3">
                  The following applicants have been automatically verified through Missouri tax records.
                </p>

                <div className="space-y-2">
                  {preVerifiedApplicants.map((app) => (
                    <div key={app.id} className="bg-white p-3 rounded border border-green-200">
                      <p>
                        <strong>{app.applicant_name || 'Applicant'}</strong> - Employment already verified
                      </p>

                      <button
                        onClick={() => loadRelatedApplications(app)}
                        className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Review Applicant
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative inline-block mb-6">
              <span
                className="text-blue-600 cursor-help border-b border-dotted border-blue-600"
                onMouseEnter={() =>
                  setHoverInfo(
                    'Each applicant appears once in the queue. Employment verification is separate from final application approval.'
                  )
                }
                onMouseLeave={() => setHoverInfo(null)}
              >
                ⓘ How verification works
              </span>

              {hoverInfo && (
                <div className="absolute bg-gray-800 text-white p-2 rounded text-sm mt-1 z-10">
                  {hoverInfo}
                </div>
              )}
            </div>

            {loading ? (
              <p>Loading applications...</p>
            ) : applications.length === 0 ? (
              <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
                No applications currently need verification.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4 text-black">
                  <h2 className="text-xl font-bold mb-4 text-black">
                    Applicant Verification Queue ({applications.length})
                  </h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {applications.map((app) => (
                      <div
                        key={app.applicant_id_number}
                        onClick={() => loadRelatedApplications(app)}
                        className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                          selectedApp?.applicant_id_number === app.applicant_id_number
                            ? 'border-blue-500 bg-blue-50'
                            : ''
                        }`}
                      >
                        <p className="font-semibold text-black">
                          {app.applicant_name || 'Applicant'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Latest Employer: {app.employer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Latest Job: {app.job_title}
                        </p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApp && (
                  <div className="bg-white rounded-lg shadow p-4 text-black">
                    <h2 className="text-xl font-bold mb-4 text-black">
                      Verify Full Applicant File
                    </h2>

                    <div className="space-y-3">
                      <div>
                        <label className="font-semibold text-black">Applicant Name:</label>
                        <p className="text-gray-700">
                          {selectedApp.applicant_name || 'Not provided'}
                        </p>
                      </div>

                      <div>
                        <label className="font-semibold text-black">Selected Employer:</label>
                        <p className="text-gray-700">{selectedApp.employer_name}</p>
                      </div>

                      <div>
                        <label className="font-semibold text-black">Selected Job:</label>
                        <p className="text-gray-700">{selectedApp.job_title}</p>
                      </div>

                      <div>
                        <button
                          onClick={() => viewDocument(selectedApp.document_url)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          View Proof of Employment Document
                        </button>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-bold mb-2 text-black">
                          Employment Records for This Applicant
                        </h3>

                        {relatedApplications.length === 0 ? (
                          <p className="text-gray-600 text-sm">
                            No related employment records found.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {relatedApplications.map((related) => (
                              <div
                                key={related.id}
                                onClick={() => {
                                  setSelectedApp(related);
                                  setEmploymentNotes(related.employer_notes || '');
                                }}
                                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                                  selectedApp?.id === related.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : ''
                                }`}
                              >
                                <p className="font-semibold text-black">
                                  {related.employer_name}
                                </p>
                                <p className="text-sm text-gray-600">{related.job_title}</p>
                                <p className="text-sm text-gray-600">
                                  Hours: {related.monthly_hours_worked}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Employment Verified:{' '}
                                  {related.employer_verified ? 'Yes' : 'No'}
                                </p>

                                {selectedApp?.id === related.id && (
                                  <div className="mt-3 space-y-2">
                                    <textarea
                                      className="w-full p-2 border rounded text-black"
                                      rows={3}
                                      value={employmentNotes}
                                      onChange={(e) => setEmploymentNotes(e.target.value)}
                                      placeholder="Add employment verification comments..."
                                    />

                                    <div className="flex gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          verifyEmployment(related.id, true);
                                        }}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                      >
                                        Verify Employment
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          verifyEmployment(related.id, false);
                                        }}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                      >
                                        Deny Employment
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-bold mb-2 text-black">
                          Final Application Decision
                        </h3>

                        <textarea
                          className="w-full p-2 border rounded"
                          rows={3}
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Explain why this application is being rejected..."
                        />

                        <div className="flex gap-3 flex-wrap mt-3">
                          {allEmploymentsVerified ? (
                            <button
                              onClick={() => verifyFullApplication('approved')}
                              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                            >
                              Approve Full Application
                            </button>
                          ) : (
                            <p className="text-yellow-600 font-semibold">
                              All employment records must be employer verified before final approval.
                            </p>
                          )}

                          <button
                            onClick={() => verifyFullApplication('rejected')}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                          >
                            Reject Full Application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}