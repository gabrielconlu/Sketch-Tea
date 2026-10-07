import Link from 'next/link';

const sections = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'data-protection', label: 'Data Protection' },
    { id: 'dmca', label: 'DMCA & Copyright' },
];

export default function LegalPage() {
    return (
        <main className="max-w-[900px] mx-auto w-full flex-1 px-4 pt-[112px] pb-14 sm:px-[30px] sm:pt-[140px] sm:pb-20">
            <header className="mb-10">
                <h1 className="text-5xl lg:text-6xl font-bold mb-3 font-serif text-center">Policies &amp; <span className="text-[var(--accent3)]">Notices</span></h1>
            </header>

            <nav aria-label="Policy sections" className="flex flex-wrap gap-3 border-y border-[var(--glass-border)] py-5 mb-10">
                {sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="text-[0.9rem] font-semibold text-[var(--accent3)] hover:underline">
                        {section.label}
                    </a>
                ))}
            </nav>

            <div className="space-y-12 leading-7">
                <section id="privacy" className="scroll-mt-28">
                    <h2 className="font-serif text-[2rem] font-bold mb-4">Privacy Policy</h2>
                    <p className="mb-4">This policy explains what Sketch Tea collects when you browse the site, create an account, request a service, place an order, upload a file, or contact us. We use that information to operate the site and respond to your requests.</p>
                    <h3 className="font-semibold text-[1.1rem] mb-2">Information you provide</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Account details such as your name, email address, and password. Passwords are converted to bcrypt hashes before they are stored.</li>
                        <li>Service and order details such as contact information, design ideas, reference codes, payment confirmation details, and files you choose to submit.</li>
                        <li>Contact-form details such as your name, email address, and message.</li>
                    </ul>
                    <h3 className="font-semibold text-[1.1rem] mb-2">How information is used</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>To create and manage accounts, authenticate sign-ins, and help protect the site from repeated or abusive requests.</li>
                        <li>To review service requests, verify payments, provide order status information, and respond to messages.</li>
                        <li>To operate, maintain, and improve the site, and to meet legal obligations where applicable.</li>
                    </ul>
                    <h3 className="font-semibold text-[1.1rem] mb-2">Storage, cookies, and service providers</h3>
                    <p className="mb-4">Account and order records are stored in the application database. Contact messages are sent to the email account configured for Sketch Tea through its email provider. Hosting, database, and email providers may process information as needed to provide these services.</p>
                    <p className="mb-4">The site uses a signed HTTP-only session cookie for sign-in. It also uses a separate CSRF security cookie. Browser storage may contain your theme preference, remembered email if you enable that option, basic account display information, and some order, reference-code, or draft data. Browser storage is accessible to scripts running in your browser and is not protected like the HTTP-only session cookie. The site does not store your password in browser storage.</p>
                    <p className="mb-4">Files submitted with an order are saved in a publicly served uploads location. Anyone with a file URL may be able to retrieve that file. Only upload files you have the right to share, and do not upload confidential information or sensitive personal data.</p>
                    <p>We share information only with providers needed to run the site and fulfill your request, or when disclosure is required by law. We do not publish account passwords. Records may be kept for as long as needed to operate the service, handle requests, meet legal obligations, or resolve disputes; a fixed deletion schedule is not currently stated. You may request access, correction, or deletion through the <Link href="/contact" className="text-[var(--accent3)] font-semibold hover:underline">contact form</Link>. We may need to verify your identity and may retain information where required or permitted by law.</p>
                </section>

                <section id="terms" className="scroll-mt-28 border-t border-[var(--glass-border)] pt-10">
                    <h2 className="font-serif text-[2rem] font-bold mb-4">Terms &amp; Conditions</h2>
                    <p className="mb-4">By using Sketch Tea or creating an account, you agree to these terms. Provide accurate information, keep your sign-in details private, and use the site lawfully. You are responsible for activity carried out through your account. Contact us if you believe someone has accessed it without permission.</p>
                    <h3 className="font-semibold text-[1.1rem] mb-2">Accounts and acceptable use</h3>
                    <p className="mb-4">Do not attempt to access another person&apos;s account, interfere with site operation or security, evade usage limits, submit unlawful material, or use the site to infringe another person&apos;s rights. We may restrict access when needed to protect users, the service, or our legal rights.</p>
                    <h3 className="font-semibold text-[1.1rem] mb-2">Your submissions and requests</h3>
                    <p className="mb-4">You keep the rights you hold in material you submit. You give Sketch Tea permission to review and use that material only as reasonably needed to assess, prepare, and fulfill your request. You are responsible for having permission to submit the text, images, and other files you provide.</p>
                    <p className="mb-4">Submitting an order or service request is not confirmation that it has been accepted, paid, or scheduled. Requests may require review and payment verification. Keep your reference code so you can check the related order status, and contact us promptly about a mistake or change.</p>
                    <h3 className="font-semibold text-[1.1rem] mb-2">Site materials and availability</h3>
                    <p>Site text, illustrations, characters, branding, and other original materials belong to Sketch Tea or their respective rights holders. Do not copy, distribute, or reuse them without permission. The site is provided as available; to the extent permitted by law, uninterrupted or error-free access is not guaranteed. These terms do not limit rights that cannot legally be excluded.</p>
                </section>

                <section id="data-protection" className="scroll-mt-28 border-t border-[var(--glass-border)] pt-10">
                    <h2 className="font-serif text-[2rem] font-bold mb-4">Data Protection</h2>
                    <p className="mb-4">We use technical measures intended to protect accounts and submitted information. Account passwords are stored as bcrypt hashes. Sign-in uses a signed HTTP-only session cookie that expires after 12 hours; a separate CSRF token is checked on supported account requests. Login, registration, and password-recovery requests are rate-limited, and the server checks submitted account values.</p>
                    <p className="mb-4">The site sends browser security headers intended to reduce risks such as framing and content-type sniffing. In production, the session cookie is marked Secure, but protection of information in transit also depends on the hosting environment serving the site over HTTPS. These measures reduce risk but cannot guarantee absolute security.</p>
                    <p className="mb-4">Use a unique password, sign out on shared devices, and avoid sending sensitive information through order or contact forms. Some basic account and order details remain in browser storage for site features; clearing that storage may remove remembered email, preferences, drafts, or reference details but does not delete records already submitted to the application. The password-recovery form currently does not send a reset link or change an account password.</p>
                    <p>For privacy questions or requests about your information, contact Sketch Tea through the <Link href="/contact" className="text-[var(--accent3)] font-semibold hover:underline">contact form</Link>. We may need to verify your identity before responding.</p>
                </section>

                <section id="dmca" className="scroll-mt-28 border-t border-[var(--glass-border)] pt-10">
                    <h2 className="font-serif text-[2rem] font-bold mb-4">DMCA &amp; Copyright Notices</h2>
                    <p className="mb-4">If you believe material on Sketch Tea infringes a copyright you own or are authorized to represent, contact us through the <Link href="/contact" className="text-[var(--accent3)] font-semibold hover:underline">contact form</Link> with the subject “Copyright notice.” Include your name and contact details, identify the copyrighted work, provide the exact URL of the material, explain why you believe it is infringing, and state that you are the rights holder or authorized representative.</p>
                    <p className="mb-4">We may review a notice, ask for further information, and take appropriate action, including restricting access to identified material. Submitting a knowingly false or misleading claim may have legal consequences.</p>
                    <p>If you submitted material that was restricted after a copyright complaint and believe this was an error, contact us with the affected URL, your contact details, and an explanation of your rights or authorization. Formal counter-notices may have specific legal requirements; consider obtaining legal advice before submitting one.</p>
                </section>
            </div>
        </main>
    );
}
