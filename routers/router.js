const express = require('express')const router = express.Router()// User validatorsconst {    userRegisterValidator,    userLoginValidation,    userLoggedInValidator,    newPasswordValidator,    validatePhoto} = require('../validators/userValidators')// User controllersconst {    registerUser,    userLogin,    stayLoggedIn,    logoutUser,    checkUserPassword,    submitNewPassword,    changeUserPhoto} = require('../controllers/userControllers')// Topic controllersconst {    addTopic} = require('../controllers/topicControllers')// Topic validatorsconst {    topicValidation} = require('../validators/topicValidators')// User routesrouter.post('/register', userRegisterValidator, registerUser)router.post('/login', userLoginValidation, userLogin)router.get('/stayLoggedIn', stayLoggedIn)router.get('/logout', logoutUser)router.post('/submit-user-password', userLoggedInValidator, checkUserPassword)router.post('/submit-user-new-password', userLoggedInValidator, newPasswordValidator, submitNewPassword)router.post('/change-user-photo', userLoggedInValidator, validatePhoto, changeUserPhoto)// Topic routesrouter.post('/upload-topic', userLoggedInValidator, topicValidation, addTopic)module.exports = router