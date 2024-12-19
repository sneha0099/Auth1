import express from "express"
import cors from "cors"
import ConnectDB from "./config/db.js";
import dotenv from 'dotenv'
dotenv.config() 
import helmet from "helmet" 
import rateLimit from "express-rate-limit"
import Authroutes from "./routes/Auth.route.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true
}))

// Set security headers
app.use(helmet());

// Rate limiting: restrict each IP to 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(express.json())  

await ConnectDB(); 

// app.get('/',(req, res)=>{
//     res.json{
//         msg:"heloooo"
//     }
// }); this is real route syntax 

app.use('/api/auth' , Authroutes)

app.listen(process.env.PORT || 4000,
    console.log("listening on port ", process.env.PORT) 
);

