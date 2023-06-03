import React, { useEffect, useState } from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import "./exponses.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {MdModeEditOutline,MdDeleteForever} from "react-icons/md"
import axios from 'axios';

function Exponses() {
  const [search,setSearch] = useState('');
  const [date,setDate] = useState('');
  const [exponses,setExponses] = useState([]);
  const [reloadExponses,setReloadExponses] = useState(false);
  const api = "http://localhost:9000";
  const [add,setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [exponseToEdit, setExponseToEdit] = useState(null);
  const handelClick =() =>{
    setAdd(true);
    setEdit(false);
  }
  const handleEditClick = (id, name,montant,date) => {
    const date2 = new Date(date).toISOString().slice(0, 10)
    const exponse = {id, name,montant,date2};
    setAdd(true);
    setEdit(true);
    setExponseToEdit(exponse);
  }
  const addExponse = (exponse) => {
    axios.post(`${api}/api/exponse`, exponse)
    .then((response) => {
      console.log(response.data);
      setAdd(false);
    })
    .catch((error) => console.log(error));
    reloadExponses ? setReloadExponses(false) : setReloadExponses(true);
  }
  useEffect(() => {
    axios.get(`${api}/api/exponse`,{params : {search,date}})
    .then((response) => {
      setExponses(response.data);
    });
  }, [search,date,reloadExponses]);
  const deleteExponse = (id) =>{
    axios.delete(`${api}/api/exponse/${id}`)
    .then(res => console.log(res))
    .catch(error => console.log(error));
    setExponses(exponses.filter((exponse) => exponse._id !== id));
  }
  const updateExponse = (exponse) => {
    axios.put(`${api}/api/exponse/${exponse._id}`, exponse)
    .then((response) => {
      console.log('he is updated');
    })
    .catch((error) => console.log(error));
    setAdd(false);
    setExponseToEdit(null);
    reloadExponses ? setReloadExponses(false) : setReloadExponses(true);
  }
  return (
    <div className='container mt-4'>
        <div className='header'>
            <h1 className='Incomes-h1'>Exponses </h1>
            <div className='buttons'>
              <button className='type-2' onClick={handelClick}><span className='incon-span'><AiOutlinePlus /></span>New Exponse</button>
            </div>
        </div> 
        {add ? <NewExponse addExponse={addExponse} updateExponse={updateExponse} exponseToEdit={exponseToEdit} edit={edit}  /> : null}
        <hr className='line'></hr>
        <div className='filtring'>
          <input type='search' placeholder='Search Income' value={search} onChange={e=>{setSearch(e.target.value)}} className='search-input'/>
          <div className='filters'>
            <input type='date' value={date} onChange={e=>{setDate(e.target.value)}} />
          </div>
        </div>
        <hr className='line'></hr> 
        <div>
          <table className="table shadow p-3 mb-5 bg-body-tertiary rounded">
          <thead>
            <tr>
              <th scope="col">Exponse ID</th>
              <th scope="col">Supplier name</th>
              <th scope="col">The Total</th>
              <th scope="col">Date</th>
              <th scope="col">Edit or Delete</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {exponses.map(({_id,supplier_name,montant_Exponse,date_Exponse},index)=>{
              return (
              <tr key={_id}>
                <td>{index +1}</td>
                <td>{supplier_name}</td>
                <td>{montant_Exponse}</td>
                <td>{date_Exponse ? new Date(date_Exponse).toLocaleDateString() : '-'}</td>
                <td className='text-center'>
                  <button className='btn btn-success' onClick={()=>handleEditClick(_id,supplier_name,montant_Exponse,date_Exponse)}><MdModeEditOutline /></button>
                  <button className='btn btn-danger' onClick={()=>deleteExponse(_id)}><MdDeleteForever/></button>
                </td>
              </tr>)
            })}
          </tbody>
        </table>
        </div>
    </div>
  )
}
const NewExponse = ({addExponse, updateExponse, exponseToEdit, edit}) => {
  const [nameSupplier, setNameSupplier] = useState("");
  const [total, setTotal] = useState();
  const [date1, setDate1] = useState();
  useEffect(() => {
    if (exponseToEdit) {
      setNameSupplier(exponseToEdit.name);
      setTotal(exponseToEdit.montant);
      setDate1(exponseToEdit.date2);
    }
  }, [exponseToEdit]);
  const handelClick = (e) => {
    e.preventDefault();
    const exponse = { supplier_name : nameSupplier, montant_Exponse : total, date_Exponse : date1 };
    if (edit) {
      exponse._id = exponseToEdit.id;
      updateExponse(exponse);
    } else {
      if (nameSupplier === '' || total === '' || date1 === '') {
          alert('Please fill all the fields');
          return;
        }
      const newExponse = {
        supplier_name: nameSupplier,
          montant_Exponse: total,
          date_Exponse: date1
        };
      addExponse(newExponse);
    }
    setNameSupplier("");
    setTotal("");
    setDate1("");
  };
  return (
    <>
      <form onSubmit={handelClick}>
        <div className="form-row">
        <div className="col-md-6 ">
          <label htmlfor="inputNameSupplier" className="form-label">
            Supplier Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputNameSupplier"
            value={nameSupplier}
            onChange={(e) => {
              setNameSupplier(e.target.value);
            }}
            required
            placeholder="Supplier Name"
          />
        </div>
        <div className="col-md-6 ">
          <label htmlfor="inputTotal" className="form-label">
            Total
          </label>
          <input
            type="number"
            className="form-control "
            id="inputTotal"
            value={total}
            onChange={(e) => {
              setTotal(e.target.value);
            }}
            placeholder="Number Total"
          />
        </div>
        <div className="col-md-6">
          <label htmlfor="inputUnti" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="inputUnti"
            value={date1}
            onChange={(e) => {
              setDate1(e.target.value);
            }}
          />
        </div>
        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary b-3">
          {edit ? 'Save Changes' : 'Add Exponse'}
          </button>
        </div>
        </div>
      </form>
    </>
  );
};
export default Exponses;
