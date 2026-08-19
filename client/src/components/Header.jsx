import { useState } from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">

      {/* LOGO */}
      <NavLink
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        <img
          src="/logo.png"
          alt="VerifyKaro"
          className="logo-mark"
        />
      </NavLink>


      {/* DESKTOP NAV */}
      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
          onClick={closeMenu}
        >
          Verify
        </NavLink>


        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
          onClick={closeMenu}
        >
          About Us
        </NavLink>


        <NavLink
          to="/how-it-works"
          className={({ isActive }) =>
            isActive
              ? "nav-link active"
              : "nav-link"
          }
          onClick={closeMenu}
        >
          How It Works
        </NavLink>

      </nav>


      {/* HAMBURGER */}
      <button
        className={`menu-toggle ${
          menuOpen ? "open" : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={
          menuOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </header>
  );
}

export default Header;