import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white border-t-4 border-blue-500 py-6">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-serif font-bold text-blue-100 mb-2">
            Tyde Home Fittings & Sanitaries
          </h3>
          <p className="text-blue-200 font-medium max-w-2xl mx-auto italic">
            Bringing you quality home fittings and sanitary solutions with a touch of timeless elegance.
          </p>
        </div>

        {/* Links and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-serif font-semibold text-blue-100 mb-4 border-b border-blue-500 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['About Us', 'Products', 'Gallery', 'Testimonials'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-white transition-colors duration-300 hover:underline underline-offset-4 decoration-blue-500"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-xl font-serif font-semibold text-blue-100 mb-4 border-b border-blue-500 pb-2">
              Contact Us
            </h4>
            <address className="not-italic text-blue-200">
              <p className="mb-2">123 Heritage Lane</p>
              <p className="mb-2">Victorian District</p>
              <p className="mb-2">+1 (555) 123-4567</p>
              <p>contact@tydehome.com</p>
            </address>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-serif font-semibold text-blue-100 mb-4 border-b border-blue-500 pb-2">
              Follow Us
            </h4>
            <div className="flex justify-center md:justify-end space-x-4">
              {['Facebook', 'Instagram', 'Pinterest'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-blue-200 hover:text-white transition-colors duration-300"
                  aria-label={`Follow us on ${social}`}
                >
                  <span className="text-lg font-medium">{social}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-1 bg-blue-500 rounded-full"></div>
        </div>

        {/* Copyright */}
        <div className="text-center text-blue-300 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Tyde Home Fittings & Sanitaries. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-blue-400">
            Crafted with elegance for your home
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
      