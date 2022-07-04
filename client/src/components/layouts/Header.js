import React, { useState, useEffect, Fragment, useContext } from 'react';
import InvoiceModal from '../modals/InvoiceModal';
import InvoiceContext from '../../context/invoice/invoiceContext';
import DarkContext from '../../context/dark/darkContext';

const Header = () => {
  // Component Level State
  const [run, setRun] = useState(false);

  // Declare and destructure context
  const invoiceContext = useContext(InvoiceContext);
  const darkContext = useContext(DarkContext);
  const { dark } = darkContext;
  const {
    invoices,
    newInvoiceForm,
    newInvoiceClick,
    invoiceDetails,
    filterCheck,
    filters,
  } = invoiceContext;

  // Allows items to load before no items image flashes
  useEffect(() => {
    setTimeout(() => {
      setRun(true);
    }, 500);
  });

  // Filter by status
  const onCheck = (e) => {
    filterCheck(e.target.value);
  };

  // Returns items that are checked
  const filtered = invoices.filter((invoice) =>
    filters.includes(invoice.status)
  );

  // Unique title message based on number of invoices and filters selected
  let numOfInvoices = filtered.length;
  let filterTypes;
  let numOfFilters = filters.length;
  switch (numOfFilters) {
    case 1:
      filterTypes = filters[0] + ' invoices';
      break;
    case 2:
      filterTypes = filters[0] + ' & ' + filters[1] + ' invoices';
      break;
    case 3:
      filterTypes = 'total invoices';
      break;
    default:
      filterTypes = 'filters selected';
      numOfInvoices = 'no';
  }

  return (
    // Return if no specific invoice has been clicked
    !invoiceDetails && (
      <Fragment>
        {/* Fix header if invoice modal is clicked */}
        <header
          id='header'
          className={newInvoiceForm ? 'modal-container' : null}
        >
          <div id='header-left'>
            <h1 id='header-title' className={dark ? 'dark' : undefined}>
              Invoices
            </h1>
            {/* Title shown if on mobile device */}
            <h1 id='mobile-title' className={dark ? 'dark' : undefined}>
              Invoices
            </h1>
            {/* Returns if there are invoices */}
            {run && invoices ? (
              <Fragment>
                <p
                  id='header-numInvoices'
                  className={dark ? 'dark' : undefined}
                >
                  There are {numOfInvoices} {filterTypes}
                </p>
                <p
                  id='mobile-numInvoices'
                  className={dark ? 'dark' : undefined}
                >
                  {numOfInvoices} {filterTypes}
                </p>
              </Fragment>
            ) : run ? (
              // Returns if no invoices
              <Fragment>
                <p id='header-noInvoices'>There are 0 total invoices</p>
                <p id='mobile-noInvoices'>0 total invoices</p>
              </Fragment>
            ) : null}
          </div>
          <div id='header-right'>
            <div id='filter-dropdown'>
              <div id='header-arrow'>
                <p id='filter-title' className={dark ? 'dark' : undefined}>
                  Filter by Status
                </p>
                {/* Returns on mobile device */}
                <p id='mobile-filter' className={dark ? 'dark' : undefined}>
                  Filter
                </p>
                <img
                  src={require('../../images/icon-arrow-down.svg').default}
                  alt='icon-arrow-down'
                />
              </div>
              {/* Filter checkbox dropdown */}
              <div id='filter-choices' className={dark ? 'dark' : undefined}>
                <label className={dark ? 'dark container' : 'container'}>
                  Draft
                  <input
                    onClick={onCheck}
                    type='checkbox'
                    defaultChecked='false'
                    value='draft'
                  />
                  <span
                    className={dark ? 'checkmark dark' : 'checkmark'}
                  ></span>
                </label>
                <label className={dark ? 'dark container' : 'container'}>
                  Pending
                  <input
                    type='checkbox'
                    defaultChecked='false'
                    onClick={onCheck}
                    value='pending'
                  />
                  <span
                    className={dark ? 'checkmark dark' : 'checkmark'}
                  ></span>
                </label>
                <label className={dark ? 'dark container' : 'container'}>
                  Paid
                  <input
                    type='checkbox'
                    defaultChecked='false'
                    onClick={onCheck}
                    value='paid'
                  />
                  <span
                    className={dark ? 'checkmark dark' : 'checkmark'}
                  ></span>
                </label>
              </div>
            </div>
            <button id='new-invoice-container' onClick={newInvoiceClick}>
              <div id='new-invoice-icon'>
                <img
                  src={require('../../images/icon-plus.svg').default}
                  alt='icon-plus'
                />
              </div>
              <p id='new-invoice-btn-words'>New Invoice</p>
              {/* Returns on mobile */}
              <p id='mobile-new-invoice-btn-words'>New</p>
            </button>
          </div>
        </header>
        {/* Returns if new invoice button clicked */}
        {newInvoiceForm && <InvoiceModal />}
      </Fragment>
    )
  );
};

export default Header;
