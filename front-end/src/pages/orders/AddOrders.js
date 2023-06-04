import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Addorders.css";
import { useNavigate } from "react-router-dom";
function AddOrders() {
  const api = "http://localhost:9000";
  const [nucommande, setUnCommande] = useState();
  const [nomClient, setNomClient] = useState('');
  const [status, setStatus] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');
  const [request, setRequest] = useState('');
  const [lignesCommande, setLignesCommande] = useState([]);
  const [articles, setArticles] = useState([]);
  const Navigate = useNavigate();
  useEffect(() => {
    axios.get(`${api}/api/articles`)
      .then(response => setArticles(response.data))
      .catch(error => console.log(error));
  }, []);  
  const handleLigneCommandeChange = (e, index) => {
    const newLignesCommande = [...lignesCommande];
    const { name, value } = e.target;
    const article = articles.find(article => article._id === newLignesCommande[index].id_article);
    const quantite = name === "quantite" ? parseInt(value) : newLignesCommande[index].quantite;
    const prixUnitaire = article ? article.prix_unitaire : 1;
    const montantLigne = quantite * prixUnitaire;
    newLignesCommande[index] = {...newLignesCommande[index], [name]: value, montant_ligne: montantLigne };
    setLignesCommande(newLignesCommande);
  };

  const handleAddLigneCommande = () => {
    setLignesCommande([...lignesCommande, { id_article: '', quantite: '', montant_ligne: '' }]);
  };

  const handleRemoveLigneCommande = (index) => {
    const newLignesCommande = [...lignesCommande];
    newLignesCommande.splice(index, 1);
    setLignesCommande(newLignesCommande);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const montantTotal = lignesCommande.reduce((total, ligne) => total + parseFloat(ligne.montant_ligne), 0);
    const commande = { id : nucommande, nom_client: nomClient, date_livraison: dateLivraison,status:status,date_commande: request, montant_total: montantTotal, lignes_commande: lignesCommande };
    if (nucommande && lignesCommande && request) {
      axios.post(`${api}/api/commandes`, commande)
      .then(response => console.log(response.data))
      .catch(error => console.log(error));
      Navigate('/orders');
    }
    
  };
  return (
    <>
    <div className="container">
      <div>
        <h1 className="text-left form-yy">
          Add Orders{" "}
        </h1>
      </div>
      <form className="row g-2 form-yy" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label for="inputName" className="form-label">
            Client Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            value={nomClient}
            onChange={(e) => {
              setNomClient(e.target.value);
            }}
            placeholder="Client Name"
          />
        </div>
        <div className="col-md-6">
          <label for="inputNum" className="form-label">
            N~Commande
          </label>
          <input
            type="number"
            className="form-control"
            id="inputNum"
            value={nucommande}
            onChange={(e) => {
              setUnCommande(e.target.value);
            }}
            required
            placeholder="N~Commande"
          />
        </div>
        <div className="col-md-6">
          <label for="inputRequest" className="form-label">
            Request date
          </label>
          <input
            type="date"
            className="form-control"
            id="inputRequest"
            value={request}
            onChange={(e) => {
              setRequest(e.target.value);
            }}
          />
        </div>
        <div className="col-md-6">
          <label for="status" className="form-label">
          Status
          </label>
          <select className='form-select' name="id_article" value={status} onChange={(e) => {setStatus(e.target.value);}}>
            <option value="">Choisissez un statut</option>
              <option value="completed">Completed</option>
              <option value="inProgress">In Progress</option>
              <option value="payed">Payed</option>
            </select>
        </div>
        <div className="col-md-6">
          <label for="inputDelivrey" className="form-label">
            Delivrey date
          </label>
          <input
            type="date"
            className="form-control"
            id="inputDelivrey"
            value={dateLivraison}
            onChange={(e) => {
              setDateLivraison(e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group col-md-12">
        <label htmlFor="lignes_commande" className="form-label">Order Items:</label>
          {lignesCommande.map((ligne, index) => (
          <div key={index} className="ligne-commande d-flex justify-content-md-center mt-3 col">
            <select className='form-select w-50 sel' name="id_article" value={ligne.id_article} onChange={(e) => handleLigneCommandeChange(e, index)}>
              <option value="">-- Choisissez un article --</option>
              {articles.map(article => (
                <option key={article._id} value={article._id}>{article.nom_article} (${article.prix_unitaire})</option>
              ))}
            </select>
            <div>
                <input className="form-control quan" type="number" name="quantite" value={ligne.quantite} onChange={(e) => handleLigneCommandeChange(e, index)} placeholder="Quantite" />
            </div>
            <div>
              <input className="form-control" type="number" name="montant_ligne" value={ligne.quantite * articles.find(a=>a._id===ligne.id_article)?.prix_unitaire ||''} placeholder="Montant Total de ligne" readOnly />
            </div>
            <div>
              <button type="button" onClick={() => handleRemoveLigneCommande(index)} className="btn d-flex justify-content-md-center btn-danger">Supprimer</button>
            </div>
          </div>
        ))} 
        </div>
        <div >
          <button type="button" onClick={handleAddLigneCommande} className="btn btn-primary mt-4">Ajouter une ligne de commande</button>
        </div>
        <div className="col-md-6 mt-3 w-50">
            <button type="submit" className="btn col-md-6 btn-primary mt-4 w-50">
              Add Order
            </button>
        </div>
      </form>
    </div>
  </>
  );
}
export default AddOrders;
