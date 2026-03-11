import Link from "next/dist/client/link";
import React from "react";

// created by Alec Schulte


// In this section I pulled the information and layout from the first sprint powerpoint and created the requirements page based on the outline from that presentation. 
export const RequirementsPage: React.FC = () => {
  return (
    <section className="home" id="home">
        <div className="container mx-auto text-center">
            <h1 className="text-6xl font-bold p-16 mb-4 text-black">Missouri Medicaid Program Requirements</h1>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Basic Eligibility</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Must be a resident of Missouri</li>
                    <li>Must be a U.S. citizen or qualified non-citizen</li>
                    <li>Must meet income and resource limits</li>
                </ul>
            </div>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Employment Requirements</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Recent pay stubs within the last 30 days</li>
                    <li>Employer contact information</li>
                    <li>Hours worked per week</li>
                    <li>Self-employment documentation (if applicable)</li>
                </ul>
            </div>
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">Documents You May Need</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>Government-issued ID</li>
                    <li>Social Security Number</li>
                    <li>Proof of Missouri residency (e.g., utility bill, lease agreement)</li>
                    <li>Proof of income (e.g., pay stubs, tax returns)</li>
                    <li>Employer verification form (if requested)</li>
                </ul>
            </div>
            {/* Addresses User story "Age eligibility" - Ward */}
            <div className="container mx-auto text-left bg-white text-white rounded-2xl max-w-[75%]">
                <h2 className="text-xl text-white font-bold mb-4 bg-blue-700 rounded-t-2xl p-3">How to determine if you qualify for Medicaid</h2>
                <ul className="list-disc marker:text-blue-700 text-3xl leading-relaxed list-inside mb-4 pl-5 pb-5 text-black">
                    <li>In Missouri, Medicaid is administered to residents who meet specific income and resource requirements</li>
                    <li>Adults under age 65</li>
                    <li>Infants under one</li>
                    <li>Pregnant women</li>
                    <li>Depending on your age, health, and individual needs, you may be eligible for a certain type of MO HealthNet(Missouri Medicaid) coverage. <a href="https://mydss.mo.gov/media/pdf/eligibility-requirements-mo-healthnet-coverage" target="_blank" style={{ textDecoration: 'underline', color: 'blue' }} >Eligibility Requirements for MO HealthNet Coverage</a></li>
                </ul>
            </div>
        
        </div>

        {/*  added some buttons at the bottom of the requirements page to link to the application, a pdf of the requirements, and a contact page. 
            The buttons are currently not functional at the moment but they are there for placeholders for the future.  */ }

    <div className="flex justify-center gap-6 mt-10 pb-12">
        <button className="bg-green-600 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-full transition shadow-lg">
            <Link href="/">
                Start Application
            </Link>
        </button>

        <button className="bg-gray-400 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-full transition shadow-lg">
            <Link href="/">
                Requirements PDF
            </Link>
        </button>
        <button className="bg-gray-700 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-full transition shadow-lg">
            <Link href="/">
                Contact
            </Link>
        </button>
    </div>



    </section>
  );
}   

export default RequirementsPage;