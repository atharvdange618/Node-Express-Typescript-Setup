import cors from "cors";
import { environment } from "../config/environment";

const allowedOrigins = environment.allowedOrigins
  ? environment.allowedOrigins.split(",")
  : [];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logging.warn(`CORS: Blocked origin - ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  optionsSuccessStatus: 204,
};

export const corsMiddleware = cors(corsOptions);
