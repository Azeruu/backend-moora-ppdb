import Alternatif from "../models/AlternatifModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

//GET SISWA
export const getAlternatif = async (req, res) => {
  try {
    let response;
    if(req.role === "admin") {
      response = await Alternatif.findAll({
        attributes: [
          "id",
          "nama_alternatif",
          "nama_jalur"
        ],
        include: [
          {
            model: User,
            attributes: ["id","username", "email"],
          },
        ],
      });
    }else{
      response = await Alternatif.findAll({
        attributes: [
          "id",
          "nama_alternatif",
          "nama_jalur"
        ],
        // Menggunakan Where agar user hanya bisa melihat data yang ia input saja
        // where: {
        //   userId: req.userId,
        // },
        include: [
          {
            model: User,
            attributes: ["id","username", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//GET SISWA BY ID
export const getAlternatifById = async (req, res) => {
  try {
    const alt = await Alternatif.findOne({
      where:{
        id: req.params.id
      }
    });
    if(!alt) return res.status(404).json({msg : 'Data tidak ditemukan'});
    let response;
    if(req.role === "admin") {
      response = await Alternatif.findOne({
        attributes: [
          "id",
          "nama_alternatif",
          "nama_jalur"
        ],
        where: {
          userId: alt.userId,
          id:alt.id
        },
        include: [
          {
            model: User,
            attributes: ["id","username", "email"],
          },
        ],
      });
    }else{
      response = await Alternatif.findOne({
        attributes: [
          "id",
          "nama_alternatif",
          "nama_jalur"
        ],
        where: {
          [Op.and]: [{ id: alt.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["id","username", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//CREATE Alternatif
export const createAlternatif = async (req, res, next) => {
    if (req.role !== "admin") {
      const AlternatifExist = await Alternatif.findOne({
        where: {
          userId:req.userId
        }
      });
    
      if (AlternatifExist) {
        return res.status(400).json({ msg: "Anda sudah melakukan input, Tidak dapat melakukan input data lebih dari 1 kali" });
      }
    }
  const {
    nama_alternatif,
    nama_jalur,
    jalurId,
  } = req.body;
  try {
    const alternatifBaru = await Alternatif.create({
      nama_alternatif:nama_alternatif,
      nama_jalur:nama_jalur,
      userId:req.userId,
      jalurId:jalurId
    });
    res.status(201).json({msg : 'Data Alternatif Berhasil Diinput', idAlternatifBaru : alternatifBaru.id});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//UPDATE ALTERNATIF
export const updateAlternatif = async (req, res) => {
  try {
    const alt = await Alternatif.findOne({
      where:{
        id: req.params.id
      }
    });
    if(!alt) return res.status(404).json({msg : 'Data tidak ditemukan'});
    const {
        nama_alternatif,
        nama_jalur
    } = req.body;
    if(req.role === "admin") {
      await Alternatif.update(
        {
        nama_alternatif,
        nama_jalur
        },
        {
          where: {
            id: alt.id,
          },
        }
      );
    }else{
      if(req.userId !== alt.userId) return res.status(403).json({msg : 'Anda tidak memiliki akses'});
      await Alternatif.update(
        {
          nama_alternatif,
          nama_jalur
        },
        {
          where: {
            [Op.and]: [{ id: alt.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({msg : "Data Alternatif Berhasil Diupdate"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//HAPUS SISWA
export const deleteAlternatif = async (req, res) => {
  try {
    const alt = await Alternatif.findOne({
      where: {
        id: req.params.id,
      },
    });
    if(!alt) return res.status(404).json({msg : 'Data tidak ditemukan'});

    if(req.role === "admin") {
      await Alternatif.destroy({
        where:{
          id:alt.id
        }
      });
    }else{
      if(req.userId !== alt.userId) return res.status(403).json({msg : 'Anda tidak memiliki akses'});
      await Alternatif.destroy({
        where:{
          [Op.and]: [{ id: alt.id }, { userId: req.userId }],
        }
      });
    }
    res.status(200).json({msg : "Data Alternatif Berhasil Dihapus"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
