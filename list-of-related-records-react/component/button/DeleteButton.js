// DeleteButton.js
import React from 'react';

function DeleteButton({ id, onDelete }) {
  const handleClick = () => {
    onDelete(id);
  };

  return (
    <button className="btn btn-danger" onClick={handleClick}>
      Remove
    </button>
  );
}

export default DeleteButton;
