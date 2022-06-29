const mongoose = require("mongoose");
//if you get any warnings
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useUnifiedTopology', true);


class Database{
    //it is a constructor to call th function connect()
    constructor() {
        this.connect();
    }
    //connect is a function to establish the connection
    connect() {
        mongoose.connect("mongodb+srv://vrindagoel1:vrindagoel1@cluster1.kacol.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority")
        .then(() => {
            console.log("TwitterCloneDB database connected");
        })
        .catch((err) => {
            console.log("database connection error" + err);
        })
        //if mongoose.connect runs the it will go to then() otherwise it will go to catch() block
    }
}

module.exports = new Database();