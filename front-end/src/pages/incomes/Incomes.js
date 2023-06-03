import React, { useEffect, useState } from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import "./incomes.css";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MdModeEditOutline,MdDeleteForever} from "react-icons/md";
import axios from 'axios';

function Incomes() {
  const [search,setSearch] = useState('');
  const [date,setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [click,setClick] = useState(false);
  const [incomes,setIncomes] = useState([]);
  const api = "http://localhost:9000";
  const [add,setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState(null);
  const [reloadIncoms,setReloadIncoms] = useState(false);
  const handelClick =() =>{
    setAdd(true);
    setEdit(false);
  }
  const handleEditClick = (id, name,montant,date) => {
    const date2 = new Date(date).toISOString().slice(0, 10)
    const income = {id, name,montant,date2};
    setAdd(true);
    setEdit(true);
    setIncomeToEdit(income);
  }
  const addIncome = (income) => {
    axios.post(`${api}/api/incomes`, income)
    .then((response) => {
      console.log(response.data);
      setAdd(false);
    })
    .catch((error) => console.log(error));
    reloadIncoms ? setReloadIncoms(false) : setReloadIncoms(true);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/incomes`, {
          params: {
            search,
            date,
            endDate,
          },
        });
        setIncomes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [search, date, endDate,reloadIncoms]);
  const deleteIncomes = (id) =>{
    setClick(false);
    axios.delete(`${api}/api/incomes/${id}`)
    .then(res => console.log(res))
    .catch(error => console.log(error));
    setIncomes(incomes.filter((income) => income._id !== id));
  }
  const updateIncome = (income) => {
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    );
    axios.put(`${api}/api/incomes/${income._id}`, income)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => console.log(error));
    setAdd(false);
    setIncomeToEdit(null);
    reloadIncoms ? setReloadIncoms(false) : setReloadIncoms(true);
  }
  const handelClickDelete = ()=>{
    setClick(true);
  }
  return (
    <div className='container mt-4'>
      {!click ? 
        <div className="alert">
          <span className="closebtn" onClick={()=>{handelClickDelete()}}>&times;</span> 
          <strong>Danger!</strong> Indicates a dangerous or potentially negative action.
        </div> : null}
        <div className='header'>
            <h1 className='Incomes-h1'>Incomes</h1>
            <div className='buttons'>
              <button className='type-2' onClick={handelClick}><span className='incon-span'><AiOutlinePlus /></span>New Income</button>
            </div>
        </div> 
        {add ? <NewIncome addIncome={addIncome} updateIncome={updateIncome} incomeToEdit={incomeToEdit} edit={edit}  /> : null}
        <hr className='line'></hr>
        <div className='filtring'>
          <input type='search' placeholder='Search Income' value={search} onChange={e=>{setSearch(e.target.value)}} className='search-input'/>
          <div className='filters'>
            <input type='date' value={date} onChange={e=>{setDate(e.target.value)}} />
            <input type='date' value={endDate} onChange={e=>{setEndDate(e.target.value)}} />
          </div>
        </div>
        <hr className='line'></hr>
        <div>
          <table className="table shadow p-3 mb-5 bg-body-tertiary rounded">
          <thead>
            <tr>
              <th scope="col">Income ID</th>
              <th scope="col">Costumer</th>
              <th scope="col">The Total</th>
              <th scope="col">Date</th>
              <th scope="col">Edit or Delete</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {incomes.map(({_id,costumer_name,montant_Income,date_Income},index)=>{
              return (
              <tr key={_id}>
                <td>{index +1}</td>
                <td>{costumer_name}</td>
                <td>{montant_Income}</td>
                <td>{date_Income ? new Date(date_Income).toLocaleDateString() : '-'}</td>
                <td className='text-center'>
                  <button className='btn btn-success' onClick={()=>handleEditClick(_id,costumer_name,montant_Income,date_Income)}><MdModeEditOutline /></button>
                  <button className='btn btn-danger' onClick={()=>deleteIncomes(_id)}><MdDeleteForever/></button>
                </td>
              </tr>)
            })}
          </tbody>
        </table>
        </div>
    </div>
  )
}
const NewIncome = ({addIncome, updateIncome, incomeToEdit, edit}) => {
  const [nameCostumer, setNameCostumer] = useState("");
  const [total, setTotal] = useState();
  const [date1, setDate1] = useState();
  useEffect(() => {
    if (incomeToEdit) {
      setNameCostumer(incomeToEdit.name);
      setTotal(incomeToEdit.montant);
      setDate1(incomeToEdit.date2);
    }
  }, [incomeToEdit]);
  const handelClick = (e) => {
    e.preventDefault();
    const income = { costumer_name : nameCostumer, montant_Income : total, date_Income : date1 };
    if (edit) {
      income._id = incomeToEdit.id;
      updateIncome(income);
    } else {
      const newIncome = {
          costumer_name: nameCostumer,
          montant_Income: total,
          date_Income: date1
        };
      addIncome(newIncome);
    }
    setNameCostumer("");
    setTotal("");
    setDate1("");
  };
  return (
    <>
      <form onSubmit={handelClick}>
        <div className="form-row">
        <div className="col-md-6 ">
          <label for="inputNameProd" className="form-label">
            Costumer Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputNameProd"
            value={nameCostumer}
            onChange={(e) => {
              setNameCostumer(e.target.value);
            }}
            placeholder="Costumer Name"
          />
        </div>
        <div className="col-md-6 ">
          <label for="inputUnti" className="form-label">
            Total
          </label>
          <input
            type="number"
            className="form-control "
            id="inputUnti"
            value={total}
            onChange={(e) => {
              setTotal(e.target.value);
            }}
            placeholder="Number Total"
          />
        </div>
        <div className="col-md-6">
          <label for="inputUnti" className="form-label">
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
          {edit ? 'Save Changes' : 'Add Income'}
          </button>
        </div>
        </div>
      </form>
    </>
  );
};
export default Incomes;