// CustomerProofreadersAddForm.js
import React, { useState } from 'react';

function CustomerProofreadersAddForm({ onAdd }) {
  const [proofreaderId, setProofreaderId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(proofreaderId);
    setProofreaderId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="proofreaderId">Proofreader Id</label>
        <input
          type="text"
          className="form-control"
          id="proofreaderId"
          value={proofreaderId}
          onChange={e => setProofreaderId(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Proofreader</button>
    </form>
  );
}

export default CustomerProofreadersAddForm;
