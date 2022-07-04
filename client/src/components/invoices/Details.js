import React, { useState, useEffect, useContext, Fragment } from 'react';
import InvoiceModal from '../modals/InvoiceModal';
import DeleteModal from '../modals/DeleteModal';
import InvoiceContext from '../../context/invoice/invoiceContext';
import DarkContext from '../../context/dark/darkContext';

const Details = ({ currentUser }) => {
  // Declare and destructure context
  const invoiceContext = useContext(InvoiceContext);
  const darkContext = useContext(DarkContext);
  const {
    deleteConfirmation,
    editInvoiceForm,
    deleteButtonClick,
    editButtonClick,
    goBackClick,
    onMarkAsPaidClick,
  } = invoiceContext;
  const { dark } = darkContext;

  // Declare component level state
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [dueYear, setDueYear] = useState('');
  const [dueMonth, setDueMonth] = useState('');
  const [dueDay, setDueDay] = useState('');

  // Effect to push window to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to set date/payment due on change state
  useEffect(() => {
    const year = createdAt.substring(0, 4);
    const month = parseInt(createdAt.substring(5, 7)) - 1;
    const day = createdAt.substring(8);
    const d = new Date(year, month, day).toString();
    setYear(d.substring(11, 15));
    setMonth(d.substring(4, 7));
    setDay(d.substring(8, 10));

    const dueYear = paymentDue.substring(0, 4);
    const dueMonth = parseInt(paymentDue.substring(5, 7)) - 1;
    const dueDay = paymentDue.substring(8);
    const dD = new Date(dueYear, dueMonth, dueDay).toString();
    setDueYear(dD.substring(11, 15));
    setDueMonth(dD.substring(4, 7));
    setDueDay(dD.substring(8, 10));
    // eslint-disable-next-line
  }, [currentUser.createdAt, currentUser.paymentDue]);

  // Destructure currentUser
  const {
    status,
    total,
    items,
    id,
    description,
    createdAt,
    paymentDue,
    clientName,
    clientEmail,
    clientAddress,
    senderAddress,
  } = currentUser;

  return (
    <Fragment>
      {/* Fixed position if modal active */}
      <div
        id='details-container'
        className={
          editInvoiceForm || deleteConfirmation ? 'modal-container' : null
        }
      >
        <div id='back-button' onClick={goBackClick}>
          <img
            src={require('../../images/icon-arrow-left.svg').default}
            alt='icon-arrow-left'
          />
          <p className={dark ? 'dark' : undefined}>Go Back</p>
        </div>
        <header id='details-header' className={dark ? 'dark' : undefined}>
          <div id='dh-status'>
            <p id='status-word' className={dark ? 'dark' : undefined}>
              Status
            </p>
            <div
              id={status + '--' + id}
              className={
                dark ? 'dark item-status-container' : 'item-status-container'
              }
            >
              <div className={dark ? 'dark dot' : 'dot'}></div>
              <p className={dark ? 'dark item-status' : 'item-status'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
          </div>
          <div
            id='dh-options'
            style={
              status === 'draft'
                ? {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }
                : { display: 'flex' }
            }
          >
            <button
              id='edit'
              className={dark ? 'form-btn dark' : 'form-btn'}
              onClick={editButtonClick}
              style={
                status === 'draft'
                  ? {
                      marginRight: '5px',
                    }
                  : undefined
              }
            >
              <p>Edit</p>
            </button>
            <button
              id='delete'
              className='form-btn'
              onClick={deleteButtonClick}
            >
              <p>Delete</p>
            </button>
            <button
              id='mark-as-paid'
              className='form-btn'
              onClick={() => onMarkAsPaidClick(status)}
              style={status === 'draft' ? { display: 'none' } : { display: '' }}
            >
              {status === 'pending' ? (
                <p>Mark as Paid</p>
              ) : (
                <p>Mark as Pending</p>
              )}
            </button>
          </div>
        </header>

        <section id='details-card' className={dark ? 'dark' : undefined}>
          <div id='top-details'>
            <div id='td-group1' className='td-cn-group1'>
              <p id='td-id' className={dark ? 'dark td-bold' : 'td-bold'}>
                <span style={{ color: '#7E88C3' }}>#</span>
                {id}
              </p>
              <p
                id='td-desription'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                {description}
              </p>
            </div>
            <div id='td-group2' className='td-cn-group2'>
              <p
                id='td-inv-date-header'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Invoice Date
              </p>
              <p id='td-inv-date' className={dark ? 'dark td-bold' : 'td-bold'}>
                {day} {month} {year}
              </p>
            </div>
            <div id='td-group3' className='td-cn-group3'>
              <p
                id='td-due-date-header'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Payment Due
              </p>
              <p id='td-due-date' className={dark ? 'dark td-bold' : 'td-bold'}>
                {dueDay} {dueMonth} {dueYear}
              </p>
            </div>
            <div id='td-group4' className='td-cn-group4'>
              <p
                id='td-bill-to-header'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Bill To
              </p>
              <p
                id='td-bill-to-name'
                className={dark ? 'dark td-bold' : 'td-bold'}
              >
                {clientName}
              </p>
              <div
                id='td-bill-to-address'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                <p id='client-street'>{clientAddress.street}</p>
                <p id='client-city'>{clientAddress.city}</p>
                <p id='client-zip'>{clientAddress.postCode}</p>
                <p id='client-country'>{clientAddress.country}</p>
              </div>
            </div>
            <div id='td-group5' className='td-cn-group5'>
              <p
                id='td-sent-to-header'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Sent To
              </p>
              <p
                id='td-sent-to-email'
                className={dark ? 'dark td-bold' : 'td-bold'}
              >
                {clientEmail}
              </p>
            </div>
            <div id='td-group6' className='td-cn-group6'>
              <div
                id='td-sender-address'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                <p id='client-street'>{senderAddress.street}</p>
                <br></br>
                <p id='client-city'>{senderAddress.city}</p>
                <br></br>
                <p id='client-zip'>{senderAddress.postCode}</p>
                <br></br>
                <p id='client-country'>{senderAddress.country}</p>
              </div>
            </div>
          </div>
          <div id='details-card-items' className={dark ? 'dark' : undefined}>
            <div id='dc-items-header'>
              <p id='item-name' className={dark ? 'dark' : undefined}>
                Item Name
              </p>
              <p id='qty' className={dark ? 'dark' : undefined}>
                QTY.
              </p>
              <p id='price' className={dark ? 'dark' : undefined}>
                Price
              </p>
              <p id='total' className={dark ? 'dark' : undefined}>
                Total
              </p>
            </div>
            {/* Map through items, return for each one */}
            {items.map((item, i) => {
              return (
                <div key={i} className='item-info'>
                  <p
                    className={dark ? 'dark item-info-name' : 'item-info-name'}
                  >
                    {item.name}
                  </p>
                  <p
                    className={
                      dark ? 'dark item-info-quantity' : 'item-info-quantity'
                    }
                  >
                    {item.quantity}
                  </p>
                  <p
                    className={
                      dark ? 'dark item-info-price' : 'item-info-price'
                    }
                  >
                    ₹{" "}{parseFloat(item.price).toFixed(2)}
                  </p>
                  <p
                    className={
                      dark ? 'dark item-info-total' : 'item-info-total'
                    }
                  >
                    ₹{" "}{(item.quantity * item.price).toFixed(2)}
                  </p>
                  <p id='random-x' className={dark ? 'dark' : undefined}>
                    x
                  </p>
                </div>
              );
            })}
          </div>
          <div id='details-card-total' className={dark ? 'dark' : undefined}>
            <p id='amount-due'>Amount Due</p>
            <div id='dc-total'>
              ₹{" "}
              {total
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </div>
          </div>
        </section>
        {/* Returns if on mobile screen */}
        <footer id='mobile-footer' className={dark ? 'dark' : undefined}>
          <div
            id='edit'
            className={dark ? 'form-btn dark' : 'form-btn'}
            onClick={editButtonClick}
          >
            <p>Edit</p>
          </div>
          <div id='delete' className='form-btn' onClick={deleteButtonClick}>
            <p>Delete</p>
          </div>
          <div
            id='mark-as-paid'
            className='form-btn'
            onClick={() => onMarkAsPaidClick(status)}
            style={status === 'draft' ? { display: 'none' } : { display: '' }}
          >
            {status === 'pending' ? (
              <p>Mark as Paid</p>
            ) : (
              <p>Mark as Pending</p>
            )}
          </div>
        </footer>
      </div>
      {/* Return if edit button clicked */}
      {editInvoiceForm && <InvoiceModal />}
      {/* Return if delete button clicked */}
      {deleteConfirmation && <DeleteModal />}
    </Fragment>
  );
};

export default Details;
