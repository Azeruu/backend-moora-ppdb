import Kriteria from "../models/KriteriaModel.js";
// import User from "../models/UserModel.js";
// import Siswa from "../models/SiswaModel.js";
import { Op } from "sequelize";

//get Nilai
export const getKriteria = async (req, res) => {
  try {
      let response = await Kriteria.findAll({
        // include: [
        //   {
        //     model: User,
        //     attributes: ["id", "username", "email"],
        //   },
        // ],
      });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//get Nilai By ID
export const getKriteriaById = async (req, res) => {
  try {
    const kriteria = await Kriteria.findOne({
      where: [
        {
          id: req.params.id,
        },
      ],
    });
    if (!kriteria) return res.status(404).json({ msg: "Data Tidak Ditemukan" });
    res.status(200).json(kriteria);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// INput Kriteria 
export const createKriteria = async (req, res) => {
  const {
    kode_kriteria,
    nama_kriteria,
    jalur_pendaftaran,
    bobot_kriteria,
    tipe_data
  } = req.body;
  try {
    const KriteriaBaru = await Kriteria.create({
      kode_kriteria:kode_kriteria,
      nama_kriteria:nama_kriteria,
      jalur_pendaftaran:jalur_pendaftaran,
      bobot_kriteria:bobot_kriteria,
      tipe_data:tipe_data
    });
    res.status(201).json({ msg: "Data Kriteria Berhasil Diinput", idKriteriaBaru : KriteriaBaru.id});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//UPDATE Nilai
export const updateKriteria = async (req, res) => {
  const kriteria = await Kriteria.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!kriteria) {
    return res.status(404).json({ msg: "Data Kriteria tidak ditemukan" });
  }
  const {
    kode_kriteria,
    nama_kriteria,
    jalur_pendaftaran,
    bobot_kriteria,
    tipe_data
  } = req.body;
  try {
    if (req.role === "admin") {
      await Kriteria.update(
        {
          kode_kriteria,
          nama_kriteria,
          jalur_pendaftaran,
          bobot_kriteria,
          tipe_data
        },
        {
          where: {
            id: kriteria.id,
          },
        }
      );
    } else {
        return res.status(403).json({ msg: "Anda tidak memiliki akses" });
    }
    res.status(200).json({ msg: "Data Kriteria Berhasil Diupdate" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//HAPUS Kriteria
export const deleteKriteria = async (req, res) => {
  try {
    const kriteria = await Kriteria.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!kriteria) {
      return res.status(404).json({ msg: "Data Kriteria tidak ditemukan" });
    }
    if (req.role === "admin") {
      await Kriteria.destroy({
        where: {
          id: kriteria.id,
        },
      });
    } else {
        return res.status(403).json({ msg: "Anda tidak memiliki akses" });
    }
    res.status(200).json({ msg: "Data Krtieria Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
