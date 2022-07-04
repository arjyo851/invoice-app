import React, { useState } from 'react';
import Navbar from './components/layouts/Navbar';
import Header from './components/layouts/Header';
import Invoices from './components/invoices/Invoices';
import InvoiceState from './context/invoice/InvoiceState';
import DarkState from './context/dark/DarkState';
import { CSSTransition } from 'react-transition-group';
import './App.scss';

const App = () => {
  const [appearContent] = useState(true);
  return (
    // Fade in on initial load
    <CSSTransition
      in={appearContent}
      appear={true}
      timeout={300}
      classNames='fade'
    >
      <main id='main-app'>
        <InvoiceState>
          <DarkState>
            <Navbar />
            <Header />
            <Invoices />
          </DarkState>
        </InvoiceState>
      </main>
    </CSSTransition>
  );
};

export default App;
