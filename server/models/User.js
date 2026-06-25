const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

//Schema Creation for user model
const userSchema=new mongoose.Schema({
    username:{
type:String,
required:true,
trim:true,
minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid Email Format");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    phone:{
        type:String,
        required:true,
        minlength:[10,"Minimum 10 digits required!"],
        maxlength:[10,"Maximum 10 Digits required!"]
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    address:{
        type:String,
        required:true
    },
},
{
    timestamps:true
},
);

//Password hashing
userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return ;
    }
    try {
        const salt_round=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(this.password,salt_round);
        this.password=hashedPassword;
    }catch(error){
        console.log(error);
    }
});

//Password verify
userSchema.methods.passwordVerify=function(password){
    return bcrypt.compare(password,this.password);
}

//Token Generate by jwt 
userSchema.methods.generateUserToken= function(){
    try{
        return jwt.sign({
            userId:this._id.toString(),
            email:this.email,
            role:this.role
        },
        process.env.SECRET_KEY,
        {
            expiresIn:"30d"
        }
    )
    }catch(error){
        console.log(error);
    }
}

//Model creation
const User=mongoose.models.User || mongoose.model("User",userSchema);

module.exports=User;