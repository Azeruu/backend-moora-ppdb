import NilaiAlternatif from "../models/NilaiAlternatifModel.js";
// import Nilai from "../models/NilaiModel.js";
// import Siswa from "../models/SiswaModel.js";
import User from "../models/UserModel.js";
import { Op, Sequelize } from "sequelize";

//get NilaiAlternatif
export const getNilaiAlternatif = async (req, res) => {
  try {
    const response = await NilaiAlternatif.findAll({
      include: [
        {
          model: User,
          atributes: ["username", "password"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//get NilaiAlternatif By ID
export const getNilaiAlternatifById = async (req, res) => {
  try {
    const nilai_alternatif = await NilaiAlternatif.findOne({
      where: [
        {
          id: req.params.id,
        },
      ],
    });
    if (!nilai_alternatif) return res.status(404).json({ msg: "Data Tidak Ditemukan" });
    res.status(200).json(nilai_alternatif);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
// CREATE DATA NilaiAlternatif
export const createNilaiAlternatif = async (req, res) => {
  const {
    nama_alternatif,
    jalur_pendaftaran,
    nama_kriteria,
    nilai_real,
    nilai_fuzzy,
    keterangan,
    dataAlternatifId,
    jalurId,
    kriteriumId
  } = req.body;
  try {
    await NilaiAlternatif.create({
      nama_alternatif: nama_alternatif,
      jalur_pendaftaran:jalur_pendaftaran,
      nama_kriteria: nama_kriteria,
      nilai_real: nilai_real,
      nilai_fuzzy: nilai_fuzzy,
      keterangan: keterangan,
      dataAlternatifId:dataAlternatifId,
      jalurId:jalurId,
      userId:req.userId,
      kriteriumId:kriteriumId
    });
    res.status(201).json({ msg: "Data Nilai Alternatif Berhasil Diinput" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//UPDATE Nilai Alternatif
export const updateNilaiAlternatif = async (req, res) => {
  const nilai_alternatif = await NilaiAlternatif.findOne({
    where: {
      id:req.params.id
    },
  });
  if (!nilai_alternatif) {
    return res.status(404).json({ msg: "Data Nilai Alternatif tidak ditemukan" });
  }
  const {
    nama_alternatif,
    jalur_pendaftaran,
    nama_kriteria,
    nilai_real,
    nilai_fuzzy,
    keterangan,
    dataAlternatifId,
    jalurId,
    kriteriumId
  } = req.body;
  try {
    await NilaiAlternatif.update(
      {
        nama_alternatif: nama_alternatif,
        jalur_pendaftaran:jalur_pendaftaran,
        nama_kriteria: nama_kriteria,
        nilai_real: nilai_real,
        nilai_fuzzy: nilai_fuzzy,
        keterangan: keterangan,
        dataAlternatifId:dataAlternatifId,
        jalurId:jalurId,
        userId:req.userId,
        kriteriumId:kriteriumId
    },
    {
      where:{
        id : nilai_alternatif.id
      }
    }
    );
    res.status(201).json({ msg: "Data Nilai Alternatif Berhasil diUpdate" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  };
};

//HAPUS Nilai Alternatif
export const deleteNilaiAlternatif = async (req, res) => {
  try {
    const nilai_alternatif = await NilaiAlternatif.findOne({
      where: {
        id:req.params.id
      },
    });
    if (!nilai_alternatif) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await NilaiAlternatif.destroy({
        where: {
          id: nilai_alternatif.id,
        },
      });
    } else {
      if (req.userId !== nilai.userId)
        return res.status(403).json({ msg: "Anda tidak memiliki akses" });
      await NilaiAlternatif.destroy({
        where: {
          [Op.and]: [{ id: nilai_alternatif.id }, { userId: req.userId }],
        },
      });
    }
    res.status(201).json({ msg: "Data Nilai Alternatif Berhasil Dihapus"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  };
};
