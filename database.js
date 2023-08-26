const mongooseClient = require("mongoose")
const MongoUrl = "mongodb://localhost:27017/notepadDB";

mongooseClient.connect(MongoURL, {useNewUrlParser:true, useUnifiedTopology:true,(err)=> {
    if(err) console.log(err);
    }})

const NotesSchema = mongooseClient.Schema({
    title: String,
    description: String,
})

const Notes = mongooseClient.model("Notes", NotesSchema);

module.exports = Notes;