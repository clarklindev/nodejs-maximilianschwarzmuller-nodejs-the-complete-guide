import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export const Orders = () => {
  const { orderId } = useParams();

  const getOrderHandler = async (mode: string) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}:${
        import.meta.env.VITE_BACKEND_PORT
      }/shop/orders/${orderId}?mode=${mode}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        // Handle error responses (e.g., 404, 500, etc.)
        throw new Error('Failed to fetch data');
      }

      const bufferData = await response.arrayBuffer(); //handle buffer response

      const blobData = new Blob([bufferData], {
        type: 'application/pdf', // Set the correct MIME type for PDF files
      });

      if (mode === 'view') {
        const pdfUrl = URL.createObjectURL(blobData);
        const newWindow = window.open(pdfUrl, '_blank');
        if (!newWindow) {
          // If the new window is blocked by the browser, show a message to the user
          alert('Please allow popups for this site to view the PDF.');
        }
      } else if (mode === 'download') {
        // Use the suggested filename from the server response
        const suggestedFilename = `invoice-${orderId}.pdf`; // Change 'file.pdf' to the default filename if needed

        // Create a Blob and initiate download
        const downloadUrl = URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = suggestedFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error so the calling code can handle it
    }
  };

  return (
    <>
      <button onClick={() => getOrderHandler('view')}>view</button>
      <br />
      <button onClick={() => getOrderHandler('download')}>download</button>
    </>
  );
};
