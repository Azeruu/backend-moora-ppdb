import Jalur from "../models/JalurModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

//get Jalur
export const getJalur = async (req, res) => {
  try {
      const response = await Jalur.findAll({
          attributes:['id','nama_jalur', 'persentase','jumlah_kuota']
      });
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({msg:error.message})
  }
}
export const getJalurById = async (req, res) => {
  try {
      const response = await Jalur.findOne({
          attributes:['id','nama_jalur', 'persentase','jumlah_kuota'],
          where:{
              id:req.params.id
          }
      });
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ msg: error.message});
  }
}

//CREATE Jalur
export const createJalur = async (req, res) => {
  const { nama_jalur, persentase, jumlah_kuota } = req.body;
  try {
    await Jalur.create({
      nama_jalur: nama_jalur,
      persentase: persentase,
      jumlah_kuota: jumlah_kuota
    });
    res.status(201).json({ msg: "Data Jalur Berhasil Diinput" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//UPDATE Jalur
export const updateJalur = async (req, res) => {
  try {
    const jalur = await Jalur.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!jalur) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama_jalur, persentase, jumlah_kuota } = req.body;
    if (req.role === "admin") {
      await Jalur.update(
        {
          nama_jalur,
          persentase,
          jumlah_kuota,
        },
        {
          where: {
            id: jalur.id,
          },
        }
      );
    } else {
      if (req.userId !== jalur.userId)
        return res.status(403).json({ msg: "Anda tidak memiliki akses" });
      await Jalur.update(
        {
          nama_jalur,
          persentase,
          jumlah_kuota
        },
        {
          where: {
            [Op.and]: [{ id: jalur.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Data Mata Pelajaran Berhasil Diupdate" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//HAPUS Jalur
export const deleteJalur = async (req, res) => {
  try {
    const jalur = await Jalur.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!jalur) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await Jalur.destroy({
        where: {
          id: jalur.id,
        },
      });
    } else {
      if (req.userId !== jalur.userId)
        return res.status(403).json({ msg: "Anda tidak memiliki akses" });
      await Jalur.destroy({
        where: {
          [Op.and]: [{ id: jalur.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Siswa Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
