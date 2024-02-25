import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './images/tiffsLogo.png';
import './NavBar.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { useAuth0 } from '@auth0/auth0-react';

//navbar header that appears at the top of page
//displays logo, google translate services, and a page directory
function NavBar() {
  const [role, setRole] = useState(0);

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current && (!window.google || !window.google.translate)) {
      loaded.current = true;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,ja,ko,zh-CN',
          autoDisplay: false
        }, 'google_translate_element');
      };
    }
  }, []);

  if (user) {
    axios.get('/roles?email=' + user.email)
      .then((response) => {
        setRole(response.data.role)
      })
      .catch((error) => {
        console.log('error in role call');
      });
  }

  //function to process login button requests
  //if logged in then allow user to log out, if not then open up login screen
  const LoggingButton = () => {
    if (!isAuthenticated) {
      return (
        <Nav.Link style={{ color: '#1d1d1e' }} href="/" onClick={() => loginWithRedirect()}>Login</Nav.Link>
      );
    }
    else {
      return (
        <Nav.Link style={{ color: '#1d1d1e' }} href="/" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</Nav.Link>
      );
    }
  }

  //check user level to decide which extra buttons (if any) should appear on the nav bar
  function EmployeeLink() {
    if (role === -1) {
      return;
    }
    let elements = [];
    if (role & 1) {
      elements.push(<Nav.Link style={{ color: '#1d1d1e' }} href="/cashier">Cashier</Nav.Link>);
    }
    if (role & 2) {
      elements.push(<Nav.Link style={{ color: '#1d1d1e' }} href="/manager">Manager</Nav.Link>);
    }
    if (role & 4) {
      elements.push(<Nav.Link style={{ color: '#1d1d1e' }} href="/admin">Admin</Nav.Link>);
    }
    return <>{elements}</>;
  }

  //display a tag above the log in button saying the user level for cashiers and manager and the first name for normal users
  function UserLevelLabel() {
    if (role === -1) {
      return;
    }
    if (role & 4) {
      return (
        <p class="nav-link" style={{ color: '#8806CE', margin: 0 }}>
          ADMIN
        </p>
      );
    } else if (role & 2) {
      return (
        <p class="nav-link" style={{ color: '#007958', margin: 0 }}>
          MANAGER
        </p>
      );
    } else if (role & 1) {
      return (
        <p class="nav-link" style={{ color: '#CD212A', margin: 0 }}>
          CASHIER
        </p>
      );
    } else if (isAuthenticated) {
      return (
        <a
          class="nav-link"
          href="/profile"
          style={{ color: '#000892', margin: 0 }}
        >
          {user.given_name}'s Profile
        </a>
      );
    }
  }

  return (
    <Navbar expand="lg" className="navcolor" sticky="top">
      <Navbar.Brand href="/">
            <img width="120" height="50" src={logo} alt="Tiff's Treats Logo. Displays the text: Tiff's Treats Cookie Delivery"/>
        </Navbar.Brand>
        <div id="google_translate_element"></div>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className='ml-auto'>
            <Nav.Link style = {{color: '#1d1d1e'}} href="/">Home</Nav.Link>
            <Nav.Link style = {{color: '#1d1d1e'}} href="/menu">Menu</Nav.Link>
            <Nav.Link style = {{color: '#1d1d1e'}} href="/order">Order</Nav.Link>
            <Nav.Link style={{ color: '#1d1d1e'}} href="/aboutus">About Us</Nav.Link>
            {EmployeeLink()}
            {LoggingButton()}
            {UserLevelLabel()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
