import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './Config/Mongodb.js';
import UserRouter from './Routes/UserRoutes.js';
import ImageRouter from './Routes/ImageRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get('/', (req, res) => {
    res.send("API working");
});

app.use('/api/user', UserRouter);
app.use('/api/image', ImageRouter);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () =>
            console.log('Server running on port ' + PORT)
        );
    } catch (error) {
        console.log('DB connection failed:', error.message);
    }
};

startServer();