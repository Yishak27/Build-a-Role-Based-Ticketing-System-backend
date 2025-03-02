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
const {
  RequestLimitMessage,
  WeakPINPattern,
  StatusCode,
} = require("./constants/Constants");
const https = require("https");
const secret = process.env.JWT_TOKEN;
const csp = require("helmet-csp");
const fs = require("fs");
const privateKey = fs.readFileSync("./cert/key.pem");
const certificate = fs.readFileSync("./cert/certificate.pem");
const ResponseHandler = require("./controlers/handler/ResponseHandler");
const RequestHandler = require("./controlers/handler/RequestHandler");
const morgan = require("morgan");

const httpsOptions = {
  key: privateKey,
  cert: certificate,
};
dotenv.config({
  path: "./config.env",
});
const app = express();
const port = process.env.PORT || 1001;

//security middlewares
const blackList = ["$", "{", "||", "&&", "}", "%"];
let options = {
  urlBlackList: blackList,
  bodyBlackList: blackList,
  typeList: ["object", "function", "string", "number", "boolean"],
};

// Restrict request limit
const limiter = rateLimit({
  windowMs: 180000,
  max: 50,
  message: RequestLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
});
app.set("trust proxy", true);
// app.use(
//   csp({
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "maxcdn.bootstrapcdn.com"],
//     },
//   })
// );
app.use(express.json());
app.use(helmet());
// app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());
// app.use(limiter);
// app.use(ResponseHandler);
// app.use(RequestHandler);

app.use(
  cors({
    origin: ["https://madashboard.amharabank.com.et",
      "https://merchantportal.amharabank.com.et",
      'http://merchantportal.amharabank.com.et',
      "http://10.100.13.40:2020"],
    credentials: true
  })
);
app.use((req, res, next) => {
  console.log('reach here, ', req.headers.origin);
  const allowedOrigins = ['https://madashboard.amharabank.com.et',
    'https://merchantportal.amharabank.com.et',
    'http://merchantportal.amharabank.com.et'];

  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  next();
});
const {
  globalErrorHandler,
} = require("./controlers/handler/GlobalErrorHandler");

app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//exporting routes
const UniqueRefSchema = require('./models/UniqueRefSchema');
const userRouter = require("./routes/userRoute");
const branchRouter = require("./routes/branchRoute");
const merchantRouter = require("./routes/merchantRoute");
const RepresentativeRoute = require("./routes/merchants/RepresentativeRoute");
const MerchantSuperAdminRoute = require("./routes/merchants/MerchantSuperAdminRoute");
const MerchantBranchsRoute = require("./routes/merchants/MerchantBranchRoute");
const MerchantManagerRoute = require("./routes/merchants/MerchantManagerRoute");
const ProductManagementRoute = require("./routes/Products/ManageProduct");
const GetDynamicProductUIRoute = require("./routes/Products/getProduct");
const UtilityRoute = require("./routes/utilityRoute");

const {
  checkTokenExpiration,
} = require("./controlers/middleware/tokenMiddleware");
const { Encryption } = require("./controlers/EncryptionDecrypt");
const isAuth = require("./controlers/auth/isAuth");
const DbConnectionService = require("./service/DbConnectionService");

app.use((req, res, next) => {
  console.log("Request Method: " + req.method + " ENDPOINT - " + req.url);
  next();
});

app.use(
  "/AbaAPI/v1.0.0/Dashboard/branch",
  branchRouter
);
app.use(
  "/AbaAPI/v1.0.0/Dashboard/user",
  userRouter
);
app.use(
  "/AbaAPI/v1.0.0/Dashboard/merchant",
  merchantRouter
);
app.use(
  "/AbaAPI/v1.0.0/Dashboard/representative",
  // checkTokenExpiration,
  // isAuth,
  RepresentativeRoute
);
app.use("/AbaAPI/v1.0.0/Dashboard/merchantAdmin",
  MerchantSuperAdminRoute);
app.use("/AbaAPI/v1.0.0/Dashboard/merchantBranch",
  // isAuth,
  MerchantBranchsRoute);
app.use("/AbaAPI/v1.0.0/Dashboard/merchantManager",
  MerchantManagerRoute);
app.use("/AbaAPI/v1.0.0/Dashboard/productManager",
  //  isAuth,
  ProductManagementRoute);
app.use(
  "/AbaAPI/v1.0.0/Dashboard/GetDynamicProductUI",
  // isAuth,
  GetDynamicProductUIRoute
);
app.use("/AbaAPI/v1.0.0/Dashboard/utility",
  // isAuth, 
  UtilityRoute);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Cannot connect to DB: -", err);
  });

app.use((err, req, res, next) => {
  console.log('in error in DB connect:- ', err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(StatusCode.FORBIDDEN).send({ message: "Bad request!" }); // Bad request
  }
  next();
});

// app.use(globalErrorHandler);
DbConnectionService.connectToOracle();
app.use("*", (req, res) => {
  console.log('in catch all middleware:- ', req.url);
  res.status(StatusCode.NOT_FOUND).json({
    msg: "Catch All",
  });
});

const httpsServer = https.createServer(httpsOptions, app);
httpsServer.listen(port, () => {
  console.log("HTTPS server running on port: " + port);
});
httpsServer.setTimeout(180000, (socket) => {
  socket.destroy();
})

const server = app.listen(1002, () =>
 console.log(`Http server port: 1002`)
);
//server.setTimeout(180000, (socket) => {
//  socket.destroy();
// });
