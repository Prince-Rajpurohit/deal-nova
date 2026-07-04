import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | Deal Nova",
  description: "Read our privacy guidelines, cookie practices, and data security procedures.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#FDFBF7] py-16 dark:bg-[#111111] transition-colors duration-300">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="border-b border-[#EAE5D9] pb-6 dark:border-[#2D2B2A]">
            <h1 className="font-serif text-3xl font-bold text-[#111111] dark:text-[#FDFBF7]">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: July 4, 2026
            </p>
          </div>

          <div className="prose max-w-none text-[#706E6B] dark:text-[#A09D9A] text-sm leading-relaxed space-y-6">
            <p>
              At Deal Nova, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Deal Nova and how we use it.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              1. Information We Collect
            </h2>
            <p>
              If you register for an account on our platform, we collect credentials including your name, email address, hashed passwords, and optional profile image URLs. If you subscribe to our newsletters, we store your email address.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              2. Outbound Link Tracking & Analytics
            </h2>
            <p>
              To optimize our affiliate marketing commissions, we track and log clicks on product redirect buttons (e.g. click logs including destination retailer and timestamps). This contains zero personally identifying information (PII) and is purely used for aggregate conversion calculations.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              3. Cookies and Web Beacons
            </h2>
            <p>
              Like any other website, Deal Nova uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              4. Third-Party Partners (Affiliates)
            </h2>
            <p>
              We integrate affiliate links from Amazon, Flipkart, Myntra, and others. Clicking these links redirects you to their platform, which may deploy cookies or track your actions on their domain according to their individual privacy guidelines.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FDFBF7] pt-4">
              5. Consent
            </h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
