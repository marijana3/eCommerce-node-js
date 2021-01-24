// Require
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');

var router = express.Router();
router.get('/', (req, res)=>{
    Product.find((err, docs)=>{
        if(!err) {
            res.render('menu',{
                product: docs
            });
        } else {
            console.log('Error in order: ' + err);
        }
    });
});

//GET
router.get('/product', (req, res)=>{
    if(!req.user || req.user.admin == 0){
        res.redirect('/');
    } else {
        res.render('product');
    }
});
router.get('/product/:id', (req, res)=>{
    Product.findById(req.params.id, (err, doc)=>{
        if (!err) {
            res.render("edit", {product:doc});
        } else {
            console.log('Error findbyId: ' + err);

        }
    });
});
router.get('/admin', (req, res)=>{
    Product.find((err, docs)=>{
        if(!err) {
            if(!req.user || req.user.admin == 0){
                res.redirect('/');
            } else {
                res.render('admin',{
                    product: docs
                });
            }
        } else {
            console.log('Error in order: ' + err);
        }
    });
});
router.get('/product/delete/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id, (err, doc)=>{
        if (!err) {
            res.redirect('/admin');
        } else {
            console.log('Error in delete: ' + err);
        }
    });
});

//POST
router.post('/product', (req, res)=>{
    insertProduct(req, res);
});
router.post('/edit', (req, res)=>{
    updateProduct(req, res);
});

//FUNCTIONS
function insertProduct(req, res){
    var product = new Product();
    var image = req.files.src;
    
    //moving uploaded file to public/img/
    image.mv('./public/img/' + req.body.type + 's/' + image.name, function(err) {
        if (err)
          return res.status(500).send(err);
    
        console.log('File uploaded!')
    });

    //insert to database
    product.type = req.body.type;
    product.src = image.name;
    product.price = req.body.price;
    product.save((err, doc)=>{
        if (!err) {
              console.log('product: ' + product);
              res.redirect('/');
        } else {
            console.log('Error insertProduct: ' + err);
        }
    });
}
function updateProduct(req, res){
    var product = new Product();
    
    //moving uploaded file to public/img/
    if (!req.files) {
        product.src = req.body.src;
    } else {
        var image = req.files.src;
        image.mv('./public/img/' + req.body.type + 's/' + image.name, function(err) {
            if (err)
              return res.status(500).send(err);
        
            console.log('File uploaded!')
        });
        product.src = image.name;
    }

    //insert to database
    product._id = req.body._id; 
    product.type = req.body.type;
    product.price = req.body.price;
    Product.findOneAndUpdate({_id:req.body._id}, product, {new: true}, (err, doc)=>{
        if (!err) {
            res.redirect('/admin');
        } else {
            console.log('Update error ' + err);
        }
    });
}

//USER MODEL
function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;