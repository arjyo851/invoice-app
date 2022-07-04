import React, { useContext, useEffect } from 'react';
import InvoiceContext from '../../context/invoice/invoiceContext';
import DarkContext from '../../context/dark/darkContext';

const DeleteModal = () => {
  // Declare and destructure context
  const invoiceContext = useContext(InvoiceContext);
  const darkContext = useContext(DarkContext);
  const { dark } = darkContext;
  const {
    cancelDeleteClick,
    onConfirmDeleteClick,
    currentUser,
  } = invoiceContext;

  // Effect to fade in/out modal
  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById('delete-modal-container')
        .classList.add('fade-in');
    }, 100);
    // eslint-disable-next-line
  }, []);

  return (
    <div id='delete-modal-container' className='back-drop'>
      <div id='delete-modal' className={dark ? 'dark' : undefined}>
        <p id='dm-heading' className={dark ? 'dark' : undefined}>
          Confirm Deletion
        </p>
        <p id='dm-question' className={dark ? 'dark' : undefined}>
          Are you sure you want to delete invoice{' '}
          <span style={{ color: '#7E88C3' }}>#</span>
          {currentUser.id}? This action cannot be undone.
        </p>
        <div id='dm-btns'>
          <button
            id='dm-cancel'
            className={dark ? 'dark form-btn' : 'form-btn'}
            onClick={cancelDeleteClick}
          >
            <p id='cancel' className={dark ? 'dark' : undefined}>
              Cancel
            </p>
          </button>
          <button
            id='dm-delete'
            className='form-btn'
            onClick={() => onConfirmDeleteClick(currentUser)}
          >
            <p id='delete'>Delete</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
