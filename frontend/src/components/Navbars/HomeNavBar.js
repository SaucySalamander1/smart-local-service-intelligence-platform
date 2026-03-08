import { Link } from "react-router-dom";

const HomeNavbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        Local Service Center
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/services" style={styles.link}>Services</Link>
        <Link to="/become-worker" style={styles.link}>Become Worker</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Register</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "#1f2937",
    color: "white"
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  links: {
    display: "flex",
    gap: "20px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500"
  }
};

export default HomeNavbar;