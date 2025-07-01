import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Lock, Headphones } from 'lucide-react';
import { get } from '../../lib/api';
import type { ContactInfo } from '../../types/platform';

const defaultContactInfo: ContactInfo = {
  email: "hello@livssentials.co",
  phone: "+1 (234) 567-890",
  address: "123 Fashion Street, Design District, New York, NY 10001",
  socialMedia: {
    facebook: "#",
    instagram: "#",
    snapchat: "#",
    tiktok: "#"
  }
};

// Custom SVG icon components
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const SnapchatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a9.65 9.65 0 0 0-3.071.44c-.022.008-.043.017-.065.026a3.146 3.146 0 0 0-1.4 1.168 3.12 3.12 0 0 0-.411 1.318c-.034.4-.054.793-.054 1.215 0 .475.022.96.022 1.453a1.243 1.243 0 0 1-.306.901c-.683.475-2.055.98-2.531 1.105a.556.556 0 0 0-.446.585c.011.162.077.317.19.425.28.264.475.343.673.423.215.088.444.183.602.367.088.105.162.237.175.372a.421.421 0 0 1-.064.256c-.292.607-1.033 1.876-2.97 2.133a.39.39 0 0 0-.336.41c.023.145.103.28.223.374.149.115.319.208.495.29a5.01 5.01 0 0 0 1.143.34c.066.148.154.608.264.9.088.23.307.401.683.401.409 0 .877-.176 1.435-.352.683-.215 1.523-.484 2.651-.484 1.06 0 1.838.251 2.453.47.635.229 1.177.426 1.622.426.334 0 .557-.155.658-.388.112-.32.198-.799.261-.938.335-.08.7-.184 1.062-.331.187-.076.358-.17.506-.285a.55.55 0 0 0 .22-.371.387.387 0 0 0-.344-.405c-1.946-.256-2.689-1.528-2.982-2.136a.425.425 0 0 1-.061-.254c.012-.135.085-.267.173-.371.16-.183.39-.278.606-.367.198-.08.394-.16.672-.424a.784.784 0 0 0 .19-.427.555.555 0 0 0-.447-.591c-.477-.125-1.848-.632-2.53-1.113a1.235 1.235 0 0 1-.31-.897c0-.492.024-.983.024-1.456 0-.422-.02-.814-.055-1.215-.034-.455-.166-.892-.411-1.318a3.066 3.066 0 0 0-1.397-1.162l-.068-.027A9.737 9.737 0 0 0 12 2"></path>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        // Try to get from localStorage first for faster loading
        const cachedInfo = localStorage.getItem('contactInfo');
        if (cachedInfo) {
          setContactInfo(JSON.parse(cachedInfo));
          setLoading(false);
        }

        // Fetch from API
        const response = await get('/settings/contact_info');
        const data = response.data;

        // Update state with the fetched data
        const updatedInfo = {
          email: data.settingValue.email || defaultContactInfo.email,
          phone: data.settingValue.phone || defaultContactInfo.phone,
          address: data.settingValue.address || defaultContactInfo.address,
          socialMedia: {
            facebook: data.settingValue.socialMedia?.facebook || defaultContactInfo.socialMedia.facebook,
            instagram: data.settingValue.socialMedia?.instagram || defaultContactInfo.socialMedia.instagram,
            snapchat: data.settingValue.socialMedia?.snapchat || defaultContactInfo.socialMedia.snapchat,
            tiktok: data.settingValue.socialMedia?.tiktok || defaultContactInfo.socialMedia.tiktok
          }
        };
        console.log('New info', updatedInfo);
        
        // console.log('Response', response);
        
        setContactInfo(updatedInfo);
        
        // Cache in localStorage for future use
        localStorage.setItem('contactInfo', JSON.stringify(updatedInfo));
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-[#efefef] text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Section 1: Logo and Contact Info (Left) */}
            <div>
              <Link to="/" className="text-2xl font-bold text-black">
                Livssentials
              </Link>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span className='hover:text-gray-700'>
                    {contactInfo.address}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <a href="mailto:hello@livssentials.co" className="hover:text-gray-700">
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-gray-700">
                    {contactInfo.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 2: Quick Links (Middle) */}
            <div>
              <h3 className="text-lg font-semibold mb-6">
                About Us
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/contact" className="hover:text-gray-700 transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-gray-700 transition">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-gray-700 transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-gray-700 transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Section 3: Features (Right) */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-6">
                Our Promise
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Lock className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-black font-medium">Secure Payment</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      All transactions are processed through secure payment gateways to protect your personal information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Headphones className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-black font-medium">24/7 Support</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Our dedicated support team is available around the clock to assist you with any questions or concerns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Socials Section - Slightly Different Color */}
      <div className="bg-[#dfdfdf] text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; {currentYear} Livssentials. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {/* Social Media Links */}
              {contactInfo.socialMedia.facebook && (
              <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition">
                <FacebookIcon className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              )}

              {contactInfo.socialMedia.instagram && (
              <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition">
                <InstagramIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              )}

              {contactInfo.socialMedia.tiktok && (
              <a href={contactInfo.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition">
                <TikTokIcon className="h-6 w-6" />
                <span className="sr-only">TikTok</span>
              </a>
              )}

              {contactInfo.socialMedia.snapchat && (
              <a href={contactInfo.socialMedia.snapchat} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition">
                <SnapchatIcon className="h-6 w-6" />
                <span className="sr-only">Snapchat</span>
              </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;