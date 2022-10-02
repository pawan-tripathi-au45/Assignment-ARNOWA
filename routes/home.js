const express = require('express');
const routes = express.Router();

const Home = require('../models/home');
const Review = require('../models/review');

const {isLoggedIn} = require('../middleware')



// List all the comments
routes.get('/homes', async (req, res) => {

    try{
    const home = await Home.find({});
    res.render('home/index', { home });
    }catch (e){
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Find Homes');
        res.render('error');
    }
})

// Getting a form for adding new comment
routes.get('/home/new', isLoggedIn, (req, res) => {
   
    res.render('home/new');
})


// Create a new comment
routes.post('/homes', isLoggedIn, async(req, res) => {
    try{   
        console.log(req.body)
   await Home.create(req.body);
   req.flash('success', 'New Comment Addded Successfully!');
    res.redirect('/homes');  // by default get request 
        
    }catch (e){
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Create Comment');
        res.render('error');
    }
    
})

// Show particular 
routes.get('/homes/:id',  async(req, res) => {

    try{
    const foundHome = await Home.findById(req.params.id).populate('reviews');  // reviews is an array name
    // console.log(foundComent);
    res.render('home/show',{foundHome});
    }catch (e){
        console.log("Something Went Wrong");
        // req.flash('error', 'Cannot Find this Product');
        res.render('error');
    }
})

// get a form for editing a comment

routes.get('/homes/:id/edit', isLoggedIn, async (req,res) => {
    try{
    const foundHome = await Home.findById(req.params.id);
    res.render('homes/edit', {foundComment});
    }catch (e){
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Edit this comment');
        res.render('error');
    }
})

// update the comment

routes.patch('/homes/:id', isLoggedIn, async(req, res) => {
    try{
    await Home.findByIdAndUpdate(req.params.id, req.body);
    console.log(req.body)
    req.flash('success', 'Updated Successfully!');
    res.redirect(`/homes/${req.params.id}`);
    }catch (e){
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Update this homes');
        res.render('error');
    }
    
})



// delete a particular comment
routes.delete('/homes/:id', isLoggedIn, async(req, res) => {
    try{
    await Home.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted the comment successfully');
    res.redirect('/homes');
    }catch(e){
        console.log(e.message);
        req.flash('error', 'Cannot delete this Comment');
        res.redirect('/error');
    }
})

//creating a new reveiw for on a comment

routes.post('/homes/:id/review', isLoggedIn, async (req, res) => {
    
    try{
    const home = await Home.findById(req.params.id);
    const review = new Review({
        user:req.user.username,
        ...req.body
    });
    console.log(review);

    home.reviews.push(review);

    await review.save();
    await home.save();
    req.flash('success','Successfully added your review!')
    console.log(req.params.id   )
    res.redirect(`/homes/${req.params.id}`);
    }catch(e){
        console.log(e.message);
        req.flash('error', 'Cannot add review to this Product');
        res.redirect('/error');
    }
})

routes.get('/error', (req, res) => {
    res.status(404).render('error');
})

module.exports = routes;
