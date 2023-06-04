const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _PORT = process.env.PORT;
const cors = require('cors');


app.use(cors());
app.use(express.json());

const jwt =require('jsonwebtoken');

const username = process.env.USERNAME,
      password = process.env.PASSWORD,
      database = process.env.DB;


const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.lvxegb7.mongodb.net/${database}?retryWrites=true&w=majority`);




// Commande && Article MODEL
const CommandeModel = require('./models/Commande');
const ArticleModel = require('./models/Article');
// Incomes && exponses MODEL
const Incomesmodel = require('./models/Incomes');
const ExponseModel = require('./models/Exponses');
// get request
app.get("/commande", async (req, res) => {
  async function checkDeliverDate() {
    const today = new Date();
    const threeDaysLater = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    const twoDaysLater = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
    const oneDayLater = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
    const result3 = await CommandeModel.find({ date_livraison: { $gte: threeDaysLater } });
    const result2 = await CommandeModel.find({ date_livraison: { $gte: twoDaysLater, $lt: threeDaysLater } }).exec();
    const result1 = await CommandeModel.find({ date_livraison: { $gte: oneDayLater, $lt: twoDaysLater } }).exec();
    const deliveries = {
      threeDays: result3,
      twoDays: result2,
      oneDay: result1,
    };
    setInterval(() => checkDeliverDate(), 24 * 60 * 60 * 1000);
    return res.json(deliveries);
  }
  checkDeliverDate();
})
// get Article
app.get('/api/articles', (req, res) => {
  ArticleModel.find()
    .then(articles => res.json(articles))
    .catch(error => console.log(error));
});
// post Article
app.post('/api/articles', async (req, res) => {
  const article = new ArticleModel(req.body);
  article.save()
    .then(article => res.json(article))
    .catch(error => console.log(error));
});
// get the single Article
app.get('/api/articles/:id', (req, res) => {
  ArticleModel.findById(req.params.id)
    .then(articles => res.json(articles))
    .catch(error => console.log(error));
});
// Get all commands
app.get('/api/commands', async (req, res) => {
  const filter = {};
  if (req.query.search) {
    filter.nom_client = { $regex: req.query.search, $options: 'i' };
  }
  if (req.query.date && req.query.endDate) {
    const start = new Date(req.query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.query.endDate);
    end.setHours(23, 59, 59, 999);
    filter.date_livraison = { $gte: start, $lte: end };
  }
  CommandeModel.find(filter)
    .then((commands) => res.send(commands))
    .catch((error) => console.log(error));
});
// post the commande
app.post('/api/commandes', (req, res) => {
  const commande = new CommandeModel(req.body);
  commande.save()
    .then(commande => res.json(commande))
    .catch(error => console.log(error));
});
// get the single commande
app.get('/api/commandes/:id', async (req, res) => {
  const order = await CommandeModel.findById(req.params.id).populate('lignes_commande.id_article');
  if (order) {
    const transformedOrder = {
      ...order._doc,
      date_livraison: new Date(order.date_livraison).toISOString().slice(0, 10),
      date_commande: new Date(order.date_commande).toISOString().slice(0, 10)
    }
    res.json(transformedOrder);
  } else {
    res.status(404).send('Order not found');
  }
});
//Update commande
app.put('/api/commandes/:id', async (req, res) => {
  try {
    const order = await CommandeModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    Object.assign(order, req.body);
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// delete the commande by id
app.delete('/api/commands/:id', async (req, res) => {
  const commande = await CommandeModel.findByIdAndDelete(req.params.id);
  const { nom_client, date_commande, montant_total } = commande;
    const income = new Incomesmodel({
      costumer_name: nom_client,
      date_Income: date_commande,
      montant_Income: montant_total,
    });
    await income.save();
  res.sendStatus(204);
});

// get all incomes
app.get('/api/incomes', (req, res) => {
  const filter = {};
  if (req.query.search) {
    filter.costumer_name = { $regex: req.query.search, $options: 'i' };
  }
  if (req.query.date && req.query.endDate) {
    const start = new Date(req.query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.query.endDate);
    end.setHours(23, 59, 59, 999);
    filter.date_Income = { $gte: start, $lte: end };
  }
  Incomesmodel.find(filter)
    .then((incomes) => res.send(incomes))
    .catch((error) => console.log(error));
});
// post the incomes
app.post('/api/incomes', (req, res) => {
  const income = new Incomesmodel(req.body);
  income.save()
    .then(income => res.json(income))
    .catch(error => console.log(error));
});
// delete the incomes by id
app.delete('/api/incomes/:id', async (req, res) => {
  await Incomesmodel.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});
// Update incomes by id
app.put("/api/incomes/:id", (req, res) => {
  Incomesmodel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      date_Income: req.body.date_Income,
      montant_Income: req.body.montant_Income,
      costumer_name: req.body.costumer_name,
    }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});
// get all exponse
app.get('/api/exponse', (req, res) => {
  const filter = {};
  if (req.query.search) {
    filter.supplier_name = { $regex: req.query.search, $options: 'i' };
  }
  if (req.query.date) {
    const start = new Date(req.query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.query.date);
    end.setHours(23, 59, 59, 999);
    filter.date_Exponse = { $gte: start, $lte: end };
  }
  ExponseModel.find(filter)
    .then((incomes) => res.send(incomes))
    .catch((error) => console.log(error));
});
//create a new exponse
app.post('/api/exponse', (req, res) => {
  const exponse = new ExponseModel(req.body);
  exponse.save()
    .then(exponse => res.json(exponse))
    .catch(error => console.log(error));
});
// delete the exponse by id
app.delete('/api/exponse/:id', async (req, res) => {
  await ExponseModel.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});
// Update exponse by id
app.put("/api/exponse/:id", (req, res) => {
  ExponseModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      date_Exponse: req.body.date_Exponse,
      montant_Exponse: req.body.montant_Exponse,
      supplier_name: req.body.supplier_name,
    }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});
const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth());
const endOfMonth = new Date(today.getFullYear(), today.getMonth()+1);

const incomePipeline = [
  { $match: { date_Income: { $gte: startOfMonth, $lt: endOfMonth } } },
  {
    $group: {
      _id: { year: { $year: "$date_Income" }, month: { $month: "$date_Income" } },
      total_amount: { $sum: "$montant_Income" },
    },
  },
  { $project: { _id: 0, year: "$_id.year", month: "$_id.month", total_amount: 1 } },
  { $sort: { year: 1, month: 1 } }
];

const expensePipeline = [
  { $match: { date_Exponse: { $gte: startOfMonth, $lt: endOfMonth } } },
  {
    $group: {
      _id: { year: { $year: "$date_Exponse" }, month: { $month: "$date_Exponse" } },
      total_amount: { $sum: "$montant_Exponse" },
    },
  },
  { $project: { _id: 0, year: "$_id.year", month: "$_id.month", total_amount: 1 } },
  { $sort: { year: 1, month: 1 } }
];
const commandePipeline = [
  { $match: { date_commande: { $gte: startOfMonth, $lt: endOfMonth } } },
  {
    $group: {
      _id: { year: { $year: "$date_commande" }, month: { $month: "$date_commande" } },
      total_amount: { $sum: "$montant_total" },
    },
  },
  { $project: { _id: 0, year: "$_id.year", month: "$_id.month", total_amount: 1 } },
  { $sort: { year: 1, month: 1 } }
];
// total month Commande
app.get('/api/CommandeTotal', async (req, res) => {
  const results = await CommandeModel.aggregate(commandePipeline);
  return res.json(results);
});
// total month Incomes
app.get('/api/IncomesTotal', async (req, res) => {
  const results = await Incomesmodel.aggregate(incomePipeline);
  return res.json(results);
});
// total month Exponses
app.get('/api/ExponsesTotal', async (req, res) => {
  const results = await ExponseModel.aggregate(expensePipeline);
  return res.json(results);
});

// ADMINS MODEL
const AdminModel = require('./models/Admin');

// Register Admin
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminModel.findOne({ username });
  admin &&  res.json({message:"Admin alreayd exists!"})
    
  const hashedPassword = bcrypt.hashSync(password,10)

  const newAdmin = new AdminModel({
    username,
    password:hashedPassword
  });
  await newAdmin.save();
  return res.json({message:"Admin creted succefuly!"});
});
//login function
app.post("/login", async (req,res)=>{
  const { username, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ username });
    !admin &&  res.json({ success: false });
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    !isPasswordValid && res.json({ success: false });
    const token = jwt.sign({id:admin._id},"ayoub")
    return res.status(200).json({token, adminID: admin._id});
  } catch(err) {
    console.log("showing errors" , err);
  } 

});

app.listen(_PORT,()=>{
    console.log('Server works');
})