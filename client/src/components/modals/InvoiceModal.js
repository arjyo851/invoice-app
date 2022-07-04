import React, { useState, useEffect, useContext, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ItemsCard from './ItemsCard';
import InvoiceContext from '../../context/invoice/invoiceContext';
import DarkContext from '../../context/dark/darkContext';

const InvoiceModal = () => {
  // Declare and destructure context
  const invoiceContext = useContext(InvoiceContext);
  const darkContext = useContext(DarkContext);
  const {
    addInvoice,
    discardClick,
    currentUser,
    cancelEditClick,
    saveChangesClick,
    newInvoiceForm,
    editInvoiceForm,
  } = invoiceContext;
  const { dark } = darkContext;

  // Set Initial State
  const [invoice, setInvoice] = useState({
    id: '',
    createdAt: '',
    paymentDue: '',
    description: '',
    paymentTerms: 30,
    clientName: '',
    clientEmail: '',
    status: '',
    total: '',
  });
  const [senderAddress, setSenderAddress] = useState({
    street: '',
    city: '',
    postCode: '',
    country: '',
  });
  const [clientAddress, setClientAddress] = useState({
    street: '',
    city: '',
    postCode: '',
    country: '',
  });
  const [items, setItems] = useState([]);
  const [save, setSave] = useState(true);
  const [inputAlert, setInputAlert] = useState(false);
  const [itemAlert, setItemAlert] = useState(false);

  // Destructure State
  const {
    createdAt,
    description,
    paymentTerms,
    clientName,
    clientEmail,
  } = invoice;

  // Effect to set date/payment due
  useEffect(() => {
    let d = new Date();
    let day =
      ('' + d.getDate()).length < 2 ? '0' + d.getDate() : '' + d.getDate();
    let month =
      ('' + (d.getMonth() + 1)).length < 2
        ? '0' + (d.getMonth() + 1)
        : '' + (d.getMonth() + 1);
    let year = d.getFullYear();
    let initPaymentDue = incrementDate(new Date(), 30);

    setInvoice({
      ...invoice,
      createdAt: [year, month, day].join('-'),
      paymentDue: initPaymentDue,
    });
    // eslint-disable-next-line
  }, []);

  // Effect to set state if CurrentUser
  useEffect(() => {
    if (currentUser) {
      setInvoice({
        id: currentUser.id,
        createdAt: currentUser.createdAt,
        paymentDue: currentUser.paymentDue,
        description: currentUser.description,
        paymentTerms: currentUser.paymentTerms,
        clientName: currentUser.clientName,
        clientEmail: currentUser.clientEmail,
        status: currentUser.status,
        total: currentUser.total,
      });

      setSenderAddress(currentUser.senderAddress);

      setClientAddress(currentUser.clientAddress);

      let newCurUserItems = currentUser.items.map((item) => ({
        ...item,
        itemId: uuidv4(),
      }));

      setItems(newCurUserItems);
    }
    // eslint-disable-next-line
  }, []);

  // Effect to fade in/out modal
  useEffect(() => {
    setTimeout(() => {
      if (newInvoiceForm || editInvoiceForm) {
        document.getElementById('invoice-modal').classList.add('fade-in');
      }
    }, 100);
    // eslint-disable-next-line
  }, []);

  // Bill From
  const onSenderAddressChange = (e) => {
    setSenderAddress({
      ...senderAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Bill To
  const onInvoiceChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };
  const onClientAddressChange = (e) => {
    setClientAddress({
      ...clientAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Payment Terms and Date
  const onTermsClick = (e) => {
    const tempPaymentTerms =
      e.target.id === 'day'
        ? 1
        : e.target.id === 'week'
        ? 7
        : e.target.id === 'two-weeks'
        ? 14
        : 30;

    const tempPaymentDue = incrementDate(createdAt, tempPaymentTerms + 1);

    setInvoice({
      ...invoice,
      paymentTerms: tempPaymentTerms,
      paymentDue: tempPaymentDue,
    });
  };
  const onDateChange = (e) => {
    const tempPaymentDue = incrementDate(e.target.value, paymentTerms + 1);

    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value,
      paymentDue: tempPaymentDue,
    });
  };
  const incrementDate = (date, amount) => {
    let months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    let tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() + amount);
    let stringDate = tempDate.toString();
    let dueString =
      stringDate.substring(11, 15) +
      '-' +
      months[stringDate.substring(4, 7)] +
      '-' +
      stringDate.substring(8, 10);
    return dueString;
  };

  // Items List and Add Item Btn
  const onAddItemClick = (e) => {
    e.preventDefault();
    let tempId = uuidv4();

    setItems(
      items.concat({
        itemId: tempId,
        name: '',
        quantity: '',
        price: '',
        total: (0).toFixed(2),
      })
    );
  };

  const updateItems = (thisItem) => {
    const newItems = items.map((item) => {
      if (item.itemId === thisItem.itemId) {
        item = thisItem;
      }
      return item;
    });
    setItems(newItems);
  };

  const deleteItem = (delState, thisItem) => {
    if (delState) {
      setItems(items.filter((item) => item.itemId !== thisItem.itemId));
    }
  };

  // Discard, Save, Send btns
  const onMouseOver = (e) => {
    setInvoice({ ...invoice, status: e.target.name });
  };

  // Cancel Button
  const onMouseOut = (e) => {
    setSave(true);
  };
  const onCancelOver = (e) => {
    setSave(false);
  };

  // New Invoice Validation
  const addValidate = (invoice, senderAddress, clientAddress, items) => {
    let tempItemAlertState = false;
    let tempInputAlertState = false;
    let invoiceIds = {
      description: 'ni-proj-desc',
      clientName: 'ni-client-name',
      clientEmail: 'ni-client-email',
      id: '',
      total: '',
    };
    let senderAddressIds = {
      street: 'ni-sa-input',
      city: 'ni-from-city',
      postCode: 'ni-from-zip',
      country: 'ni-from-country',
    };
    let clientAddressIds = {
      street: 'ni-to-street',
      city: 'ni-to-city',
      postCode: 'ni-to-zip',
      country: 'ni-to-country',
    };

    let emptyInputs = [];
    Object.keys(invoice).forEach((key) => {
      if (
        key === 'id' ||
        key === 'total' ||
        key === 'createdAt' ||
        key === 'paymentDue' ||
        key === 'paymentTerms' ||
        key === 'status'
      ) {
        return;
      }
      let invElement = document.getElementById(invoiceIds[key]);
      if (invoice[key].length === 0) {
        emptyInputs.push(key);
        invElement.style.cssText += 'border:1px solid #ec5757';
        invElement.previousSibling.style.cssText += 'color:#ec5757;';
      } else if (inputAlert) {
        invElement.style.cssText -= 'border:1px solid #ec5757';
        invElement.previousSibling.style.cssText -= 'color:#ec5757;';
      }
    });
    Object.keys(senderAddress).forEach((key) => {
      let senAddrElement = document.getElementById(senderAddressIds[key]);
      if (senderAddress[key].length === 0) {
        emptyInputs.push(key);
        senAddrElement.style.cssText += 'border:1px solid #ec5757';
        senAddrElement.previousSibling.style.cssText += 'color:#ec5757;';
      } else if (inputAlert) {
        senAddrElement.style.cssText -= 'border:1px solid #ec5757';
        senAddrElement.previousSibling.style.cssText -= 'color:#ec5757;';
      }
    });
    Object.keys(clientAddress).forEach((key) => {
      let clAddrElement = document.getElementById(clientAddressIds[key]);
      if (clientAddress[key].length === 0) {
        emptyInputs.push(key);
        clAddrElement.style.cssText += 'border:1px solid #ec5757';
        clAddrElement.previousSibling.style.cssText += 'color:#ec5757';
      } else if (inputAlert) {
        clAddrElement.style.cssText -= 'border:1px solid #ec5757';
        clAddrElement.previousSibling.style.cssText -= 'color:#ec5757;';
      }
    });
    items.forEach((itemObj) => {
      Object.keys(itemObj).forEach((key) => {
        if (key === 'itemId' || key === 'total') {
          return;
        }
        let nameElement = document.getElementById(
          `item-name-input-${itemObj.itemId}`
        );
        let quantElement = document.getElementById(
          `qty-input-${itemObj.itemId}`
        );
        let priceElement = document.getElementById(
          `price-input-${itemObj.itemId}`
        );
        if (itemObj[key].length === 0) {
          emptyInputs.push(key);
          if (key === 'name') {
            nameElement.style.cssText += 'border:1px solid #ec5757';
          } else if (key === 'quantity') {
            quantElement.style.cssText += 'border:1px solid #ec5757';
          } else {
            priceElement.style.cssText += 'border:1px solid #ec5757';
          }
        } else if (inputAlert) {
          if (key === 'name') {
            nameElement.style.cssText -= 'border:1px solid #ec5757';
          } else if (key === 'quantity') {
            quantElement.style.cssText -= 'border:1px solid #ec5757';
          } else {
            priceElement.style.cssText -= 'border:1px solid #ec5757';
          }
        }
      });
    });

    if (emptyInputs.length > 0) {
      tempInputAlertState = true;
    }
    if (items.length === 0) {
      tempItemAlertState = true;
    }

    if (tempInputAlertState || tempItemAlertState) {
      setInputAlert(tempInputAlertState);
      setItemAlert(tempItemAlertState);
    } else {
      addInvoice(invoice, senderAddress, clientAddress, items);
    }
  };

  // Edit Invoice Validation
  const editValidate = (invoice, senderAddress, clientAddress, items) => {
    let tempItemAlertState = false;
    let tempInputAlertState = false;
    let invoiceIds = {
      description: 'ni-proj-desc',
      clientName: 'ni-client-name',
      clientEmail: 'ni-client-email',
      id: '',
      total: '',
    };
    let senderAddressIds = {
      street: 'ni-sa-input',
      city: 'ni-from-city',
      postCode: 'ni-from-zip',
      country: 'ni-from-country',
    };
    let clientAddressIds = {
      street: 'ni-to-street',
      city: 'ni-to-city',
      postCode: 'ni-to-zip',
      country: 'ni-to-country',
    };

    let emptyInputs = [];
    Object.keys(invoice).forEach((key) => {
      if (
        key === 'id' ||
        key === 'total' ||
        key === 'createdAt' ||
        key === 'paymentDue' ||
        key === 'paymentTerms' ||
        key === 'status'
      ) {
        return;
      }
      let invElement = document.getElementById(invoiceIds[key]);
      if (invoice[key].length === 0) {
        emptyInputs.push(key);
        invElement.style.cssText += 'border:1px solid #ec5757';
        invElement.previousSibling.style.cssText += 'color:#ec5757;';
      } else if (inputAlert) {
        invElement.style.cssText -= 'border:1px solid #ec5757';
        invElement.previousSibling.style.cssText -= 'color:#ec5757;';
      }
    });
    Object.keys(senderAddress).forEach((key) => {
      let senAddrElement = document.getElementById(senderAddressIds[key]);
      if (senderAddress[key].length === 0) {
        emptyInputs.push(key);
        senAddrElement.style.cssText += 'border:1px solid #ec5757';
        senAddrElement.previousSibling.style.cssText += 'color:#ec5757;';
      } else if (inputAlert) {
        senAddrElement.style.cssText -= 'border:1px solid #ec5757';
        senAddrElement.previousSibling.style.cssText -= 'color:#ec5757;';
      }
    });
    Object.keys(clientAddress).forEach((key) => {
      let clAddrElement = document.getElementById(clientAddressIds[key]);
      if (clientAddress[key].length === 0) {
        emptyInputs.push(key);
        clAddrElement.style.cssText += 'border:1px solid #ec5757';
        clAddrElement.previousSibling.style.cssText += 'color:#ec5757';
      } else if (inputAlert) {
        clAddrElement.style.cssText -= 'border:1px solid #ec5757';
        clAddrElement.previousSibling.style.cssText -= 'color:#ec5757;';
      }
    });
    items.forEach((itemObj) => {
      Object.keys(itemObj).forEach((key) => {
        if (key === 'itemId' || key === 'total') {
          return;
        }
        let nameElement = document.getElementById(
          `item-name-input-${itemObj.itemId}`
        );
        let quantElement = document.getElementById(
          `qty-input-${itemObj.itemId}`
        );
        let priceElement = document.getElementById(
          `price-input-${itemObj.itemId}`
        );
        if (itemObj[key].length === 0) {
          emptyInputs.push(key);
          if (key === 'name') {
            nameElement.style.cssText += 'border:1px solid #ec5757';
          } else if (key === 'quantity') {
            quantElement.style.cssText += 'border:1px solid #ec5757';
          } else {
            priceElement.style.cssText += 'border:1px solid #ec5757';
          }
        } else if (inputAlert) {
          if (key === 'name') {
            nameElement.style.cssText -= 'border:1px solid #ec5757';
          } else if (key === 'quantity') {
            quantElement.style.cssText -= 'border:1px solid #ec5757';
            quantElement.style.cssText += 'width:50px';
          } else {
            priceElement.style.cssText -= 'border:1px solid #ec5757';
            priceElement.style.cssText += 'width:50px';
          }
        }
      });
    });

    if (emptyInputs.length > 0) {
      tempInputAlertState = true;
    }
    if (items.length === 0) {
      tempItemAlertState = true;
    }
    if (tempInputAlertState || tempItemAlertState) {
      setInputAlert(tempInputAlertState);
      setItemAlert(tempItemAlertState);
    } else {
      let tempTotal = 0;
      items.forEach((item) => (tempTotal += parseFloat(item.total)));

      invoice.status === 'draft' && (invoice.status = 'pending');
      invoice.senderAddress = senderAddress;
      invoice.clientAddress = clientAddress;
      invoice.items = items;
      invoice.total = tempTotal;
      saveChangesClick(currentUser, invoice);
    }
  };

  // Form Submit
  const onSubmit = (e) => {
    e.preventDefault();
    !currentUser
      ? invoice.status === 'discard'
        ? discardClick()
        : invoice.status === 'pending'
        ? addValidate(invoice, senderAddress, clientAddress, items)
        : addInvoice(invoice, senderAddress, clientAddress, items)
      : !save
      ? cancelEditClick()
      : editValidate(invoice, senderAddress, clientAddress, items);
  };

  const userHashId = currentUser ? (
    <Fragment>
      Edit <span style={{ color: '#7E88C3' }}>#</span>
      {currentUser.id}
    </Fragment>
  ) : null;

  // Render
  return (
    <div id='invoice-modal' className='back-drop'>
      <form onSubmit={onSubmit}>
        <div id='invoice-modal-form' className={dark ? 'dark' : undefined}>
          <p id='invoice-modal-title' className={dark ? 'dark' : undefined}>
            {currentUser ? userHashId : 'New Invoice'}
          </p>

          <div id='ni-bill-from'>
            <p className='modal-sec-title'>Bill From</p>
            <div id='street-address'>
              <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                Street Address
              </p>
              <input
                className={dark ? 'dark' : undefined}
                type='text'
                id='ni-sa-input'
                name='street'
                autoComplete='off'
                value={senderAddress.street}
                onChange={onSenderAddressChange}
              />
            </div>
            <div id='ni-city-zip-country'>
              <div id='city'>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  City
                </p>
                <input
                  className={dark ? 'dark' : undefined}
                  type='text'
                  id='ni-from-city'
                  name='city'
                  autoComplete='off'
                  value={senderAddress.city}
                  onChange={onSenderAddressChange}
                />
              </div>
              <div id='zip'>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  Post Code
                </p>
                <input
                  className={dark ? 'dark' : undefined}
                  type='text'
                  id='ni-from-zip'
                  name='postCode'
                  autoComplete='off'
                  value={senderAddress.postCode}
                  onChange={onSenderAddressChange}
                />
              </div>
              <div id='country'>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  Country
                </p>
                <input
                  className={dark ? 'dark' : undefined}
                  type='text'
                  id='ni-from-country'
                  name='country'
                  autoComplete='off'
                  value={senderAddress.country}
                  onChange={onSenderAddressChange}
                />
              </div>
            </div>
          </div>
          <div id='ni-bill-to'>
            <p className='modal-sec-title'>Bill To</p>
            <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
              Client's Name
            </p>
            <input
              id='ni-client-name'
              className={dark ? 'dark' : undefined}
              type='text'
              name='clientName'
              autoComplete='off'
              value={clientName}
              onChange={onInvoiceChange}
            />
            <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
              Client's Email
            </p>
            <input
              id='ni-client-email'
              className={dark ? 'dark' : undefined}
              type='email'
              name='clientEmail'
              autoComplete='off'
              placeholder='e.g. email@example.com'
              value={clientEmail}
              onChange={onInvoiceChange}
            />
            <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
              Street Address
            </p>
            <input
              id='ni-to-street'
              className={dark ? 'dark' : undefined}
              type='text'
              name='street'
              autoComplete='off'
              value={clientAddress.street}
              onChange={onClientAddressChange}
            />
            <div id='bt-cityzipcountry'>
              <div>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  City
                </p>
                <input
                  id='ni-to-city'
                  className={dark ? 'dark' : undefined}
                  type='text'
                  name='city'
                  autoComplete='off'
                  value={clientAddress.city}
                  onChange={onClientAddressChange}
                />
              </div>
              <div>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  Post Code
                </p>
                <input
                  id='ni-to-zip'
                  className={dark ? 'dark' : undefined}
                  type='text'
                  name='postCode'
                  autoComplete='off'
                  value={clientAddress.postCode}
                  onChange={onClientAddressChange}
                />
              </div>
              <div>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  Country
                </p>
                <input
                  id='ni-to-country'
                  className={dark ? 'dark' : undefined}
                  type='text'
                  name='country'
                  autoComplete='off'
                  value={clientAddress.country}
                  onChange={onClientAddressChange}
                />
              </div>
            </div>
            <div id='td-date-terms'>
              <div id='td-date'>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  Invoice Date
                </p>
                <input
                  className={dark ? 'dark' : undefined}
                  type='date'
                  name='createdAt'
                  autoComplete='off'
                  value={createdAt}
                  onChange={onDateChange}
                />
              </div>
              <div id='td-terms'>
                <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
                  Payment Terms
                </p>
                <div
                  id='payment-terms-drop'
                  className={dark ? 'dark' : undefined}
                >
                  <div id='term-arrow'>
                    <p className={dark ? 'dark' : undefined}>
                      {paymentTerms === 1
                        ? 'Net 1 day'
                        : paymentTerms === 7
                        ? 'Net 7 days'
                        : paymentTerms === 14
                        ? 'Net 14 days'
                        : 'Net 30 days'}
                    </p>
                    <img
                      src={require('../../images/icon-arrow-down.svg').default}
                      alt='icon-arrow-down'
                    />
                  </div>
                  <div
                    id='dropdown-items'
                    className={dark ? 'dark' : undefined}
                    onClick={onTermsClick}
                  >
                    <p id='day' className={dark ? 'dark' : undefined}>
                      Net 1 day
                    </p>
                    <p id='week' className={dark ? 'dark' : undefined}>
                      Net 7 days
                    </p>
                    <p id='two-weeks' className={dark ? 'dark' : undefined}>
                      Net 14 days
                    </p>
                    <p id='month' className={dark ? 'dark' : undefined}>
                      Net 30 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className={dark ? 'dark td-beautiful' : 'td-beautiful'}>
              Project Description
            </p>
            <input
              id='ni-proj-desc'
              className={dark ? 'dark' : undefined}
              type='text'
              name='description'
              autoComplete='off'
              placeholder='e.g. Graphic Design Service'
              value={description}
              onChange={onInvoiceChange}
            />
          </div>
          <div id='ni-item-list'>
            <p className='modal-big-title'>Item List</p>
            <div id='modal-item-list-header'>
              <p
                id='header1'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Item Name
              </p>
              <p
                id='header2'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Qty.
              </p>
              <p
                id='header3'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Price
              </p>
              <p
                id='header4'
                className={dark ? 'dark td-beautiful' : 'td-beautiful'}
              >
                Total
              </p>
              <p id='header5'></p>
            </div>
            {/* Returns if items entered */}
            {items.length > 0
              ? items.map((item) => (
                  <ItemsCard
                    key={item.itemId}
                    item={item}
                    deleteItem={deleteItem}
                    updateItems={updateItems}
                  />
                ))
              : null}
            <button
              id='modal-add-new-item'
              onClick={onAddItemClick}
              className={dark ? 'dark' : undefined}
            >
              <img
                src={require('../../images/icon-plus.svg').default}
                alt='icon-plus'
              />
              <p style={{ marginLeft: '5px' }}>Add New Item</p>
            </button>
          </div>
          <div id='alert-messages'>
            {inputAlert ? (
              <div id='field-alert'>
                <p className='alert-text'>-All fields must be added</p>
              </div>
            ) : null}
            {itemAlert ? (
              <div id='item-alert'>
                <p className='alert-text'>-An item must be added</p>
              </div>
            ) : null}
          </div>
        </div>
        <div
          id='invoice-modal-submit-btns'
          className={dark ? 'dark' : undefined}
        >
          <div id='ni-bot-btns'>
            {/* Returns new invoice or edit invoice buttons */}
            {!currentUser ? (
              <Fragment>
                <div id='ni-btns'>
                  <input
                    type='submit'
                    name='discard'
                    value='Discard'
                    className={
                      dark ? 'form-btn discard dark' : 'form-btn discard'
                    }
                    onMouseOver={onMouseOver}
                  />
                  <div id='save-btns'>
                    <input
                      type='submit'
                      name='draft'
                      value='Save as Draft'
                      className={
                        dark ? 'form-btn draft dark' : 'form-btn draft'
                      }
                      onMouseOver={onMouseOver}
                    />
                    <input
                      type='submit'
                      name='pending'
                      value='Save & Send'
                      className='form-btn send'
                      onMouseOver={onMouseOver}
                    />
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div id='change-btns'>
                  <input
                    type='submit'
                    name='cancel'
                    value='Cancel'
                    className='form-btn cancel'
                    onMouseOut={onMouseOut}
                    onMouseOver={onCancelOver}
                  />
                  <input
                    type='submit'
                    name='changes'
                    value='Save Changes'
                    className='form-btn change'
                  />
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceModal;
