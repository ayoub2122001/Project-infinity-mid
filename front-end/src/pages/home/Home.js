import React, { useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import "./home.css";
function Home() {
  const api = "http://localhost:8080";
  const [commande, setCommande] = useState([])
  // useEffect(() => {
  //   Axios.get(`${api}/commande`)
  //     .then(res => console.log(res.data))
  // }, [])
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${api}/commande`);
      const data = await response.json();
      setCommande(data);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [commande]);
  useEffect(() => {
    const today = new Date().getTime();
    const filteredCmd = commande.filter((cmd) => cmd.date_livraison !== today);
    setCommande(filteredCmd);
  }, []);
  function getDeliveryColor(date) {
    const deliveryDate = new Date(date);
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 3) {
      return 'blue';
    } else if (diffDays > 2) {
      return 'green';
    } else {
      return 'red';
    }
  }
  return (
    <>
    <div className="row justify-content-center">
      <Card />
      <hr className="my-5"/>
      <div><h1 className="text-center">Orders Alert</h1></div>
      <table className="table shadow p-3 mb-5 bg-body-tertiary rounded tb-table">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Date-DeV</th>
            <th scope="col">Name Client</th>
            <th scope="col">Stay</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
        {Object.entries(commande).map(([key, deliveries]) =>
            deliveries.map((delivery) => (
              <tr key={delivery._id}>
                <td>{delivery.id}</td>
                <td style={{ color: getDeliveryColor(delivery.date_livraison) }}>
                  {delivery.date_livraison}
                </td>
                <td>{delivery.nom_client}</td>
                <td>{key}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

  </>
  );
}

export default Home;
