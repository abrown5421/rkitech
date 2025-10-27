import React from 'react';
import Pod from '../../components/pod/Pod';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className='flex flex-col p-6'>
            <div className='text-3xl primary-font'>Privacy Policy</div>
            <div className='text-sm mb-6'>Effective Date: 10/27/2025</div>
            <div className='mb-4'>We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you interact with our services.</div>

            <div className='primary-font mt-4 mb-2'>1. Information We Collect</div>
            <ul className='list-disc mb-2 ml-10'>
                <li>Personal Information: Name, email, phone number, or other identifiers you provide.</li>
                <li>Authentication Information: Login credentials and session tokens.</li>
                <li>Cookies and Tracking Technologies: Cookies, web beacons, and pixels to track interactions, analytics, and personalize content.</li>
                <li>Device and Usage Information: IP address, browser type, OS, pages visited, and actions performed.</li>
            </ul>
            
            <div className='primary-font mt-4 mb-2'>2. How We Use Your Information</div>
            <ul className='list-disc ml-10'>
                <li>Providing, maintaining, and improving our services.</li>
                <li>Managing your account and authentication.</li>
                <li>Personalizing user experiences.</li>
                <li>Communicating updates, security alerts, or promotional messages.</li>
                <li>Ensuring compliance with legal obligations and enforcing our terms.</li>
            </ul>
            
            <div className='primary-font mt-4 mb-2'>3. Cookies and Tracking</div>
            <ul className='list-disc ml-10'>
                <li>Essential Cookies: Required for authentication, security, and basic functionality.</li>
                <li>Performance & Analytics Cookies: Help us understand how users interact with our services.</li>
                <li>Functional Cookies: Remember user preferences and settings.</li>
                <li>Advertising & Targeting Cookies: May serve personalized content and ads.</li>
            </ul>
            
            <div className='primary-font mt-4 mb-2'>4. Data Sharing and Disclosure</div>
            <ul className='list-disc ml-10'>
                <li>With service providers performing services on our behalf (hosting, analytics, marketing).</li>
                <li>To comply with legal obligations, court orders, or regulatory requests.</li>
                <li>To protect rights, property, safety, or security of users or others.</li>
                <li>In connection with mergers, acquisitions, or corporate transactions.</li>
            </ul>
            
            <div className='primary-font mt-4 mb-2'>5. Data Security</div>
            <div className='mb-4'>We implement reasonable safeguards to protect your information. However, no method of transmission over the Internet or electronic storage is completely secure.</div>
            
            <div className='primary-font mt-4 mb-2'>6. Your Choices</div>
            <ul className='list-disc ml-10'>
                <li>Account Information: Access, update, or delete your account info through settings.</li>
                <li>Cookies: Manage through your browser or device settings.</li>
                <li>Communications: Opt out of promotional emails via unsubscribe instructions.</li>
            </ul>

            <div className='primary-font mt-4 mb-2'>7. Children’s Privacy</div>
            <div className='mb-4'>Our services are not directed to individuals under 13 (or applicable age). We do not knowingly collect information from children.</div>
            
            <div className='primary-font mt-4 mb-2'>8. Changes to This Privacy Policy</div>
            <div className='mb-4'>We may update this Privacy Policy periodically. Updated versions will be posted on our website with the 'Effective Date' updated.</div>
            
            <div className='primary-font mt-4 mb-2'>9. Contact Us</div>
            <div className='mb-4'>If you have questions about this Privacy Policy or how we handle your data, please contact us.</div>
                        
        </div>
    );
};

export default PrivacyPolicy;
