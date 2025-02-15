import Link from 'next/link'

import WalletButton from "./WalletButton"

function Navbar() {

  return (
    <header className="header flex justify-between ">
      <Link href={"/"} className={`pl-2 pr-2 min-w-24 content-center bg-gray-200 hover:bg-gray-100`}>
          <div className='h-16 content-center'>Escape from Tikal</div>
      </Link>
      <div className="content-center mr-2">
        <WalletButton></WalletButton>
      </div>
    </header>
  );
}

export default Navbar
