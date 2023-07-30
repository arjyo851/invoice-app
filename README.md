# Invoice App - Web Application

Invoice App is a web application built using React.js and Node.js that allows users to perform CRUD operations (Create, Read, Update, Delete) on invoices. Users can create new invoices, edit existing ones, mark invoices as paid, and delete invoices with confirmation prompts. The app also supports saving invoices as drafts and setting payment terms for pending invoices.

## Features

### Creating an Invoice

When creating a new invoice, the app generates a unique ID in the format of 2 random uppercased letters followed by 4 random numbers. Invoices can be created in two different statuses - "draft" or "pending".

1. **Save as Draft**: Clicking this option allows the user to leave any form field blank. However, the app will create an ID if one doesn't exist and set the status to "draft".

2. **Save & Send**: Clicking this option requires the user to fill in all form fields. The app will set the status to "pending". Additionally, changing the "Payment Terms" field automatically updates the "Payment Due" property based on the "Created At" date plus the number of days set for the payment terms.

3. **Total Calculation**: The total amount on the invoice is calculated as the sum of all items listed.

### Editing an Invoice

When saving changes to an existing invoice, all form fields become required. If the user clicks "Cancel" during the editing process, any unsaved changes will be reset.

1. **Updating Status**: If the invoice being edited is a "draft", clicking the "Save Changes" button updates the status to "pending". All form fields are required at this stage.

### Marking an Invoice as Paid

Users have the option to mark invoices as paid by clicking the "Mark as Paid" button. This action changes the status of the invoice to "paid".

### Deleting an Invoice

When trying to delete invoices, users will receive a confirmation modal to prevent accidental deletions.

## Setup and Installation

To run the Invoice App locally, follow these steps:

1. Clone the repository from GitHub:

```bash
git clone https://github.com/your-username/invoice-app.git
```

2. Navigate to the project directory:

```bash
cd invoice-app
```

3. Install dependencies for the server:

```bash
npm install
```

4. Install dependencies for the client (React):

```bash
cd client
npm install
```
5. Go back to the root directory and start both the server and client concurrently:
```
cd ..
npm start
```

7. The Invoice App should now be accessible in your browser at `http://localhost:3000`.

## Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB (or any database of your choice for storing invoices)
- Axios (for handling HTTP requests)
- Bootstrap (optional: for basic styling)

## Note

Custom styling for the date and dropdown form fields is optional, as the main focus of this app is on functionality. The provided designs for those fields are for illustration purposes only.

## Contributing

Contributions to Invoice App are welcome! If you find any bugs or have suggestions for improvements, please create a pull request or open an issue on GitHub.

## License

Invoice App is open-source software licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this application as per the terms of the license.


