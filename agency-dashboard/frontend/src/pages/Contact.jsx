import React from "react";

function Contact() {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl">
      <h2 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-8 leading-tight">
        Contact Us
      </h2>
      <p className="text-xl md:text-2xl text-indigo-700 mb-6 leading-relaxed">
        Have questions or need support? Reach out directly to your admin using the contact details below.
      </p>
      <ul className="text-indigo-700 text-lg md:text-xl space-y-2 mb-6">
        <li>Email: admin@pm-ajay.gov.in</li>
        <li>Helpline: 1800-XYZ-PMAJAY</li>
      </ul>
      <p className="text-indigo-600 text-base md:text-lg leading-relaxed">
        Our support team is available 24/7 for all agencies.
      </p>
    </div>
  );
}

export default Contact;
