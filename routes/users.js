var express = require('express');
const Validator = require('fastest-validator');
var router = express.Router();

const { Users } = require('../models');

const v = new Validator();
/* GET users listing. */
router.get('/', async(req, res) => {
  const users = await Users.findAll();
  return res.json(users);
});

router.get('/:id', async(req, res) => {
  const id = req.params.id;
  const users = await Users.findByPk(id);
  return res.json(users || {});
});

router.post('/post',async(req,res) => {
  const schema = {
    name : 'string',
    email : 'string',
    roles : 'string',
  }

  const validate = v.validate(req.body, schema);

  if(validate.length){
    return res.status(400).json(validate)
  }
  const users = await Users.create(req.body);

  res.json(users);
});

router.put('/:id', async(req,res) => {
  const id = req.params.id;
  
  let users = await Users.findByPk(id);

  if (!users) {
    return res.json({ message : 'User not found !'});
  }
  const schema = {
    name : 'string|optional',
    email : 'string|optional',
    roles : 'string|optional',
  }

  const validate = v.validate(req.body, schema);

  if(validate.length){
    return res.status(400).json(validate)
  }

  users = await users.update(req.body);
  res.json(users);
});

router.delete('/:id', async(req,res) => {
  const id = req.params.id;

  let users = await Users.findByPk(id);

  if (!users){
    return res.json({message : 'User not found !'})
  }
  await users.destroy();
  res.json({message: 'User Deleted !'})
});

module.exports = router;
