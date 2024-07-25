import Quota from "../models/QuotaModel.js";
import { Op } from "sequelize";

//get Quota
export const getQuota = async (req, res) => {
    try {
        let response = await Quota.findAll({
            attributes:['id','total_quota']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

//get Quota By ID
export const getQuotaById = async (req, res) => {
    try {
        const quota = await Quota.findOne({
        where: [
            {
            id: req.params.id,
            },
        ],
        });
        if (!quota) return res.status(404).json({ msg: "Data Quota Tidak Ditemukan" });
        res.status(200).json(quota);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

// Insert Data quota 
export const addQuota = async (req, res) => {
    const {total_quota} = req.body;
    try {
        const QuotaBaru = await Quota.create({total_quota:total_quota});
        res.status(201).json({ msg: "Data Quota Berhasil Diinput", idQuotaBaru : QuotaBaru.id});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

//UPDATE Nilai
export const updateQuota = async (req, res) => {
    const quota = await Quota.findOne({
        where: {
        id: req.params.id,
        },
    });

    if (!quota) {
        return res.status(404).json({ msg: "Data Quota tidak ditemukan" });
    }
    const {total_quota} = req.body;
    try {
        if (req.role === "admin") {
        await Quota.update({total_quota},{where: {id: quota.id}});
        } else {
            return res.status(403).json({ msg: "Anda tidak memiliki akses" });
        }
        res.status(200).json({ msg: "Data quota Berhasil Diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    };

//HAPUS quota
export const deleteQuota = async (req, res) => {
    try {
        const quota = await Quota.findOne({
        where: {
            id: req.params.id,
        },
        });

        if (!quota) {
        return res.status(404).json({ msg: "Data Quota tidak ditemukan" });
        }
        if (req.role === "admin") {
        await Quota.destroy({
            where: {
            id: quota.id,
            },
        });
        } else {
            return res.status(403).json({ msg: "Anda tidak memiliki akses" });
        }
        res.status(200).json({ msg: "Data Quota Berhasil Dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
