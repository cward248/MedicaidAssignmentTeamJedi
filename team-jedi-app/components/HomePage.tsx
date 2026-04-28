import React from "react";
import Link from "next/link";

export const HomePage: React.FC = () => {
  return (
    <section className="home py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold text-black mb-12">
          Welcome to Missouri Medicaid
        </h1>

        <div className="max-w-4xl text-black mx-auto space-y-10">
          {/* How do I apply */}
          <div className="bg-white shadow-md rounded-lg p-8 text-left border-2 border-solid border-black">
            <h2 className="text-2xl font-bold mb-4">How do I apply?</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Create an account and verify your email address.</li>
              <li>Log in to see the option to submit an application.</li>
              <li>
                Click the <strong>Submit Application</strong> button and follow
                the instructions.
              </li>
            </ul>
          </div>

          {/* What happens next */}
          <div className="bg-white shadow-md rounded-lg p-8 text-left border-2 border-solid border-black">
            <h2 className="text-2xl font-bold mb-4">What happens next?</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Our team reviews your application.</li>
              <li>You will receive confirmation with your benefits if approved.</li>
              <li>
                If anything is missing, we will contact you with what is needed.
              </li>
            </ul>
          </div>

          {/* Not sure what you need */}
          <div className="bg-white shadow-md rounded-lg p-8 text-left border-2 border-solid border-black">
            <h2 className="text-2xl font-bold mb-4">Not sure what you need?</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <Link href="/requirements" className="text-blue-600 underline">
                  View the requirements here
                </Link>
              </li>
              <li>
                Email us at{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 underline"
                >
                  support@example.com
                </a>{" "}
                or call (123-456-7890)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};