const {Schema,model} = require("mongoose")

const ArticleSchema = new Schema({
    // _id :{
    //     _id:false
    // },
    id : {
        type : String,
        required: true,
        unique:true,
    },
    nom_article : {
        type : String,
        required: true
    },
    prix_unitaire : {
        type : Number
    }
})

const Article =  model("Article",ArticleSchema)
module.exports = Article