function Footer() {

  return (
    <footer className="footer row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://github.com/cf-cartesi/Escape-From-Tikal"
        target="_blank"
        rel="noopener noreferrer"
      >
        github
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://cartesi.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        Cartesi.io
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://www.eigenlayer.xyz/"
        target="_blank"
        rel="noopener noreferrer"
      >
        EngenLayer
      </a>
    </footer>
  );
}

export default Footer
