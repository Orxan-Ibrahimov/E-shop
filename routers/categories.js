const express = require('express')
const { Category } = require('../models/category')
const router = express.Router()

router.get('/', async (req, res) => {
    const categoryList = await Category.find()

    if (!categoryList) {
        res.status(500).json({ success: false })
    }

    res.send(categoryList)
})

router.get('/:categoryId', async (req, res) => {
    const category = await Category.findById(req.params.categoryId)

    if (!category) {
        res.status(400).json({
            success: false,
            message: 'Category was found!',
        })
    }

    res.status(200).send(category)
})

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
    })

    category = await category.save()

    if (!category) {
        return res.status(404).send('Category cannot be created!')
    }

    res.status(201).send(category)
})

router.delete('/:categoryId', (req, res) => {
    const category = Category.findByIdAndDelete(req.params.categoryId)
        .then((deletedCategory) => {
            if (deletedCategory) {
                return res.status(200).json({
                    success: true,
                    message: 'Category was deleted!',
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Category was found!',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json(err)
        })
})

router.put('/:categoryId', async (req,res) => {   
       
    const category = await Category.findByIdAndUpdate(
        req.params.categoryId,
        {
            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon,
        },
        {new: true});   

    if(!category){
      return  res.status(404).json({
            success:false,
            message: "Category was found!"
        });
    }
    res.status(200).send(category);
})

module.exports = router
