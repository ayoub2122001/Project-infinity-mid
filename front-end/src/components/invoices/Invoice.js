import React, { useEffect, useState } from 'react';
import "./Invoice.css";
import axios from 'axios';
import { useParams } from "react-router-dom";
const Invoice = () => {
  const date = new Date();
  const [lignesCommande, setLignesCommande] = useState([]);
  const [montantTotal,setMontantTotal] = useState();
  const [nomClient,setNomClient] = useState('');
  const [dateLivraison,setDateLivraison] = useState('');
  const api = "http://localhost:9000";
  const { id } = useParams();
  const handlePrintInvoice = () => {
    const printContent = document.getElementById("invoice-content");
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    document.body.innerHTML = originalContent;
    window.print();    
  };
  useEffect(() => {
    axios
      .get(`${api}/api/commandes/${id}`)
      .then((response) => {
        const { nom_client, date_livraison,montant_total, date_commande, lignes_commande } =  response.data;
        setLignesCommande(lignes_commande);
        setMontantTotal(montant_total);
        setNomClient(nom_client);
        setDateLivraison(date_livraison);
      })
      .catch((error) => console.log(error));
  }, [api, id]);

  const handlePrintDeliveryNote = () => {
    // Logique pour imprimer la note de livraison
    window.print();
  };
  return (
    <div className="invoice" id="invoice-content">
      <div className="invoice-header">
        <h2>Facture</h2>
        <span className="hide-url">Date: {date.toLocaleDateString()}</span>
      </div>
      <div className="invoice-details">
        <div>
          <h3>Client:</h3>
          <p>Nom du client : {nomClient}</p>
          <p>Ville : Tanger, Code postal : 90000</p>
          <p>Date Livraison : {dateLivraison}</p>
        </div>
        <div>
          <h3>Entreprise:</h3>
          <p> Infinity Media</p>
          <p>Adresse de l'entreprise</p>
          <p>Ville : Tanger, Code postal : 90000</p>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Nom Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {lignesCommande.map((ligne) => (
        <tr key={ligne.id}>
          <td>{ligne.id_article.nom_article}</td>
          <td>{ligne.quantite}</td>
          <td>{ligne.id_article.prix_unitaire}</td>
          <td>{ligne.montant_ligne}</td>
        </tr>
      ))}
        </tbody>
      </table>
      <div className="invoice-total">
        <strong>Total: {montantTotal}€</strong>
      </div>
      <div className="buttons">
        <button className='type-1' onClick={handlePrintInvoice}>Imprimer Facture</button>
        <button className='type-2' onClick={handlePrintDeliveryNote}>Imprimer Note de Livraison</button>
      </div>
    </div>
  );
};

export default Invoice;