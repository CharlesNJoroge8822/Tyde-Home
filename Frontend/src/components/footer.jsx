import React from 'react';

const Footer = () => {
  return (
<footer className="w-[90%] mx-auto bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 text-white border-t-8 border-blue-700 py-10 relative overflow-hidden rounded-2xl">
{/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/antique-wall.png')]"></div>
      </div>
      
      {/* Vintage corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-blue-600"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-blue-600"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-blue-600"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-blue-600"></div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Logo and Tagline */}
        <div className="text-center mb-10">
          <h3 className="text-4xl font-serif font-bold text-blue-100 mb-3 tracking-wider">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
              TYDE HOME
            </span>
          </h3>
          <p className="text-blue-200 font-medium max-w-2xl mx-auto italic text-lg">
            <span className="border-b-2 border-blue-500 pb-1">
              Timeless fittings & sanitary elegance...
            </span>
          </p>
        </div>

        {/* Links and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
{/* 1985 */}
          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-2xl font-serif font-semibold text-blue-100 mb-5 pb-2 relative inline-block">
              <span className="relative">
                Contact Us
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></span>
              </span>
            </h4>
            <address className="not-italic text-blue-200 space-y-3">
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>Kitengela, 411, Tyde-Homes</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>0711196608</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-5 h-5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>annmachanga@gmail.com</span>
              </div>
            </address>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h4 className="text-2xl font-serif font-semibold text-blue-100 mb-5 pb-2 relative inline-block">
              <span className="relative">
                Follow Us
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></span>
              </span>
            </h4>
            <div className="flex justify-center md:justify-end space-x-5">
              {[
                { name: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { name: 'Pinterest', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z' }
              ].map((social) => (
                <a 
                  key={social.name}
                  href="#" 
                  className="text-blue-200 hover:text-white transition-all duration-300 group"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-800 group-hover:bg-blue-700 border border-blue-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.icon} />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-blue-300 text-sm font-medium tracking-wide">
            &copy; {new Date().getFullYear()} TYDE HOME FITTINGS & SANITARIES. ALL RIGHTS RESERVED.
          </p>
          <p className="mt-2 text-xs text-blue-400 font-serif italic">
            Crafted with <span className="text-blue-300">heritage</span> • Designed for <span className="text-blue-300">timelessness</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;