import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0D112B] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Left Section */}
          <div>
            <p className="mb-4 text-gray-300">
              Our business Management Services ensure top-tier infrastructure,
              performance, and support.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Middle Section */}
          <div>
            <h4 className="font-bold mb-4">Address</h4>
            <p className="text-gray-300">
              167-169 Great Portland Street, 5th Floor, London, England, W1W
              5PF
            </p>
          </div>

          {/* Right Section */}
          <div>
            <h4 className="font-bold mb-4">Let’s Connect</h4>
            <p className="text-gray-300">info@storekwil.com</p>
            <p className="text-gray-300">sales@storekwil.com</p>
            <p className="text-gray-300 mt-4">Phone No: +44(0)20 3723 6703</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-gray-400">
            ©2024 - Designed by Techitslab & Partners
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

