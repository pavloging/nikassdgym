const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { registrationValidation, loginValidation } = require('../middlewares/validations.js');

router.post('/registration', registrationValidation, userController.registration);
router.post('/login', loginValidation, userController.login);
router.post('/logout', userController.logout);
router.get('/reset/:email', userController.reset);
router.get('/password/:token', userController.passwordToken);
router.post('/password', userController.password);

// Подписку продлевает только вебхук ЮKassa после реального платежа,
// отдельного маршрута активации нет намеренно.
router.post('/createLinkPay', authMiddleware, userController.createLinkPay);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/webhook', userController.webhook);

module.exports = router;
