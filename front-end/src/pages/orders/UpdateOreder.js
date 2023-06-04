import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Updateorders.css";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
function UpdateOrders() {
  const api = "http://localhost:9000";
  const { id } = useParams();
  const [nomClient, setNomClient] = useState("");
  const [status, setStatus] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");
  const [request, setRequest] = useState("");
  const [lignesCommande, setLignesCommande] = useState([]);
  const [articles, setArticles] = useState([]);
  const Navigate = useNavigate();
  
  useEffect(() => {
    axios
      .get(`${api}/api/articles`)
      .then((response) => setArticles(response.data))
      .catch((error) => console.log(error));
    axios
      .get(`${api}/api/commandes/${id}`)
      .then((response) => {
        const { nom_client, date_livraison,status, date_commande, lignes_commande } =
          response.data;
        setNomClient(nom_client);
        setDateLivraison(date_livraison);
        setRequest(date_commande);
        setLignesCommande(lignes_commande);
        setStatus(status);
      })
      .catch((error) => console.log(error));
  }, [api, id]);
  const handleLigneCommandeChange = (e, index) => {
    const newLignesCommande = [...lignesCommande];
    const { name, value } = e.target;
    const article = articles.find(
      (article) => article._id === newLignesCommande[index].id_article
    );
    const quantite =
      name === "quantite" ? parseInt(value) : newLignesCommande[index].quantite;
    const prixUnitaire = article ? article.prix_unitaire : 1;
    const montantLigne = quantite * prixUnitaire;
    newLignesCommande[index] = {
      ...newLignesCommande[index],
      [name]: value,
      montant_ligne: montantLigne,
    };
    setLignesCommande(newLignesCommande);
  };

  const handleAddLigneCommande = () => {
    setLignesCommande([
      ...lignesCommande,
      { id_article: "", quantite: "", montant_ligne: "" },
    ]);
  };

  const handleRemoveLigneCommande = (index) => {
    const newLignesCommande = [...lignesCommande];
    newLignesCommande.splice(index, 1);
    setLignesCommande(newLignesCommande);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const montantTotal = lignesCommande.reduce(
      (total, ligne) => total + parseFloat(ligne.montant_ligne),
      0
    );
    const commande = {
      nom_client: nomClient,
      date_livraison: dateLivraison,
      date_commande: request,
      montant_total: montantTotal,
      lignes_commande: lignesCommande,
    };
    axios
      .put(`${api}/api/commandes/${id}`, commande)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error));
    Navigate("/orders");
  };
  return (
    <div className='container mt-4'>
      <h2 className='text-center'>Edit Order</h2>
      <form onSubmit={handleSubmit} className="row g-2 form-yy" >
        <div className='form-group col-md-6'>
          <label htmlFor="nom_client" className="form-label">Customer Name:</label>
          <input
            type="text"
            className="form-control"
            name="nom_client"
            id="nom_client"
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
            placeholder="Nom Client"
          />
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor="date_livraison" className="form-label">Delivery Date:</label>
          <input
            type="date"
            className="form-control"
            name="date_livraison"
            id="date_livraison"
            value={dateLivraison}
            onChange={(e) => setDateLivraison(e.target.value)}
          />
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor="request" className="form-label">Order Date:</label>
          <input
            type="date"
            className="form-control"
            name="request"
            id="request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor="status" className="form-label">Status Order:</label>
          <select
                name="Status"
                className='form-select'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="completed">Completed</option>
                <option value="inProgress">In Progress</option>
                <option value="payed">Payed</option>
          </select>
        </div>
        <div className='form-group col-md-12'>
          <label htmlFor="lignes_commande" className="form-label">Order Items:</label>
          {lignesCommande.map((ligne, index) => (
            <div key={index} className='ligne-commande d-flex justify-content-md-center mt-3 col'>
              <select
                name="id_article"
                className='form-select w-50 sel'
                value={ligne.id_article._id}
                onChange={(e) => handleLigneCommandeChange(e, index)}
              >
                <option value="">Select an article</option>
                {articles.map((article) => (
                  <option key={article._id} value={article._id}>
                    {article.nom_article} (${article.prix_unitaire})
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-control quan w-50"
                name="quantite"
                value={ligne.quantite}
                onChange={(e) => handleLigneCommandeChange(e, index)}
              />
              <span className='text-danger total'>
                {ligne.montant_ligne ? ligne.montant_ligne.toFixed(2) : ""}
              </span>
              <button
                type="button"
                className="btn d-flex justify-content-md-center btn-danger sel"
                onClick={() => handleRemoveLigneCommande(index)}
              >
                Remove Item
              </button>
            </div>
          ))}
          <button className="btn btn-primary mt-4" type="button" onClick={handleAddLigneCommande}>
            Add Item
          </button>
        </div>
        <div className='form-group'>
          <label htmlFor="montant_total" className="form-label">Total Amount:</label>
          <span className="montant-total">
            {lignesCommande
              .reduce(
                (total, ligne) => total + parseFloat(ligne.montant_ligne),
                0
              )
              .toFixed(2)}
          </span>
        </div>
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
}
export default UpdateOrders;
