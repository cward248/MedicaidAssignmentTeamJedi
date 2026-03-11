'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

//Created by David Huling- Jedi

/**
 * 
 *  This page allows a user to submit their employment information
// and upload a pay stub. 
// The info is saved to Supabase database and the document is uploaded to Supabase storage
// 
 */

export default function ApplyPage() {

    //variables for form input
  const [employerName, setEmployerName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('Full-time');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  //function that runs when users submits form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {       //upload starts empty
      let uploadedFilePath = '';

        //Upload file to storage
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from('employment-proof')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        uploadedFilePath = data.path;
      }
            // Insert form data into the applications table


      const { error: dbError } = await supabase.from('applications').insert([
        {
          employer_name: employerName,
          job_title: jobTitle,
          monthly_hours_worked: parseFloat(hours),
          employment_status: status,
          document_url: uploadedFilePath
        }
      ]);

      if(dbError) throw dbError;
      //notify if submission was successful
      alert("Success! Your application has been submitted.");

    }catch(error: any){
      alert("Error: " + error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-black font-bold">
      <Header />
      
      <main className="flex-grow p-10 flex justify-center">
        <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-xl border-t-8 border-blue-600">
          <h1 className="text-3xl text-center mb-6">Employment Form</h1>
          {/*Employment form*/}
          <form onSubmit={handleSubmit} className="space-y-4">
        
            <div>
               
              <label>
                Employer Name <span className="text-red-600">*</span>
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded text-black"
                required
                onChange={(e) => setEmployerName(e.target.value)} 
              />
            </div>

            <div>
                
              <label>
                Job Title <span className="text-red-600">*</span>
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded text-black"
                required
                onChange={(e) => setJobTitle(e.target.value)} 
              />
            </div>

            <div>
              <label>
                Hours Per Week <span className="text-red-600">*</span>
              </label>
              <input 
                type="number" 
                className="w-full p-2 border rounded text-black"
                required
                onChange={(e) => setHours(e.target.value)} 
              />
            </div>

            <div>
              <label>
                Employment Status <span className="text-red-600">*</span>
              </label>
              <select 
                className="w-full p-2 border rounded text-black"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Full-time">Full time</option>
                <option value="Part-time">Part time</option>
                <option value="Self-employed">Self employed</option>
              </select>
            </div>

                    {/* The upload feature */}


          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}