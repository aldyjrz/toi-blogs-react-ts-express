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
    title: 'About Me',
    content: `
     <p> Halo! Saya Aldi Pranata, selamat datang di blog pribadi saya. </p> <p> Blog ini adalah tempat saya berbagi aktivitas sehari-hari, pengalaman, proses belajar, serta berbagai hal menarik seputar dunia pemrograman dan teknologi modern. </p> <p> Sebagian besar artikel yang saya tulis berasal dari pengalaman nyata ketika mengerjakan berbagai proyek, menghadapi tantangan, dan menemukan solusi dalam pengembangan web, backend engineering, database, cloud computing, keamanan siber, kecerdasan buatan (AI), serta topik lain di dunia software development. </p> <p> Saya senang menulis materi teknis dengan bahasa yang sederhana dan mudah dipahami. Baik Anda seorang pemula maupun developer yang sudah berpengalaman, saya berharap artikel di blog ini dapat memberikan wawasan baru yang bisa langsung diterapkan dalam proyek atau pekerjaan Anda. </p> <p> Blog ini juga menjadi tempat saya mendokumentasikan perjalanan belajar yang terus berkembang. Dunia teknologi selalu berubah dengan cepat, dan saya percaya bahwa berbagi pengetahuan adalah salah satu cara terbaik untuk terus belajar dan berkembang bersama. </p> <p> Jika Anda ingin mengenal saya lebih jauh atau melihat portofolio proyek yang pernah saya kerjakan, silakan kunjungi <a href="https://aldytoi.my.id" target="_blank" rel="noopener noreferrer"> aldytoi.my.id </a>. </p> <p> Terima kasih telah berkunjung. Semoga artikel yang saya bagikan dapat memberikan manfaat, menambah wawasan, dan membantu perjalanan Anda dalam dunia teknologi. </p> <section class="contact-links"> <h2>Terhubung dengan Saya</h2> <ul> <li> <strong>Portofolio:</strong> <a href="https://aldytoi.my.id" target="_blank" rel="noopener noreferrer"> aldytoi.my.id </a> </li> <li> <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/aldytoi" target="_blank" rel="noopener noreferrer"> linkedin.com/in/aldytoi </a> </li> <li> <strong>GitHub:</strong> <a href="https://github.com/AldyJrz" target="_blank" rel="noopener noreferrer"> github.com/AldyJrz </a> </li> <li> <strong>Email:</strong> <a href="mailto:aldyjrz@gmail.com"> aldyjrz@gmail.com </a> </li> </ul> </section>`,
  },

  contact: {
    title: 'Contact',
    content: `
     
<h2>Hubungi Saya</h2>

<p>
  Terima kasih telah mengunjungi blog ini. Saya sangat menghargai setiap
  pertanyaan, masukan, maupun saran yang Anda berikan.
</p>

<p>
  Jika Anda ingin berdiskusi seputar pemrograman, teknologi, memberikan
  feedback terhadap artikel, melaporkan kesalahan, atau mengajak saya
  berkolaborasi dalam sebuah proyek, jangan ragu untuk menghubungi saya.
</p>

<p>
  Anda dapat menghubungi saya melalui email berikut:
</p>

<p>
  <strong>Email:</strong>
  <a href="mailto:aldyjrz@gmail.com">aldyjrz@gmail.com</a>
</p>

<p>
  Saya akan berusaha membalas setiap pesan secepat mungkin. Mohon pengertiannya
  apabila terkadang membutuhkan waktu lebih lama, terutama saat sedang sibuk
  dengan pekerjaan atau proyek yang sedang dikerjakan.
</p>

<p>
  Terima kasih atas dukungan dan kunjungan Anda. Saya berharap blog ini dapat
  terus memberikan manfaat dan menjadi tempat berbagi ilmu bagi para developer
  dan pecinta teknologi.
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
