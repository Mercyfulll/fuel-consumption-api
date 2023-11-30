export default function routes(fuel){

    async function home(req,res){
        try {
            const cars = await fuel.vehicles()
            console.log(cars)
            res.render('index',{cars})
        } catch (error) {
            console.log(error)
        }
    }
    
    async function addVehicle (req,res){
        try {
            const description = req.body.description
            const reg_number = req.body.regnum
            const regex = /^(CA|CY|CF|CAA) \d{3}-\d{3}$/;

            if (!regex.test(reg_number)) {
                req.flash('error', "regNumber is invalid - should by CA, CY, CF, CAA followed by 3 numbers - 3 numbers")
            }
            if (!description) {
                req.flash('error', "description should not be blank")
            }
            if (!reg_number) {
                req.flash('error', "regNumber should not be blank")  
            }

            await fuel.addVehicle(description,reg_number)
            res.redirect('vehicle')

        } catch (error) {
            console.log(error)
        }
    }

    return{
        home,
        addVehicle
    }
}