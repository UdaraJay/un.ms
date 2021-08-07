import Link from 'next/link';

const Footer = () => {
  return (
    <div className="pb-16">
      <nav className="flex mb-3">
        <ol className="flex items-center space-x-4 text-sm text-gray-400">
          <li>
            <Link href="/terms-of-service">
              <a>Discord</a>
            </Link>
          </li>
          <span>•</span>
          <li>
            <Link href="/privacy-policy">
              <a>GitHub</a>
            </Link>
          </li>
        </ol>
      </nav>
      <nav className="flex">
        <ol className="flex items-center space-x-4 text-sm text-gray-400">
          <li>
            <Link href="/legal/terms-of-serice">
              <a>Terms of Service</a>
            </Link>
          </li>
          <span>•</span>
          <li>
            <Link href="/legal/privacy-policy">
              <a>Privacy Policy</a>
            </Link>
          </li>
          <span>•</span>
          <li>
            <Link href="/legal/cookie-policy">
              <a>Cookie Policy</a>
            </Link>
          </li>
          <span>•</span>
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
