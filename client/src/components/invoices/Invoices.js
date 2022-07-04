import React, { useState, useContext, useEffect } from 'react';
import InvoiceItem from './InvoiceItem';
import Details from './Details';
import InvoiceContext from '../../context/invoice/invoiceContext';
import DarkContext from '../../context/dark/darkContext';
import { CSSTransition } from 'react-transition-group';

const Invoices = () => {
  // Component level state
  const [run, setRun] = useState(false);

  // Declare and destructure context
  const invoiceContext = useContext(InvoiceContext);
  const darkContext = useContext(DarkContext);
  const { dark } = darkContext;
  const {
    invoices,
    currentUser,
    invoiceDetails,
    filters,
    newInvoiceForm,
    getInvoices,
  } = invoiceContext;

  // Effect to get invoices on intial load
  useEffect(() => {
    getInvoices();
    // eslint-disable-next-line
  }, []);

  // Effect to position screen at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to load invoices before no invoices image flashes
  useEffect(() => {
    setTimeout(() => {
      setRun(true);
    }, 500);
  }, []);

  // Declare invoices that include checked statuses
  let filtered = invoices.filter((invoice) => filters.includes(invoice.status));

  // Returns if no invoice has been clicked
  return !invoiceDetails ? (
    // Fade in/out
    <CSSTransition in={true} timeout={300} classNames='fade'>
      <section
        id='invoices'
        className={newInvoiceForm ? 'new-invoice-modal-container' : null}
        // style={newInvoiceForm ? { marginTop: '120px' } : null}
      >
        {/* Returns if no invoices match filters */}
        {run && filtered.length === 0 ? (
          <div id='empty-container'>
            <img
              src={require('../../images/illustration-empty.svg').default}
              alt='emtpy-illustration'
            />
            <h2 className={dark ? 'dark' : undefined}>There is nothing here</h2>
            <p className={dark ? 'dark' : undefined}>
              Create an invoice by clicking the{' '}
              <span style={{ fontWeight: '700' }}>New Invoice</span> button and
              get started, or change the{' '}
              <span style={{ fontWeight: '700' }}>Filter by Status</span>
            </p>
          </div>
        ) : (
          // Returns if at least 1 filtered invoice
          <div id='invoice-list'>
            {filtered.map((invoice, i) => (
              <InvoiceItem key={i} invoice={invoice} />
            ))}
          </div>
        )}
      </section>
    </CSSTransition>
  ) : (
    // Returns if an invoice is clicked
    <CSSTransition timeout={300} classNames='fade'>
      <Details currentUser={currentUser} />
    </CSSTransition>
  );
};

export default Invoices;
