import axios from "axios";
import React, { useEffect, useState } from "react";
import {GiReceiveMoney} from "react-icons/gi";
import './Card.css';
const Curd = () => {
  const [IncomesTotal,setIncomesTotal] = useState([]);
  const [ExponsesTotal,setExponsesTotal] = useState([]);
  const [CommandeTotal,setCommandeTotal] = useState([]);
  const api = "http://localhost:8080";
  useEffect(() => {
    axios.get(`${api}/api/IncomesTotal`)
    .then((response) => {
      setIncomesTotal(response.data[0].total_amount);
      console.log(response);
    });
  }, [IncomesTotal]);
  useEffect(() => {
    axios.get(`${api}/api/ExponsesTotal`)
    .then((response) => {
      setExponsesTotal(response.data[0].total_amount);
    });
  }, [ExponsesTotal]);
  useEffect(() => {
    axios.get(`${api}/api/CommandeTotal`)
    .then((response) => {
      setCommandeTotal(response.data[0].total_amount);
    });
  }, [CommandeTotal]);
  const cardDetilse = [{title: "Total Month",icon: <GiReceiveMoney />,cName: IncomesTotal-ExponsesTotal},{title: "Income",icon: <GiReceiveMoney />,cName: IncomesTotal},
  {title: "Orders",icon: <GiReceiveMoney />,cName: CommandeTotal},
  {title: "Exponses",icon: <GiReceiveMoney />,cName: ExponsesTotal}];
  
  return (
    <>
        {cardDetilse.map((item, index) => {
              return (
                  <div className='card shadow p-3 mb-5 bg-body-tertiary' key={index}>
                    <div className='top'>
                        <h2 className='name'>{item.title}</h2>
                    </div>
                    <div className='bottom grid fs-3 d-flex justify-content-between'>
                        <h2 className='text-right mx-2'>{item.icon}</h2>
                        <h2 className='text-left'>{item.cName}</h2>
                    </div>
                  </div>
              );
            })}
    </>
  );
};

export default Curd;
