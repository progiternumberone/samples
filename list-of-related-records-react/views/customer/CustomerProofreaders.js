import React, { useEffect, useState, useContext } from 'react';
import { Dropdown } from 'primereact/dropdown';
import ActiveUserContext from '../../ActiveUserContext';
import DeleteButton from '../../component/button/DeleteButton';
import CustomerProofreadersAddForm from './CustomerProofreadersAddForm';

function CustomerProofreaders() {
  const [proofreaders, setProofreaders] = useState([]);
  const [allProofreaders, setAllProofreaders] = useState([]);
  
  const { activeUser, setActiveUser } = useContext(ActiveUserContext);

  const fetchProofreaders = () => {
    fetch(process.env.REACT_APP_API_URL_CUSTOMER_PROOFREADER)
      .then(response => response.json())
      .then(data => setProofreaders(data));
  };
  const fetchAllProofreaders = () => {
    fetch(process.env.REACT_APP_API_URL_PROOFREADER)
      .then(response => response.json())
      .then(data => {
        //add cust_all to each proofreader, it will contain the full name and email
        data.forEach(p => {
          p.cust_all = `${p.cust_firstname} ${p.cust_lastname} ${p.cust_email} ${p.id}`;
        });
        setAllProofreaders(data);
      });
  };

  useEffect(() => {
    // Fetch the proofreaders from your API
    fetchProofreaders();
    fetchAllProofreaders();
  }, []);

  // Define a function to delete a proofreader
  const deleteProofreader = (id) => {
    // Send a DELETE request to your API
    fetch(`${process.env.REACT_APP_API_URL_CUSTOMER_PROOFREADER}?id=${id}`, {
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
    fetch(process.env.REACT_APP_API_URL_CUSTOMER_PROOFREADER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: proofreaderId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          // If the proofreader was successfully added, update the list of proofreaders
          fetchProofreaders();
        } else if (data.result === 'error') {
          alert(data.message);
        }
      });
  }

  //create proofreaderOptionTemplate
  const proofreaderOptionTemplate = (option) => {
    return (
      <div className="proofreader-item">
        <div>
          {option.cust_firstname} {option.cust_lastname} | {option.cust_email}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Proofreaders for {activeUser?.cust_firstname} {activeUser?.cust_lastname} {activeUser?.cust_company}</h1>
      {/* showdropdown of proofreaders */}
      <Dropdown options={allProofreaders.filter(p => proofreaders.filter(p2 => p2.pnc_preafrooder_id ===p.id).length ===0 )} onChange={(e) => addProofreader(e.value)} optionValue="id" placeholder="Select a Proofreader to Add"
        itemTemplate={proofreaderOptionTemplate} filter optionLabel="cust_all" />
      <hr />
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
    </div>
  );
}

export default CustomerProofreaders;
