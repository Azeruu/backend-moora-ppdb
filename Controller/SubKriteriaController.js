import SubKriteria from "../models/SubKriteriaModel.js";
// import User from "../models/UserModel.js";
// import Siswa from "../models/SiswaModel.js";
// import { Op } from "sequelize";

//get Nilai
export const getSubKriteria = async (req, res) => {
    try {
        let response = await SubKriteria.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

//get Nilai By ID
    export const getSubKriteriaById = async (req, res) => {
    try {
        const subkriteria = await SubKriteria.findOne({
        where: [
            {
            id: req.params.id,
            },
        ],
        });
        if (!subkriteria) return res.status(404).json({ msg: "Data subKriteria Tidak Ditemukan" });
        res.status(200).json(subkriteria);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

    // INput Kriteria 
    export const AddSubKriteria = async (req, res) => {
    const {
        nama_kriteria,
        sub_kriteria,
        tipe_sub,
        bobot,
        keterangan,
        kriteriumId
    } = req.body;
    try {
        const SubKriteriaBaru = await SubKriteria.create({
        nama_kriteria:nama_kriteria,
        sub_kriteria:sub_kriteria,
        tipe_sub:tipe_sub,
        bobot:bobot,
        keterangan:keterangan,
        kriteriumId:kriteriumId
        });
        res.status(201).json({ msg: "Data SubKriteria Berhasil Diinput", idSubKriteriaBaru : SubKriteriaBaru.id});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

    //UPDATE Nilai
    export const updateSubKriteria = async (req, res) => {
    const subkriteria = await SubKriteria.findOne({
        where: {
        id: req.params.id,
        },
    });

    if (!subkriteria) {
        return res.status(404).json({ msg: "Data Kriteria tidak ditemukan" });
    }
    const {
        nama_kriteria,
        sub_kriteria,
        tipe_sub,
        bobot,
        keterangan,
    } = req.body;
    try {
        if (req.role === "admin") {
        await SubKriteria.update(
            {
                nama_kriteria,
                sub_kriteria,
                tipe_sub,
                bobot,
                keterangan,
            },
            {
            where: {
                id: subkriteria.id,
            },
            }
        );
        } else {
            return res.status(403).json({ msg: "Anda tidak memiliki akses" });
        }
        res.status(200).json({ msg: "Data Sub Kriteria Berhasil Diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

    //HAPUS Kriteria
    export const deleteSubKriteria = async (req, res) => {
    try {
        const subkriteria = await SubKriteria.findOne({
        where: {
            id: req.params.id,
        },
        });

        if (!subkriteria) {
        return res.status(404).json({ msg: "Data Kriteria tidak ditemukan" });
        }
        if (req.role === "admin") {
        await SubKriteria.destroy({
            where: {
            id: subkriteria.id,
            },
        });
        } else {
            return res.status(403).json({ msg: "Anda tidak memiliki akses" });
        }
        res.status(200).json({ msg: "Data SubKrtieria Berhasil Dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
