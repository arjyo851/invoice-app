import React, { useReducer } from 'react';
import axios from 'axios';
import InvoiceContext from './invoiceContext';
import invoiceReducer from './invoiceReducer';
import {
  ADD_INVOICE,
  NEW_INVOICE_FORM,
  INVOICE_DETAILS,
  GO_BACK,
  DELETE_CONFIRMATION,
  EDIT_INVOICE_FORM,
  DISCARD,
  FILTER_INVOICES,
  MARK_PAID,
  CANCEL_DELETE,
  CONFIRM_DELETE,
  CANCEL_EDIT,
  SAVE_CHANGES,
  INVOICE_ERROR,
  GET_INVOICES,
} from '../types';

const InvoiceState = (props) => {
  // Set initial state
  const initialState = {
    invoices: [],
    newInvoiceForm: false,
    invoiceDetails: false,
    editInvoiceForm: false,
    deleteConfirmation: false,
    currentUser: null,
    filters: ['paid', 'pending', 'draft'],
    error: null,
  };

  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  // Get Invoices
  const getInvoices = async () => {
    try {
      const res = await axios.get('/api/invoices');

      dispatch({
        type: GET_INVOICES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: INVOICE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Add Invoice
  const addInvoice = async (invoice, senderAddress, clientAddress, items) => {
    let tempId = '';
    for (let i = 0; i <= 1; i++) {
      tempId += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    for (let j = 0; j <= 3; j++) {
      tempId += Math.floor(Math.random() * 10);
    }

    let tempTotal = 0;
    items.forEach((item) => (tempTotal += parseFloat(item.total)));

    invoice.id = tempId;
    invoice.senderAddress = senderAddress;
    invoice.clientAddress = clientAddress;
    invoice.items = items;
    invoice.total = tempTotal;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/invoices', invoice, config);
      dispatch({
        type: ADD_INVOICE,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: INVOICE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Click on New Invoice Button
  const newInvoiceClick = () => {
    dispatch({
      type: NEW_INVOICE_FORM,
      payload: true,
    });
  };

  // Click on an invoice
  const invoiceDetailsClick = (invoice) => {
    dispatch({
      type: INVOICE_DETAILS,
      payload: invoice,
    });
  };

  // Click on Go Back
  const goBackClick = () => {
    dispatch({
      type: GO_BACK,
      payload: ['draft', 'pending', 'paid'],
    });
  };

  // Click on Delete Button
  const deleteButtonClick = () => {
    dispatch({
      type: DELETE_CONFIRMATION,
      payload: true,
    });
  };

  // Click on Cancel Delete Button
  const cancelDeleteClick = () => {
    dispatch({
      type: CANCEL_DELETE,
      payload: false,
    });
  };

  // Click on Edit Button
  const editButtonClick = () => {
    dispatch({
      type: EDIT_INVOICE_FORM,
      payload: true,
    });
  };

  // Click on Mark as Paid Button
  const onMarkAsPaidClick = async (status) => {
    const newCurrUser = state.currentUser;
    status === 'pending'
      ? (newCurrUser.status = 'paid')
      : (newCurrUser.status = 'pending');

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.put(
        `/api/invoices/${newCurrUser._id}`,
        newCurrUser,
        config
      );
      dispatch({
        type: MARK_PAID,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: INVOICE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Click on Discard Button
  const discardClick = () => {
    dispatch({ type: DISCARD, payload: false });
  };

  // Check filter
  const filterCheck = (status) => {
    let tempFilters = state.filters;
    const index = tempFilters.indexOf(status);
    if (index >= 0) {
      tempFilters.splice(index, 1);
    } else {
      tempFilters.push(status);
    }

    dispatch({
      type: FILTER_INVOICES,
      payload: tempFilters,
    });
  };

  // Confirm Delete of Invoice
  const onConfirmDeleteClick = async (currentUser) => {
    let newInvoices = state.invoices.filter(
      (invoice) => invoice.id !== currentUser.id
    );

    dispatch({
      type: CONFIRM_DELETE,
      payload: newInvoices,
    });
    try {
      await axios.delete(`/api/invoices/${currentUser._id}`);
    } catch (err) {
      dispatch({
        type: INVOICE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Cancel Edit Click
  const cancelEditClick = () => {
    dispatch({
      type: CANCEL_EDIT,
      payload: false,
    });
  };

  // Save Changes Click
  const saveChangesClick = async (currentUser, updatedInvoice) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.put(
        `/api/invoices/${currentUser._id}`,
        updatedInvoice,
        config
      );

      let newInvoices = state.invoices.map((invoice) => {
        if (invoice.id === updatedInvoice.id) {
          invoice = res.data;
        }
        return invoice;
      });

      dispatch({
        type: SAVE_CHANGES,
        payloadOne: newInvoices,
        payloadTwo: res.data,
      });
    } catch (err) {
      dispatch({
        type: INVOICE_ERROR,
        payload: err.response.msg,
      });
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices: state.invoices,
        newInvoiceForm: state.newInvoiceForm,
        currentUser: state.currentUser,
        invoiceDetails: state.invoiceDetails,
        editInvoiceForm: state.editInvoiceForm,
        deleteConfirmation: state.deleteConfirmation,
        filters: state.filters,
        error: state.error,
        newInvoiceClick,
        addInvoice,
        invoiceDetailsClick,
        goBackClick,
        deleteButtonClick,
        editButtonClick,
        discardClick,
        filterCheck,
        onMarkAsPaidClick,
        cancelDeleteClick,
        onConfirmDeleteClick,
        cancelEditClick,
        saveChangesClick,
        getInvoices,
      }}
    >
      {props.children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceState;
