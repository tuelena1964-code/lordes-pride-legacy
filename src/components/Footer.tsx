const Footer = () => {
  return (
    <footer className="py-16 px-6 text-center border-t border-border">
      <div className="mb-4">
        <p className="text-lg tracking-wider text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Лордес Прайд
        </p>
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground/50 mt-1">
          Lordes Pride
        </p>
      </div>
      <p className="text-sm text-muted-foreground/40 font-light">
        © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
