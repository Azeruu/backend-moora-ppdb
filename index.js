import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload"
import AlternatifRoutes from "./Routes/AlternatifRoutes.js"
import KriteriaRoutes from "./Routes/KriteriaRoutes.js";
import NilaiAlternatifRoutes from "./Routes/NilaiAlternatifRoutes.js"
import UserRoute from "./Routes/UserRoutes.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import JalurRoute from "./Routes/JalurRoutes.js";
import HasilRoute from "./Routes/HasilRoutes.js";
import PingRoutes from "./Routes/PingRoutes.js";
import QuotaRoutes from "./Routes/QuotaRoutes.js";
import db from "./config/Database.js";
dotenv.config();

const app = express();

// (async () => {
//     await db.sync();
// console.log("Sinkronisasi Database Berhasil");
// })();

const sessionStore = SequelizeStore(session.Store); 

const store = new sessionStore({
    db: db
});
// app.set('trust proxy', true);
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
        // sameSite: 'None',
        httpOnly: true,
        path: '/',
    },
    proxy:true
}));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Mengizinkan semua metode
    allowedHeaders: 'Content-Type', // Mengizinkan semua header
    credentials: true, // Mengizinkan penggunaan kredensial (cookie)
    optionsSuccessStatus: 204,
    })
);

app.use(FileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(AlternatifRoutes);
app.use(KriteriaRoutes);
app.use(NilaiAlternatifRoutes);
app.use(HasilRoute);
app.use(JalurRoute);
app.use(AuthRoutes);
app.use(UserRoute);
app.use(PingRoutes);
app.use(QuotaRoutes);

store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log("Server running on port " + process.env.APP_PORT);
});
