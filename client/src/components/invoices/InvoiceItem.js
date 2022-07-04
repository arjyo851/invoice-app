import React, { useState, useEffect, useContext } from 'react';
import InvoiceContext from '../../context/invoice/invoiceContext';
import DarkContext from '../../context/dark/darkContext';

const InvoiceItem = ({ invoice }) => {
  // Declare and destructure context
  const invoiceContext = useContext(InvoiceContext);
  const darkContext = useContext(DarkContext);
  const { dark } = darkContext;
  const { invoiceDetailsClick } = invoiceContext;

  // Declare state
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  // Destructure props
  const { id, paymentDue, total, clientName, status } = invoice;

  // Effect to set initial date/payment due
  useEffect(() => {
    const year = paymentDue.substring(0, 4);
    const month = parseInt(paymentDue.substring(5, 7)) - 1;
    const day = paymentDue.substring(8);
    const d = new Date(year, month, day).toString();
    setYear(d.substring(11, 15));
    setMonth(d.substring(4, 7));
    setDay(d.substring(8, 10));
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={dark ? 'dark invoice-item' : 'invoice-item'}
      onClick={() => invoiceDetailsClick(invoice)}
    >
      <h3 className={dark ? 'dark item-id' : 'item-id'}>
        <span style={{ color: '#7e88c3' }}>#</span>
        {id}
      </h3>
      <p className={dark ? 'dark item-created-at' : 'item-created-at'}>
        Due {day} {month} {year}
      </p>
      <p className={dark ? 'item-client-name dark' : 'item-client-name'}>
        {clientName}
      </p>
      <h3 className={dark ? 'dark item-payment-due' : 'item-payment-due'}>
        ₹{" "} 
         { total
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </h3>
      <div className='colored-part-and-arrow'>
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
        <img
          src={require('../../images/icon-arrow-right.svg').default}
          alt='icon-arrow-right'
        />
      </div>
    </div>
  );
};

export default InvoiceItem;
