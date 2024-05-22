import React, { useEffect, useState, useContext } from 'react';
import ActiveUserContext from '../../ActiveUserContext';
import DeleteButton from '../../component/button/DeleteButton';
import CustomerProofreadersAddForm from './CustomerProofreadersAddForm';

function CustomerProofreaders() {
  const [proofreaders, setProofreaders] = useState([]);
  const { activeUser, setActiveUser } = useContext(ActiveUserContext);

  const fetchProofreaders = () => {
    fetch(process.env.REACT_APP_API_URL_CUSTOMER_PROOFREADERS)
      .then(response => response.json())
      .then(data => setProofreaders(data));
  };

  useEffect(() => {
    // Fetch the proofreaders from your API
    fetchProofreaders();
  }, []);

  // Define a function to delete a proofreader
  const deleteProofreader = (id) => {
    // Send a DELETE request to your API
    fetch(`${process.env.REACT_APP_API_URL_CUSTOMER_PROOFREADERS}?id=${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          // If the deletion was successful, update the list of proofreaders
          setProofreaders(proofreaders.filter(proofreader => proofreader.id !== id));
        }
      });
  }

  const addProofreader = (proofreaderId) => {
    // Send a POST request to your API to add a new proofreader
    fetch(process.env.REACT_APP_API_URL_CUSTOMER_PROOFREADERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pnc_preafrooder_id: proofreaderId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          // If the proofreader was successfully added, update the list of proofreaders
          fetchProofreaders();
        }
      });
  }

  return (
    <div>
      <h1>Proofreaders for {activeUser?.cust_firstname} {activeUser?.cust_lastname} {activeUser?.cust_company}</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Proofreader ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {proofreaders.map(proofreader => (
            //display a bootstrap table with columns of id, name, and email
            <tr key={proofreader.id}>
              <td>{proofreader.pnc_preafrooder_id}</td>
              <td>{proofreader.cust_firstname} {proofreader.cust_lastname}</td>
              <td>{proofreader.cust_email}</td>
              <td>
                <DeleteButton id={proofreader.id} onDelete={deleteProofreader} />
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>Add Proofreader</h2>
          <CustomerProofreadersAddForm onAdd={addProofreader} />
        </div>
      </div>
    </div>
  );
}

export default CustomerProofreaders;
