const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController");
const authorizeOrderItemAccess = require("../middlewares/authorizeOrderItemAccess");
const authorizeSellerAccess = require("../middlewares/authorizeSellerAccess");
const authorizeInternal = require("../middlewares/authorizeInternal");
const auth = require("../middlewares/auth");

router.post("/", authorizeInternal, orderItemController.createItem);
router.get("/", auth, orderItemController.getItemList);
router.get("/:id", auth, authorizeOrderItemAccess, orderItemController.getItemDetail);
router.put("/:id/status", auth, authorizeSellerAccess, orderItemController.updateStatus);
router.put("/:id/cancel", auth, authorizeOrderItemAccess, orderItemController.cancelItem);

module.exports = router;
