import React, { useContext } from 'react';
import DarkContext from '../../context/dark/darkContext';

const Navbar = () => {
  // Context
  const darkContext = useContext(DarkContext);
  const { dark, toggleDarkMode } = darkContext;

  return (
    <nav id='navbar' className={dark ? 'dark' : undefined}>
      <div id='home-icon'>
        <div id='home-icon-bot'></div>
        <div id='home-icon-circle'></div>
        <div id='home-icon-triangle'></div>
      </div>
      <div id='mode-toggle' onClick={toggleDarkMode}>
        {/* Change toggle image if in dark mode */}
        {dark ? (
          <img
            src={require('../../images/icon-sun.svg').default}
            alt='icon-sun'
          />
        ) : (
          <img
            src={require('../../images/icon-moon.svg').default}
            alt='icon-moon'
          />
        )}
      </div>
      <div id='horizontal-line'></div>
      <a
        style={{ display: 'table-cell' }}
        href='https://www.example.com'
        target='_blank'
        rel='noreferrer'
      >
        <div id='prof-pic'></div>
      </a>
    </nav>
  );
};

export default Navbar;
