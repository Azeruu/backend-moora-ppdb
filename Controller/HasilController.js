import Hasil from "../models/HasilModel.js";
import User from "../models/UserModel.js";
import DataAlternatif from "../models/AlternatifModel.js"
import NilaiAlternatif from "../models/NilaiAlternatifModel.js";
import Alternatif from "../models/AlternatifModel.js";
import Kriteria from "../models/KriteriaModel.js";
import { Op } from "sequelize";

//get Hasil
export const getHasil = async (req, res) => {
  try {
    const response = await Hasil.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "password"],
        },
        {
          model: DataAlternatif,
          attributes: ['id'],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//get Hasil By ID
export const getHasilById = async (req, res) => {
  try {
    const hasil = await Hasil.findOne({
      where: [
        {
          id: req.params.id,
        },
      ],
    });
    if (!hasil) return res.status(404).json({ msg: "Data Tidak Diteukan" });
    let response;
    if (req.role === "admin") {
      response = await Hasil.findOne({
        include: [
          {
            model: User,
            atributes: ["username", "password"],
          },
        ],
      });
    } else {
      response = await Hasil.findOne({
        where: {
          [Op.and]: [{ id: hasil.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// CREATE HASIL
export const createHasil = async (req, res) => {
  try {
    const nilai_alternatif = await NilaiAlternatif.findAll();
    const data_alternatif = await Alternatif.findAll();
    const dataKriteria = await Kriteria.findAll(); // Mengambil data kriteria beserta bobot dan tipe_data dari database

    const groupedData = {};
    nilai_alternatif.forEach(({ nama_alternatif, nama_kriteria, nilai_fuzzy }) => {
      groupedData[nama_kriteria] = groupedData[nama_kriteria] || [];
      groupedData[nama_kriteria].push({ nama_alternatif, nilai_fuzzy });
    });

    // Langkah 1: Normalisasi (pembagian dengan square root dari jumlah kuadrat setiap nilai fuzzy)
    const squareRootValues = {};
    for (const [nama_kriteria, data] of Object.entries(groupedData)) {
      const totalSquaredValue = data.reduce((total, { nilai_fuzzy }) => total + Math.pow(nilai_fuzzy, 2), 0);
      squareRootValues[nama_kriteria] = Math.sqrt(totalSquaredValue);
    }

    // Langkah 2: Normalisasi nilai fuzzy dibagi square root
    const dividedValues = {};
    for (const [nama_kriteria, data] of Object.entries(groupedData)) {
      const squareRootValue = squareRootValues[nama_kriteria];
      dividedValues[nama_kriteria] = data.map(({ nama_alternatif, nilai_fuzzy }) => ({
        nama_alternatif,
        nilai_fuzzy: nilai_fuzzy / squareRootValue
      }));
    }

    // Langkah 3: Mengalikan nilai yang sudah dinormalisasi dengan bobot kriteria
    const bobotKriteria = {};
    dataKriteria.forEach(({ nama_kriteria, bobot_kriteria }) => {
      bobotKriteria[nama_kriteria] = bobot_kriteria;
    });

    const multipliedValues = {};
    for (const [nama_kriteria, data] of Object.entries(dividedValues)) {
      const bobot = bobotKriteria[nama_kriteria];
      multipliedValues[nama_kriteria] = data.map(({ nama_alternatif, nilai_fuzzy }) => ({
        nama_alternatif,
        nilai_fuzzy: nilai_fuzzy * bobot
      }));
    }

    // Langkah 4: Optimasi berdasarkan tipe_data (benefit atau cost)
    const summedValues = {};
    for (const [nama_kriteria, data] of Object.entries(multipliedValues)) {
      // Mengambil tipe_data dari dataKriteria
      const kriteriaData = dataKriteria.find(kriteria => kriteria.nama_kriteria === nama_kriteria);
      const tipe_data = kriteriaData?.tipe_data;

      data.forEach(({ nama_alternatif, nilai_fuzzy }) => {
        const factor = tipe_data === "benefit" ? 1 : -1; // Benefit: ditambah, Cost: dikurang
        summedValues[nama_alternatif] = (summedValues[nama_alternatif] || 0) + (nilai_fuzzy * factor);
      });
    }

    // Langkah 5: Menyimpan hasil ke tabel Hasil jika belum ada
    for (const [nama_alternatif, nilai_fuzzy] of Object.entries(summedValues)) {
      // Cari data yang sudah ada dengan nama_alternatif dan jalur_pendaftaran yang sama
      const existingData = await Hasil.findOne({ where: { nama_alternatif } });

      // Jika data sudah ada, lewati proses penambahan data baru
      if (existingData) continue;

      // Dapatkan jalur_pendaftaran dan data lainnya dari tabel data_alternatif
      const jalur_pendaftaran = data_alternatif.find(({ nama_alternatif: nama }) => nama === nama_alternatif)?.nama_jalur;
      const alternatifId = data_alternatif.find(({ nama_alternatif: nama }) => nama === nama_alternatif)?.id;
      const jalurId = data_alternatif.find(({ nama_alternatif: nama }) => nama === nama_alternatif)?.jalurId;

      // Simpan hasil ke dalam tabel Hasil
      await Hasil.create({
        nama_alternatif,
        jalur_pendaftaran,
        poin: nilai_fuzzy,
        userId: req.userId,
        alternatifId,
        jalurId
      });
    }

    // Beri respons sukses
    res.status(201).json({ msg: "Data Hasil Berhasil Diinput atau Diperbarui" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};



//UPDATE Hasil
export const updateHasil = async (req, res) => {
  try {
    const nilai_alternatif = await NilaiAlternatif.findAll();
    const data_alternatif = await Alternatif.findAll();

    // Mengelompokkan data berdasarkan kriteria
    const groupedData = {};
    nilai_alternatif.forEach(({ nama_alternatif, nama_kriteria, nilai_fuzzy }) => {
      if (!groupedData[nama_kriteria]) {
        groupedData[nama_kriteria] = [];
      }
      groupedData[nama_kriteria].push({ nama_alternatif, nilai_fuzzy });
    });

    // Menghitung nilai total kuadrat untuk setiap kriteria
    const squareRootValues = {};
    Object.entries(groupedData).forEach(([nama_kriteria, data]) => {
      const totalSquaredValue = data.reduce((total, { nilai_fuzzy }) => total + Math.pow(nilai_fuzzy, 2), 0);
      squareRootValues[nama_kriteria] = Math.sqrt(totalSquaredValue);
    });

    // Normalisasi nilai fuzzy
    const dividedValues = {};
    Object.entries(groupedData).forEach(([nama_kriteria, data]) => {
      const squareRootValue = squareRootValues[nama_kriteria];
      dividedValues[nama_kriteria] = data.map(({ nama_alternatif, nilai_fuzzy }) => ({
        nama_alternatif,
        nilai_fuzzy: nilai_fuzzy / squareRootValue,
      }));
    });

    // Mengalikan dengan bobot kriteria
    const bobotKriteria = {};
    const dataKriteria = await Kriteria.findAll();
    dataKriteria.forEach(({ nama_kriteria, bobot_kriteria }) => {
      bobotKriteria[nama_kriteria] = bobot_kriteria;
    });

    const multipliedValues = {};
    Object.entries(dividedValues).forEach(([nama_kriteria, data]) => {
      const bobot = bobotKriteria[nama_kriteria];
      multipliedValues[nama_kriteria] = data.map(({ nama_alternatif, nilai_fuzzy }) => ({
        nama_alternatif,
        nilai_fuzzy: nilai_fuzzy * bobot,
      }));
    });

    // Mengakumulasi nilai fuzzy dengan tanda (+ atau -) sesuai dengan kriteria benefit dan cost
    const summedValues = {};
    Object.entries(multipliedValues).forEach(([nama_kriteria, data]) => {
      data.forEach(({ nama_alternatif, nilai_fuzzy }) => {
        if (!summedValues[nama_alternatif]) {
          summedValues[nama_alternatif] = 0;
        }
        // Periksa apakah kriteria adalah benefit atau cost
        const sign = ["Rata - Rata Nilai Rapot", "Usia"].includes(nama_kriteria) ? 1 : -1; // Asumsikan kriteria ini adalah benefit
        summedValues[nama_alternatif] += nilai_fuzzy * sign;
      });
    });

    // Menghapus data hasil yang tidak cocok
    const idDataAlternatif = data_alternatif.map(alternatif => alternatif.id);
    const hasilYangTidakCocok = await Hasil.findAll({
      where: {
        dataAlternatifId: {
          [Op.notIn]: idDataAlternatif,
        },
      },
    });

    for (const hasil of hasilYangTidakCocok) {
      await hasil.destroy();
    }

    // Memperbarui atau menambahkan data hasil baru
    for (const [nama_alternatif, nilai_fuzzy] of Object.entries(summedValues)) {
      const dataAlternatif = data_alternatif.find(({ nama_alternatif: nama }) => nama === nama_alternatif);
      if (dataAlternatif) {
        const { id: dataAlternatifId, nama_jalur: jalur_pendaftaran } = dataAlternatif;
        const hasil = await Hasil.findOne({ where: { dataAlternatifId } });
        if (hasil) {
          await hasil.update({ nama_alternatif, poin: nilai_fuzzy, jalur_pendaftaran });
        } else {
          await Hasil.create({ dataAlternatifId, nama_alternatif, poin: nilai_fuzzy, jalur_pendaftaran });
        }
      }
    }

    res.status(200).json({ msg: "Data Hasil Berhasil Diupdate" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};




//HAPUS Hasil
export const deleteHasil = async (req, res) => {
  try {
    const hasil = await Hasil.findOne({
      where: {
        id:req.params.id
      },
    });
    if (!hasil) return res.status(404).json({ msg: "Data hasil tidak ditemukan" });
    if (req.role === "admin") {
      await Hasil.destroy({
        where: {
          id: hasil.id,
        },
      });
    } else {
      if (req.userId !== hasil.userId)
        return res.status(403).json({ msg: "Anda tidak memiliki akses" });
      await Hasil.destroy({
        where: {
          [Op.and]: [{ id: hasil.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Data Siswa Berhasil Dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
