// Import dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const filter = require("content-filter");
const { RequestLimitMessage, StatusCode } = require("./constants/constant");
const https = require("https");
const csp = require("helmet-csp");
const fs = require("fs");
const morgan = require("morgan");
const userRouter = require("./router/userRoute");
const ticketRoute = require("./router/ticketRoute");

dotenv.config({
    path: "./config.env",
});

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 9983;
        this.blackList = ["$", "{", "||", "&&", "}", "%"];
        this.options = {
            urlBlackList: this.blackList,
            bodyBlackList: this.blackList,
            typeList: ["object", "function", "string", "number", "boolean"],
        };

        this.initializeMiddlewares();
        this.intializingRouter();
        this.initializeDatabase();
        this.initializeErrorHandling();
        this.initializeServer();
    }

    initializeMiddlewares() {
        const limiter = rateLimit({
            windowMs: 180000,
            max: 50,
            message: RequestLimitMessage,
            standardHeaders: true,
            legacyHeaders: false,
        });

        this.app.set("trust proxy", true);
        this.app.use(
            csp({
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "maxcdn.bootstrapcdn.com"],
                },
            })
        );
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(hpp());
        this.app.use(mongoSanitize());
        // this.app.use(limiter);
        this.app.use(
            cors({
                origin: ["http://localhost:3000",
                    "https://*.ermiyas.dev",
                    "https://ticket.ermiyas.dev",],
                methods: ['GET', 'POST', 'OPTIONS'],
                credentials: true
            })
        );

        this.app.use((req, res, next) => {
            console.log('reach here, ', req.headers.origin);
            const allowedOrigins = ["https://*.ermiyas.dev", "http://localhost:3000/", "https://ticket.ermiyas.dev"];

            if (allowedOrigins.includes(req.headers.origin)) {
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            }
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
            res.header('Access-Control-Allow-Credentials', true);
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });

        this.app.use((req, res, next) => {
            res.setHeader('Content-Security-Policy', "default-src 'self'");
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
            next();
        });

        this.app.use(morgan('common'));
        this.app.use(cookieParser());
        this.app.use(
            express.urlencoded({
                extended: true,
            })
        );

        this.app.use((req, res, next) => {
            console.log("Request Method: " + req.method + " ENDPOINT - " + req.url);
            next();
        });
    }

    intializingRouter() {
        this.app.use("/API/v1.0/ticketing/user", userRouter);
        this.app.use("/API/v1.0/ticketing/ticket", ticketRoute);
    }
    initializeDatabase() {
        mongoose.set("strictQuery", true);
        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => {
                console.log("Connected to DB");
            })
            .catch((err) => {
                console.log("Cannot connect to DB: -", err);
            });
    }

    initializeErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.log('in error in connection :- ', err);
            if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
                return res.status(StatusCode.FORBIDDEN).send({ message: "Bad request!" });
            }
            next();
        });
    }

    initializeServer() {
        const server = this.app.listen(this.port, () =>
            console.log(`Http server port: ${this.port}`)
        );

        server.setTimeout(180000, (socket) => {
            socket.destroy();
        });

        server.on("error", (err) => {
            console.log("Server error: ", err);
        });
    }
}

const myApp = new App();