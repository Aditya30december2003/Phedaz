import React, { useState } from "react";

const WaitlistForm = () => {
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [vipAccess, setVipAccess] = useState(false);

  return (
    <div className="min-h-screen bg-gray-500 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Section */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">JOIN OUR WAITLIST</h2>
            <p className="text-gray-700 mb-8">
              READY TO REVOLUTIONISE YOUR BUSINESS? JOIN OUR WAITLIST AND BE THE
              FIRST TO GAIN EXCLUSIVE ACCESS TO STOREKWIL.
            </p>
          </div>

          {/* Right Section */}
          <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-6">
            {/* Form */}
            <form>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="* FIRST NAME"
                  className="border rounded-md p-2"
                  required
                />
                <input
                  type="text"
                  placeholder="* LAST NAME"
                  className="border rounded-md p-2"
                  required
                />
                <input
                  type="email"
                  placeholder="* EMAIL ADDRESS"
                  className="border rounded-md p-2"
                  required
                />
                <input
                  type="text"
                  placeholder="BUSINESS NAME"
                  className="border rounded-md p-2"
                />
              </div>
              <div className="mt-4">
                <select className="border rounded-md p-2 w-full" required>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
              <div className="mt-4">
                <input
                  type="tel"
                  placeholder="* TELEPHONE"
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span>Do you have referral Code?</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => setHasReferralCode(!hasReferralCode)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              {hasReferralCode && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Referral Code"
                    className="border rounded-md p-2 w-full"
                  />
                </div>
              )}
              <div className="mt-6 flex items-center gap-2">
                <img
                  src="https://storekwil.com/loyalty.png"
                  alt="Loyalty Program"
                  className="w-12 h-12"
                />
                <img
                  src="https://storekwil.com/joinnow1.gif"
                  alt="Join Now"
                  className="w-24 h-12"
                />
              </div>
              <p className="mt-4 text-gray-700">
                Share your personal referral link or code with friends and
                family. Each new sign-up from your link moves you up the VIP
                queue, giving you exclusive access to premium features.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span>Would you like VIP access?</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() => setVipAccess(!vipAccess)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Terms & Exclusions apply.
              </p>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    required
                    className="mr-2"
                  />
                  By clicking this box, you agree to our Privacy Policy.
                </label>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 w-full mt-6"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistForm;
