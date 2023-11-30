import pgPromise from 'pg-promise';
import express from 'express';
import bodyParser from 'body-parser';
import {engine} from "express-handlebars";
import session from 'express-session';
import flash from 'express-flash';
import routes from './routes/routes.js';
import FuelConsumption from './fuel-consumption.js';
import FuelConsumptionAPI from './fuel-consumption-api.js';

const pgp = pgPromise();

const connectionOptions = {
    connectionString: process.env.DATABASE_URL || 'postgres://crmqbido:l_5NI8cn3s3fJd2KZbkLiMbTXqx9V8_V@flora.db.elephantsql.com/crmqbido',
    ssl: process.env.NODE_ENV === 'production', // Enable SSL in production
};

const app = express();

const db = pgp(connectionOptions);
const fuel = FuelConsumption(db)
const route = routes(fuel)

// use the express.static built-in middleware to serve static file 'css'
app.use(express.static('public'))

// set and callback engine 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// configure flash
app.use(flash());

//configure session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const fuelConsumptionAPI = FuelConsumptionAPI(fuel)


const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/vehicles', fuelConsumptionAPI.vehicles);
app.get('/api/vehicle', fuelConsumptionAPI.vehicle);
app.post('/api/vehicle', fuelConsumptionAPI.addVehicle);
app.post('/api/refuel', fuelConsumptionAPI.refuel);

app.get('/', route.home)
app.get('/vehicle', function(req,res){
    res.render('vehicle')
})
app.post('/vehicle',route.addVehicle)
app.get('/refuel', function(req,res){
    res.render('refuel')
})


app.listen(PORT, () => console.log(`App started on port: ${PORT}`));

