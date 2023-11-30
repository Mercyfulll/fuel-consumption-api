export default function routes(fuel){

    // A route to render a home page which renders a list of vehicles avialable  
    async function home(req,res){
        try {
            const cars = await fuel.vehicles()
            
            res.render('index',{cars})
        } catch (error) {
            console.log(error)
        }
    }
    
    //A route to add a vehicle to the vehicles table 
    async function addVehicle (req,res){
        try {
            const description = req.body.description
            const regNumber = req.body.regnum
            const regex = /^(CA|CY|CF|CAA) \d{3}-\d{3}$/;

          
            if(!description) {
                req.flash('error', "description should not be blank")
            }
            else if (!regNumber) {
                req.flash('error', "regNumber should not be blank")  
            }else if (!regex.test(regNumber)) {
                req.flash('error', "regNumber is invalid - should by CA, CY, CF, CAA followed by 3 numbers - 3 numbers")
            }

            await fuel.addVehicle({description,regNumber})
            res.redirect('vehicle')

        } catch (error) {
            console.log(error)
        }
    }
    // A route for refuelling function 
    async function refill(req,res){
        try {

            const vehicleId = req.params.vehicleId
            const liters = req.body.liters 
            const amount = req.body.amount  
            const distance = req.body.distance 
            const filled_up = req.body.selection

            console.log(vehicleId)
            console.log(liters)
            console.log(amount)
            console.log(distance)
            console.log(filled_up)

            if (!vehicleId) {
                req.flash('error', "vehicleId not specified")
    
            } else
            if (!liters) {
                req.flash('error', "liters not specified")
                
                
            }else if (!amount) {
                req.flash('error', "amount not specified")     
            }
            const carFueled = await fuel.vehicle(vehicleId)
            
            await  fuel.refuel(vehicleId, liters, amount, distance, filled_up)
            res.render('refuel',{carFueled})
        } catch (error) {
            console.log(error)
        }
    }

    return{
        home,
        addVehicle,
        refill
    }
}