import Link from "next/link";
import React from "react";

// created by Alec Schulte

export const RequirementsPage: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-14">
          Missouri Medicaid Program Requirements
        </h1>

        <div className="space-y-10">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden py-4 border-2 border-solid border-black">
            <div className="bg-white text-black px-6 py-4 text-xl font-semibold">
              Basic Eligibility
            </div>
            <ul className="p-8 space-y-3 list-disc list-inside text-lg">
              <li>Must be a resident of Missouri</li>
              <li>Must be a U.S. citizen or qualified non-citizen</li>
              <li>Must meet income and resource limits</li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden py-4 border-2 border-solid border-black">
            <div className="bg-white text-black px-6 py-4 text-xl font-semibold">
              Employment Requirements
            </div>
            <ul className="p-8 space-y-3 list-disc list-inside text-lg">
              <li>Recent pay stubs within the last 30 days</li>
              <li>Employer contact information</li>
              <li>Hours worked per week</li>
              <li>Self-employment documentation (if applicable)</li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden py-4 border-2 border-solid border-black">
            <div className="bg-white text-black px-6 py-4 text-xl font-semibold">
              Documents You May Need
            </div>
            <ul className="p-8 space-y-3 list-disc list-inside text-lg">
              <li>Government-issued ID</li>
              <li>Social Security Number</li>
              <li>Proof of Missouri residency (utility bill, lease, etc.)</li>
              <li>Proof of income (pay stubs, tax returns)</li>
              <li>Employer verification form (if requested)</li>
            </ul>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden py-4 border-2 border-solid border-black">
            <div className="bg-white text-black px-6 py-4 text-xl font-semibold">
              How to Determine if You Qualify
            </div>
            <ul className="p-8 space-y-3 list-disc list-inside text-lg">
              <li>
                Medicaid is available to Missouri residents who meet income and
                resource requirements.
              </li>
              <li>Adults under age 65</li>
              <li>Infants under one year old</li>
              <li>Pregnant women</li>
              <li>
                Learn more about MO HealthNet coverage{" "}
                <a
                  href="https://mydss.mo.gov/media/pdf/eligibility-requirements-mo-healthnet-coverage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  here
                </a>
                .
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-14">
          <Link
            href="/apply"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition"
          >
            Start Application
          </Link>

          <Link
            href="/requirements.pdf"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-full shadow-lg transition"
          >
            Requirements PDF
          </Link>

          <Link
            href="/contact"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-full shadow-lg transition"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPage;