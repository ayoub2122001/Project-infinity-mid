import React, { useEffect, useState } from 'react'
import {AiOutlinePlus} from 'react-icons/ai'
import "./Orders.css";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdDeleteForever, MdModeEditOutline } from 'react-icons/md';
function Orders() {
  const [search,setSearch] = useState('');
  const [date,setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [commands, setCommands] = useState([]);
  const api = "http://localhost:9000";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/commands`, {
          params: {
            search,
            date,
            endDate,
          },
        });
        setCommands(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [search, date, endDate]);
  useEffect(()=>{

  },[commands]);
// -------------------------------------------------------deleteCommande----------------------------
  const  deleteCommande =   (id) =>{
  
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    )    
    axios.delete(`${api}/api/commands/${id}`)
    .then(res => {
      console.log(res)
    })
    .catch(error => {
      console.log(error)
      }
     );
     setCommands(commands.filter((command) => command._id !== id));
  }
  function getDeliveryColor(status) {
    if (status ==="completed") {
      return '#62CDFF';
    } else if (status ==="inProgress") {
      return '#7AA874';
    } else {
      return '#394867';
    }
  }

  return (
    <div className='container'>
        <div className='header '>
            <h1 className='Order-h1'>Orders</h1>
            <div className='buttons'>
              <Link to='/addOrders'>
                <button className='type-2'><span className='incon-span'><AiOutlinePlus /></span>New Orders</button>
              </Link>
            </div>
        </div>
        <hr className='line'></hr>
        <div className='filtring'>
          <input type='search' value={search} onChange={e=>{setSearch(e.target.value)}} placeholder='Search order' className='search-input'/>
          <div className='filters'>
            <input type='date' value={date} onChange={e=>{setDate(e.target.value)}}/>
            <input type='date' value={endDate} onChange={e=>{setEndDate(e.target.value)}} />
          </div>
        </div>
        <hr className='line'></hr> 
        <div>
          <table className="table shadow p-3 mb-5 bg-body-tertiary rounded">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Costumer</th>
              <th scope="col">Items</th>
              <th scope="col">Delivery date</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {commands.map((command) => (
            <tr key={command._id}>
              <td>{command.id}</td>
              <td>{command.nom_client}</td>
              <td>{command.lignes_commande.length}</td>
              <td>{command.date_livraison ? new Date(command.date_livraison).toLocaleDateString() : '-'}</td>
              <td>{command.montant_total}</td>
              <td className='text-center'><div style={{ backgroundColor: getDeliveryColor(command.status) }} className='status-div'>{command.status}</div></td>
              <td className='text-center'>
                <button className='btn btn-danger' onClick={()=>deleteCommande(command._id)}><MdDeleteForever /></button>
                <Link to={`/updateOrders/${command._id}`}>
                  <button className='btn btn-success'><MdModeEditOutline /></button>
                </Link>
                <Link to={`/invoice/${command._id}`}>
                  <button className='btn btn-success'>imprimer</button>
                </Link>
                
              </td>

            </tr>
          ))}
          </tbody>
        </table>
        </div>
    </div>
  )
}

export default Orders