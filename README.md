# Liatrio Modernize It

## Overview

Liatrio Modernize It is a React application that allows users to manage a list of "things". Users can add new things, mark them as completed or awaiting, and delete them. The application uses React Bootstrap for styling and a simple REST API for data persistence.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **React Bootstrap**: A library that provides Bootstrap components as React components.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Fetch API**: A modern interface for making HTTP requests in the browser.
- **SCSS**: A CSS preprocessor that adds features like variables, nested rules, and mixins.

## Functionality

### Fetch Things

The application fetches a list of things from the API and displays them in a card format. Each card shows the title, price, and completion status of the thing.

### Add Thing

Users can add a new thing by filling out a form with the title and price of the thing. The new thing is then sent to the API and added to the list.

### Toggle Completion

Users can mark a thing as completed or awaiting by clicking a button on the card. The completion status is updated in the API and the UI.

### Delete Thing

Users can delete a thing by clicking the "X" button on the top right of the card. The thing is removed from the API and the UI.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/liatrio-modernize-it.git

   cd liatrio-modernize-it
   npm install
   npm start

   API
The application interacts with a REST API at http://localhost:3000/. The following endpoints are used:

GET /things: Fetch all things.
POST /things: Add a new thing.
PATCH /things/:id: Update the completion status of a thing.
DELETE /things/:id: Delete a thing.
File Structure

liatrio-modernize-it/
├── public/
│   ├── [index.html](http://_vscodecontentref_/0)
│   └── ...
├── src/
│   ├── [App.tsx](http://_vscodecontentref_/1)
│   ├── App.scss
│   ├── index.tsx
│   └── ...
├── [package.json](http://_vscodecontentref_/2)
├── [tsconfig.json](http://_vscodecontentref_/3)
└── ...

License
This project is licensed under the MIT License - see the LICENSE file for details.
