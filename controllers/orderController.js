// Require
const express = require('express');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const User = mongoose.model('User');

var router = express.Router();
mongoose.set('useFindAndModify', false);

router.get('/cart', checkAuth, (req, res, next)=>{
    res.render('cart');
});
router.get('/orders', (req, res)=>{
    if(!req.user){
        res.redirect('/');
    } else {
        Order.find({userID: req.user._id},(err, docs)=>{
            if(!err) {
                res.render('orders',{
                        order: docs
                    });
            } else {
                console.log('Error in order: ' + err);
            }
        });
    }
});
// router.get('/order/:id', (req, res)=>{
//     Order.findById(req.params.id, (err, doc)=>{
//         if (!err) {
//             res.render("orders", {order:doc});
//         } else {
//             console.log('Error findbyId: ' + err);

//         }
//     });
// });
router.get('/order/delete/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id, (err, doc)=>{
        if (!err) {
            res.redirect('/orders');
        } else {
            console.log('Error in delete: ' + err);
        }
    });
});

//POST
router.post('/cart', (req, res)=>{
    insertOrder(req, res);
});
router.post('/order', (req, res)=>{
    updateOrder(req, res);
});

//Functions
function updateOrder(req, res){
    Order.findOneAndUpdate({_id:req.body._id}, req.body, {new: true}, (err, doc)=>{
        if (!err) {
            res.redirect('/admin');
        } else {
            console.log('Update error ' + err);
        }
    });
}
function insertOrder(req, res){
    var order = new Order();
    order.userID = req.user._id;
    order.total = req.body.total;
    order.save((err, doc)=>{
        if (!err) {
              res.redirect('/orders');
        } else {
            console.log('Error insertOrder: ' + err);
        }
    });
}

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;