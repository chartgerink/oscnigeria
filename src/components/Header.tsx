import Link from 'next/link'

const Header = () => {
  return (
    <nav className="layout flex items-center justify-between py-4">
      <ul className="flex items-center justify-between space-x-3 text-xs md:space-x-4 md:text-base">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/#posts" className="hover:underline">
            Posts
          </Link>
        </li>
        <li>
          <Link href="/#resources" className="hover:underline">
            Resources
          </Link>
        </li>
        <li>
          <Link href="/#members" className="hover:underline">
            Members
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header
