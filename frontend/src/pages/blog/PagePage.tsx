import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { SITE_URL } from '@/lib/constants';

interface CmsPage {
  title: string;
  slug: string;
  htmlContent?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  noindex?: boolean;
}
const STATIC_PAGES: Record<string, { title: string; content: string }> = {
  about: {
    title: 'About Us',
    content: `
      <p>
        Welcome to our technology blog, a platform dedicated to sharing knowledge,
        tutorials, insights, and practical guides about software development,
        programming, and modern technology.
      </p>

      <p>
        Our goal is to provide high-quality articles that help developers,
        technology enthusiasts, and beginners understand various topics such as
        web development, backend engineering, databases, cloud computing,
        cybersecurity, artificial intelligence, and emerging technologies.
      </p>

      <p>
        Every article is created with a focus on accuracy, simplicity, and
        practical implementation so readers can apply the knowledge directly
        to their projects and daily work.
      </p>

      <p>
        We believe technology should be accessible to everyone. Through this
        blog, we aim to document our learning journey while helping others
        improve their technical skills.
      </p>

      <p>
        Website Owner:
        <a href="https://aldytoi.my.id" target="_blank">
          Aldi Pranata Portfolio
        </a>
      </p>

      <p>
        Thank you for visiting our website. We hope our content can provide
        useful information and valuable insights for your technology journey.
      </p>
    `,
  },

  contact: {
    title: 'Contact',
    content: `
      <p>
        We appreciate your feedback, questions, suggestions, and collaboration
        opportunities. If you have any inquiries regarding our articles,
        partnerships, or other matters, feel free to contact us.
      </p>

      <p>
        You can reach us through the following email address:
      </p>

      <p>
        Email:
        <a href="mailto:aldyjrz@gmail.com">
          aldyjrz@gmail.com
        </a>
      </p>

      <p>
        We will try to respond to messages as soon as possible. Please note that
        response times may vary depending on the number of requests received.
      </p>
    `,
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <p>
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect information when you visit our website.
      </p>

      <h2>Information We Collect</h2>

      <p>
        We may collect non-personal information such as browser type, device
        information, visited pages, and general usage statistics to improve
        website performance and user experience.
      </p>

      <p>
        If you contact us through email or other communication methods, we may
        receive information that you voluntarily provide.
      </p>

      <h2>Cookies</h2>

      <p>
        Our website may use cookies to improve functionality, analyze traffic,
        and provide a better browsing experience.
      </p>

      <p>
        Third-party services such as advertising providers may also use cookies
        to display relevant advertisements based on user interests.
      </p>

      <h2>Google AdSense</h2>

      <p>
        This website may use Google AdSense to display advertisements.
        Google and its partners may use cookies to serve ads based on your
        previous visits to this website or other websites.
      </p>

      <p>
        Users may manage their advertising preferences through Google's
        advertising settings.
      </p>

      <h2>Data Protection</h2>

      <p>
        We take reasonable steps to protect collected information. However,
        no method of internet transmission or electronic storage is completely
        secure.
      </p>

      <h2>Changes to This Privacy Policy</h2>

      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        published on this page.
      </p>
    `,
  },

  terms: {
    title: 'Terms of Service',
    content: `
      <p>
        By accessing and using this website, you agree to comply with these
        Terms of Service. If you do not agree with any part of these terms,
        please discontinue using this website.
      </p>

      <h2>Use of Content</h2>

      <p>
        All articles, tutorials, and materials published on this website are
        provided for educational and informational purposes.
      </p>

      <p>
        You may share our content by providing proper credit and linking back
        to the original source.
      </p>

      <h2>User Responsibilities</h2>

      <p>
        Users are responsible for ensuring that their activities while accessing
        this website comply with applicable laws and regulations.
      </p>

      <h2>Website Availability</h2>

      <p>
        We do not guarantee that this website will always be available without
        interruptions. Maintenance, updates, or technical issues may temporarily
        affect accessibility.
      </p>

      <h2>Changes to Terms</h2>

      <p>
        We reserve the right to modify these terms at any time. Updated terms
        will become effective when published on this page.
      </p>
    `,
  },

  disclaimer: {
    title: 'Disclaimer',
    content: `
      <p>
        The information provided on this website is for general informational
        and educational purposes only.
      </p>

      <p>
        While we make every effort to ensure that the information published is
        accurate and up to date, we cannot guarantee that all information is
        completely error-free.
      </p>

      <p>
        Technology-related tutorials, programming examples, and configuration
        guides may require adjustments depending on your environment, software
        versions, hardware specifications, and other factors.
      </p>

      <p>
        We are not responsible for any loss, damage, or issues that may occur
        from applying information obtained from this website.
      </p>

      <p>
        External links may be provided for additional references. We do not have
        control over the content, policies, or availability of third-party
        websites.
      </p>

      <p>
        By using this website, you acknowledge and agree that you use the
        provided information at your own discretion and risk.
      </p>
    `,
  },
};
export function PagePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => apiFetch<{ data: CmsPage }>(`/pages/${slug}`),
    retry: false,
  });

  const page = data?.data;
  const fallback = slug ? STATIC_PAGES[slug] : undefined;

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-12">Loading…</div>;
  if (!page && !fallback) return <div className="mx-auto max-w-3xl px-4 py-12">Page not found.</div>;

  const title = page?.title ?? fallback?.title ?? '';
  const html = page?.htmlContent ?? fallback?.content ?? '';

  return (
    <>
      <Seo title={title} canonical={`${SITE_URL}/${slug}`} noindex={page?.noindex} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold">{title}</h1>
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </>
  );
}
