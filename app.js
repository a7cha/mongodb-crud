const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Item = require('./models/items')
require('dotenv').config()

app.use(express.urlencoded({ extended : true}));

const mongodb = process.env.DB_SERVER
mongoose.connect(mongodb, { useNewUrlParser : true, useUnifiedTopology : true})
	.then(() => {		
		console.log('connected')
		app.listen(3000)
	}).catch( err => {
		console.log(err)
		app.render('error')
	})

app.set('view engine', 'ejs')

app.get('/',(req, res) => {
	res.redirect('/get-items');
})

app.get('/create-item', (req, res) => {
	const item = new Item({
		name : 'rog phone',
		price : 10000
	});
 
	item.save()
	.then(result => {
		res.send(result)
	}).catch( err => {
		console.log(err)
	})
})

app.get('/get-items', (req, res) => {

	Item.find()
	.then(result => {
		res.render('index',{items : result})
	}).catch(err => {
		console.log(err)
	})
})

app.get('/get-item', (req, res) => {

	Item.findById('5fd7141012dfa1a4f9544042')
	.then(result => {
		res.send(result)
	}).catch(err => {
		console.log(err)
	})
})

app.get('/add-item', (req,res) => {
	res.render('add-item')
})


app.get('/items/:id',(req, res) => {	
	const id = req.params.id;
	Item.findById(id).then(result => {
		console.log("result" , result)
		res.render('item-detail',{ item : result})
	})
})

app.delete('/items/:id',(req, res) => {	
	const id = req.params.id;
	Item.findByIdAndDelete(id).then(result => {
		res.json({redirect : '/get-items'})
	}).catch(err => {
		console.log(err)
	})
})

app.put('/items/:id',(req, res) => {	
	const id = req.params.id;
	Item.findByIdAndUpdate(id, req.body).then(result => {
		res.json({msg : 'Update Successfully'})
	}).catch(err => {
		console.log(err)
	})
})

app.post('/items',(req, res) => {	
	console.log(req.body)
	const item = Item(req.body)
	item.save().then(() => {
		res.redirect('/get-items')
	}).catch(err => {
		console.log(err)
	})
})

app.use((req,res) => {
	res.render('error')
})