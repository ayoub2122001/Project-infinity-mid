import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Addorders.css";
import { useNavigate } from "react-router-dom";
function AddOrders() {
  const api = "http://localhost:8080";
  const [nucommande, setUnCommande] = useState();
  const [nomClient, setNomClient] = useState('');
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
    const commande = { id : nucommande, nom_client: nomClient, date_livraison: dateLivraison,date_commande: request, montant_total: montantTotal, lignes_commande: lignesCommande };
    if (nucommande && lignesCommande && request) {
      axios.post(`${api}/api/commandes`, commande)
      .then(response => console.log(response.data))
      .catch(error => console.log(error));
      Navigate('/orders');
    }
    
  };
  return (
    <>
    <div className=" container">
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
        <div className="row col-md-6 g-2 mt-3">
          {lignesCommande.map((ligne, index) => (
          <div key={index} className="col-md-12 mt-3">
            <select className='form-select' name="id_article" value={ligne.id_article} onChange={(e) => handleLigneCommandeChange(e, index)}>
              <option value="">-- Choisissez un article --</option>
              {articles.map(article => (
                <option key={article._id} value={article._id}>{article.nom_article} (${article.prix_unitaire})</option>
              ))}
            </select>
            <div className="col-md-12">
              <label for="inputQuantite" className="form-label">
                Quantite
              </label>
                <input className="form-control" type="number" name="quantite" value={ligne.quantite} onChange={(e) => handleLigneCommandeChange(e, index)} />
            </div>
            <div className="col-md-12">
              <label for="inputMontant" className="form-label">
                Montant ligne
              </label>
              <input className="form-control" type="number" name="montant_ligne" value={ligne.quantite * articles.find(a=>a._id===ligne.id_article)?.prix_unitaire ||''} readOnly />
            </div>
            <div className="col-md-12 justify-content-md-center">
              <button type="button" onClick={() => handleRemoveLigneCommande(index)} className="btn col-md-6 mt-3 btn-danger w-50">Supprimer</button>
            </div>
          </div>
        ))} 
        </div>
        <div className="col-md-6 mt-5 w-50 justify-content-md-center">
          <button type="button" onClick={handleAddLigneCommande} className="btn col-md-6 btn-primary">Ajouter une ligne de commande</button>
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
