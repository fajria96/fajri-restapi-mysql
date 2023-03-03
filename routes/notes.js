var express = require("express");
var router = express.Router();

const Validator = require("fastest-validator");
const v = new Validator();
const { Notes } = require("../models");

//Method GET untuk menampilkan semua data
router.get("/", async (req, res, next) => {
  const notes = await Notes.findAll();
  return res.json({
    status: 200,
    message: "Berhasil menampilkan semua data",
    data: notes,
  });
});

//Method GET untuk menampikan data berdasarkan id
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  //check id
  let note = await Notes.findByPk(id);
  if (!note) {
    return res
      .status(404)
      .json({ status: 404, message: "Data tidak ditemukan" });
  } else {
    return res.json({
      status: 200,
      message: "Data berhasil ditampilkan",
      data: note,
    });
  }
});

//Method POST untuk create data
router.post("/", async (req, res, next) => {
  const schema = {
    title: "string",
    description: "string|optional",
  };
  //Validasi
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  //Create
  const note = await Notes.create(req.body);
  res.json({
    status: 200,
    message: "Sukses menambahkan data",
    data: note,
  });
});

//Method PUT untuk update data
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  let note = await Notes.findByPk(id);
  if (!note) {
    return res
      .status(404)
      .json({ status: 404, message: "Data tidak ditemukan" });
  }
  //Validasi
  const schema = {
    title: "string|optional",
    description: "string|optional",
  };
  const validate = v.validate(req.body, schema);
  if (validate.length) {
    return res.status(400).json(validate);
  }
  //Update
  note = await note.update(req.body);
  res.json({
    status: 200,
    message: "Sukses update data",
    data: note,
  });
});

//DELETE untuk menghapus data berdasarkan id
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  //check id
  let note = await Notes.findByPk(id);
  if (!note) {
    return res
      .status(404)
      .json({ status: 404, message: "Data tidak ditemukan" });
  }
  //delete
  await note.destroy();
  res.json({ status: 200, message: "Sukses delete data" });
});

module.exports = router;
