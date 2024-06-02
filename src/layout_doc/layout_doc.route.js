const express = require("express");
const router = express.Router();

const RequireAuth = require("../../global/middleware/RequireAuth")
const {
    GetAllDocumentForm,
    CreateDocumentForm,
    UpdateDocumentForm
} = require("./layout_doc.controller");

router.use(RequireAuth)
router.get("/", GetAllDocumentForm);
router.post("/", CreateDocumentForm);
router.patch("/", UpdateDocumentForm);

module.exports = router;
