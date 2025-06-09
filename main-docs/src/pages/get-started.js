import React from 'react';
import Layout from '@theme/Layout';
import styles from './get-started.module.css';

export default function GetStarted() {
  return (
    <Layout
      title="Get Started with AIMUG"
      description="Your guide to joining and participating in the AI Middleware Users Group community"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Get Started with AIMUG</h1>
            <p className="hero__subtitle">
              Welcome to the AI Middleware Users Group! We're excited to have you join our vibrant community of AI enthusiasts, developers, and researchers in Austin and beyond.
            </p>

            <h2>Choose Your Path</h2>
            <div className={styles.pathGrid}>
              <div className={styles.pathCard}>
                <h3>🎓 Learn Path</h3>
                <p><strong>Perfect for beginners and those wanting to expand their AI knowledge</strong></p>
                <ul>
                  <li><strong>Start Here</strong>: Browse our <a href="/docs">documentation</a> and past event recordings</li>
                  <li><strong>Next</strong>: Attend a <a href="/events">Showcase event</a> to see real-world AI applications</li>
                  <li><strong>Then</strong>: Join our <a href="/events">Office Hours</a> for Q&A and deeper discussions</li>
                  <li><strong>Finally</strong>: Explore our <a href="/docs/getting-started">tutorials and guides</a></li>
                </ul>
                <div className={styles.pathActions}>
                  <a href="/docs" className="button button--primary">
                    <i className="fas fa-book"></i>
                    Browse Documentation
                  </a>
                  <a href="/events" className="button button--secondary">
                    <i className="fas fa-calendar"></i>
                    View Upcoming Events
                  </a>
                </div>
              </div>

              <div className={styles.pathCard}>
                <h3>🤝 Connect Path</h3>
                <p><strong>Great for networking and community engagement</strong></p>
                <ul>
                  <li><strong>Start Here</strong>: Join our <a href="https://discord.gg/your-discord-link">Discord community</a></li>
                  <li><strong>Next</strong>: Attend a <a href="/events">Hacky Hour</a> for casual networking</li>
                  <li><strong>Then</strong>: Participate in our monthly <a href="/events">Community Calls</a></li>
                  <li><strong>Finally</strong>: Follow us on social media for daily updates</li>
                </ul>
                <div className={styles.pathActions}>
                  <a href="https://discord.gg/your-discord-link" className="button button--primary">
                    <i className="fab fa-discord"></i>
                    Join Discord
                  </a>
                  <a href="/community" className="button button--secondary">
                    <i className="fas fa-users"></i>
                    Community Guidelines
                  </a>
                </div>
              </div>

              <div className={styles.pathCard}>
                <h3>🚀 Contribute Path</h3>
                <p><strong>For those ready to give back and share their expertise</strong></p>
                <ul>
                  <li><strong>Start Here</strong>: Review our <a href="/volunteer">volunteer opportunities</a></li>
                  <li><strong>Next</strong>: Submit a talk proposal for our Showcase events</li>
                  <li><strong>Then</strong>: Consider <a href="/support">sponsoring</a> our community initiatives</li>
                  <li><strong>Finally</strong>: Mentor newcomers and help grow our community</li>
                </ul>
                <div className={styles.pathActions}>
                  <a href="/volunteer" className="button button--primary">
                    <i className="fas fa-hand-heart"></i>
                    Volunteer
                  </a>
                  <a href="/support" className="button button--secondary">
                    <i className="fas fa-heart"></i>
                    Support AIMUG
                  </a>
                </div>
              </div>
            </div>

            <h2>Quick Start Checklist</h2>
            <div className={styles.checklist}>
              <ul>
                <li>☐ <strong>Join our Discord</strong> - Get real-time updates and connect with the community</li>
                <li>☐ <strong>Subscribe to our newsletter</strong> - Stay informed about upcoming events and news</li>
                <li>☐ <strong>Follow us on social media</strong> - LinkedIn, Twitter, and YouTube for daily content</li>
                <li>☐ <strong>Attend your first event</strong> - Check our <a href="/events">events page</a> for upcoming opportunities</li>
                <li>☐ <strong>Introduce yourself</strong> - Share your background and interests in our Discord #introductions channel</li>
                <li>☐ <strong>Explore our resources</strong> - Browse past presentations, code samples, and tutorials</li>
              </ul>
            </div>

            <h2>Event Types Explained</h2>
            <div className={styles.eventTypes}>
              <div className={styles.eventType}>
                <h3>🌟 Showcase Events</h3>
                <p><strong>Monthly presentations featuring real-world AI implementations</strong></p>
                <ul>
                  <li>Duration: 2-3 hours</li>
                  <li>Format: Hybrid (in-person + virtual)</li>
                  <li>Best for: Learning about practical AI applications</li>
                  <li>When: First Wednesday of each month</li>
                </ul>
              </div>

              <div className={styles.eventType}>
                <h3>💬 Office Hours</h3>
                <p><strong>Informal Q&A sessions with AI experts</strong></p>
                <ul>
                  <li>Duration: 1 hour</li>
                  <li>Format: Virtual</li>
                  <li>Best for: Getting help with specific challenges</li>
                  <li>When: Every other Wednesday</li>
                </ul>
              </div>

              <div className={styles.eventType}>
                <h3>🍻 Hacky Hours</h3>
                <p><strong>Casual networking and collaboration sessions</strong></p>
                <ul>
                  <li>Duration: 2-3 hours</li>
                  <li>Format: In-person</li>
                  <li>Best for: Meeting fellow AI enthusiasts</li>
                  <li>When: Monthly, rotating locations</li>
                </ul>
              </div>

              <div className={styles.eventType}>
                <h3>🚌 Field Trips</h3>
                <p><strong>Visits to local AI companies and research facilities</strong></p>
                <ul>
                  <li>Duration: Half day</li>
                  <li>Format: In-person</li>
                  <li>Best for: Seeing AI in action at local organizations</li>
                  <li>When: Quarterly</li>
                </ul>
              </div>
            </div>

            <h2>Community Guidelines</h2>
            <div className={styles.guidelines}>
              <div className={styles.guideline}>
                <h3>Be Respectful</h3>
                <ul>
                  <li>Treat all members with kindness and respect</li>
                  <li>Embrace diverse perspectives and backgrounds</li>
                  <li>Keep discussions constructive and professional</li>
                </ul>
              </div>

              <div className={styles.guideline}>
                <h3>Share Knowledge</h3>
                <ul>
                  <li>Help others learn and grow</li>
                  <li>Share resources, tools, and insights</li>
                  <li>Ask questions - no question is too basic</li>
                </ul>
              </div>

              <div className={styles.guideline}>
                <h3>Stay Engaged</h3>
                <ul>
                  <li>Participate actively in discussions</li>
                  <li>Attend events when possible</li>
                  <li>Contribute to our collective knowledge</li>
                </ul>
              </div>

              <div className={styles.guideline}>
                <h3>Follow the Code of Conduct</h3>
                <ul>
                  <li>Review our full <a href="/community#code-of-conduct">Code of Conduct</a></li>
                  <li>Report any issues to our moderators</li>
                  <li>Help maintain a welcoming environment</li>
                </ul>
              </div>
            </div>

            <h2>Frequently Asked Questions</h2>
            <div className={styles.faq}>
              <div className={styles.faqItem}>
                <h3>Do I need to be an AI expert to join?</h3>
                <p>Not at all! We welcome members at all skill levels, from complete beginners to seasoned professionals. Our community is built on learning together.</p>
              </div>

              <div className={styles.faqItem}>
                <h3>Are events free to attend?</h3>
                <p>Yes, all our regular events are free. We occasionally have special workshops or field trips that may have a small fee to cover costs.</p>
              </div>

              <div className={styles.faqItem}>
                <h3>Can I present at a Showcase event?</h3>
                <p>Absolutely! We're always looking for speakers. Submit your proposal through our <a href="mailto:speakers@aimug.org">speaker form</a> or reach out on Discord.</p>
              </div>

              <div className={styles.faqItem}>
                <h3>How can I stay updated on events?</h3>
                <ul>
                  <li>Join our Discord for real-time updates</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Follow our social media accounts</li>
                  <li>Check our <a href="/events">events page</a> regularly</li>
                </ul>
              </div>

              <div className={styles.faqItem}>
                <h3>Is AIMUG only for people in Austin?</h3>
                <p>While we're based in Austin, we welcome virtual participants from anywhere. Many of our events are hybrid or fully virtual.</p>
              </div>
            </div>

            <h2>Need Help?</h2>
            <div className={styles.helpGrid}>
              <div className={styles.helpCard}>
                <h3>💬 Discord Support</h3>
                <p>Get help from our community moderators and fellow members in real-time.</p>
                <a href="https://discord.gg/your-discord-link" className="button button--outline">Join Discord</a>
              </div>

              <div className={styles.helpCard}>
                <h3>📧 Email Support</h3>
                <p>Have a specific question? Reach out to our team directly.</p>
                <a href="mailto:hello@aimug.org" className="button button--outline">Email Us</a>
              </div>

              <div className={styles.helpCard}>
                <h3>📚 Documentation</h3>
                <p>Browse our comprehensive guides and tutorials.</p>
                <a href="/docs" className="button button--outline">View Docs</a>
              </div>

              <div className={styles.helpCard}>
                <h3>🎥 Video Tutorials</h3>
                <p>Watch our getting started videos and past event recordings.</p>
                <a href="https://youtube.com/@aimug" className="button button--outline">YouTube Channel</a>
              </div>
            </div>

            <h2>What's Next?</h2>
            <p>Ready to dive in? Here are some immediate next steps:</p>
            <ol>
              <li><strong>Join our Discord</strong> and introduce yourself</li>
              <li><strong>Check our events calendar</strong> and RSVP for an upcoming event</li>
              <li><strong>Subscribe to our newsletter</strong> for weekly updates</li>
              <li><strong>Follow us on social media</strong> for daily AI news and insights</li>
              <li><strong>Explore our documentation</strong> to learn about AI tools and techniques</li>
            </ol>

            <div className={styles.welcomeMessage}>
              <p><strong>Welcome to the AIMUG community! We're excited to learn and grow together.</strong></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
