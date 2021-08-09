import Link from 'next/link';

const Footer = () => {
  return (
    <div className="pb-16">
      <nav className="flex">
        <ol className="space-y-1.5 text-sm text-gray-400">
          <li>
            <Link href="/terms-of-service">
              <a>Discord</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy">
              <a>GitHub</a>
            </Link>
          </li>
          <br />
          <li>
            <Link href="/legal/terms-of-serice">
              <a>Terms of Service</a>
            </Link>
          </li>
          <li>
            <Link href="/legal/privacy-policy">
              <a>Privacy Policy</a>
            </Link>
          </li>
          <li>
            <Link href="/legal/cookie-policy">
              <a>Cookie Policy</a>
            </Link>
          </li>
          <li>
            <Link href="/legal/acceptable-use-policy">
              <a>Acceptable Use Policy</a>
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Footer;
