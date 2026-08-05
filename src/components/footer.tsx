function Footer() {
  return (
    <footer className="bg-rosa-escuro text-white mt-16">
      <div className="max-w-4xl mx-auto px-5 py-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Ipê Rosa - RP. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;