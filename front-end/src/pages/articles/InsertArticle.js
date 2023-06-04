import React, { useState } from "react";
import axios from "axios";
import "./article.css";
const InsertArticle = () => {
  const [id, setId] = useState("");
  const [nomArticle, setNomArticle] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const api = "http://localhost:9000";
  const handleSubmit = async (e) => {
    e.preventDefault();

    const articleData = {
      id: id,
      nom_article: nomArticle,
      prix_unitaire: prixUnitaire,
    };

    try {
      await axios.post(`${api}/api/articles`, articleData);
      console.log("Article inserted successfully!");
      // Reset form fields
      setId("");
      setNomArticle("");
      setPrixUnitaire("");
    } catch (error) {
      console.error("Error inserting article:", error);
    }
  };

  return (
    <>
      <div className="container">
      <div>
        <h1 className="text-center form-yy">
        Insert Article{" "}
        </h1>
      </div>
        <form className="row g-2 form-yy" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="col-md-12">
              <label htmlfor="id" className="form-label">
                ID:
              </label>
              <input
                type="text"
                className="form-control"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                placeholder="ID Article"
              />
            </div>
            <div className="col-md-12">
              <label htmlfor="nom_article" className="form-label">
                Nom de l'article:
              </label>
              <input
                className="form-control"
                type="text"
                id="nom_article"
                value={nomArticle}
                onChange={(e) => setNomArticle(e.target.value)}
                required
                placeholder="Nom article"
              />
            </div>
            <div className="col-md-12">
              <label htmlfor="prix_unitaire" className="form-label">
                Prix unitaire:
              </label>
              <input
                className="form-control"
                type="number"
                id="prix_unitaire"
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(e.target.value)}
                placeholder="Prix Unitaire"
              />
            </div>
            <div className="col-12 mt-3">
              <button type="submit" className="btn btn-primary b-3">
                Insérer l'article
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default InsertArticle;
