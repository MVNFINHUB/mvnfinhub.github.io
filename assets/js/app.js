/**
 * MVN FINHUB - PRODUCTION JAVASCRIPT
 * -------------------------------------------------------
 * Combined Logic: Mobile Menu + Real Database Connection.
 * NO DEMO MODE.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION (ENTER YOUR KEYS CAREFULLY) ---
    // Do not leave spaces inside the quotes.
    const SUPABASE_URL = 'https://fviufivewglglnxhlmmf.supabase.co'; 
    const SUPABASE_KEY = 'sb_publishable_HYE7g0GyJbUfmldKTTAbeA_OUdc0Rah';
    // -------------------------------------------------------

    // --- 2. MOBILE MENU LOGIC ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            menuToggle.textContent = !isExpanded ? '✕' : '☰';
        });
    }

    // --- 3. DYNAMIC FOOTER YEAR ---
    const copyrightSpan = document.querySelector('.copyright-year');
    if (copyrightSpan) copyrightSpan.textContent = new Date().getFullYear();

    // --- 4. FORM SUBMISSION LOGIC (REAL DATABASE) ---
    const enquiryForm = document.getElementById('enquiryForm');
    const successMessage = document.getElementById('successMessage');
    const refIdDisplay = document.getElementById('refIdDisplay');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Stop page reload

            // A. Basic Check
            if (!document.getElementById('consent').checked) {
                alert("You must agree to the Privacy Policy.");
                return;
            }

            // B. Lock Button (Prevent double clicks)
            const submitBtn = enquiryForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // C. Generate a Reference ID (For tracking)
            const refID = `MVN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

            // D. Prepare Data Payload
            const formData = {
                full_name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service_type: document.getElementById('service').value,
                message: document.getElementById('message').value,
                reference_id: refID,
                status: 'New'
            };

            try {
                // E. Send to Supabase
                const response = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                // F. Success: Hide Form, Show Message
                enquiryForm.style.display = 'none';
                if (refIdDisplay) refIdDisplay.textContent = refID;
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }

            } catch (error) {
                console.error('Submission Error:', error);
                alert("Connection Error: Please check your internet or try again later.");
                // Reset Button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
