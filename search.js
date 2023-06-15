const fs = require('fs')
const express = require('express');
const helmet = require('helmet');
const cors = require("cors");
//const {addNewMarket, createDB, searchTerms} = require("./lyra")
//   const regex = require("regex")      // tool for validating input into the api 
const { persistToFile, restoreFromFile } = require('@lyrasearch/plugin-data-persistence')

const {insert, search, create} = require("@lyrasearch/lyra");

const logger = require("./logger")



app = express()

app.use(helmet())
app.use(cors()); 
app.use(express.json())
port = process.env.PORT || 8080;

//app.use(logger)


let filePath = __dirname;



const mysqlDb = require("./conectDB");
const { Timestamp } = require('mongodb');
const { timeStamp, error } = require('console');


createSearchTable = "CREATE TABLE searchTable ( id int, shopName varchar(255), tags varchar(255) )";

mysqlDb.query(createSearchTable,(err,result)=>{
    try {
        if(err){
            console.log("search table already exists", err.message);
            
            //add logging functionality 
        }
       
    } catch (error) {
        //logger 
        logger.error("Search table already exists ", err);
    }
   
})


createSearchTermsTable = "CREATE TABLE searchterms (id int NOT NULL AUTO_INCREMENT,timestamp datetime, terms varchar(255) )";
mysqlDb.query(createSearchTermsTable,(err,result)=>{
    try {
        if(err){
            logger.error("Search terms table already exists", err.message);
        }
    } catch (error) {
        logger.error("Search terms table in db ", err.message);
    }
    
});







//creating database
let marketDb=create({
    schema:{
        shop:'string',
        shopName:'string', 
        tags:'string'
},
    defaultLanguage:'english'
});

//after creating a local db populate it with data from the database 
function updatingLocalDb(){
    console.log("implementing update localDb");
    let  getData = "select * from searchtable";
    try {
        mysqlDb.query(getData,(err, result)=>{
            if(err){
                throw new Error("searchtable unavailable in db ");
            }
            result.forEach((row)=>{
                res = insert(marketDb,{
                        shop: row.id.toString(),
                        shopName:row.shopName,
                        tags:row.tags
                    })
            })
        
        })
    } catch (error) {

        //logger 
        logger.error("error when creating search table db", err.message);
    }
}
//update db for the first time 
updatingLocalDb();

// run this function after every 1 hour 
// hence db is update every 1 hour
let updateLocaldbTime = 1000 * 60 * 60; 
setTimeout(function() {
    updatingLocalDb();
    logger.info("Local Db updated");
}, updateLocaldbTime);


fs.readdir(filePath, (error, files) => {

    try{
        // if (error){
        //     throw new Error("Error occured while saving file");
        // }

        files.forEach(file =>{
             
            if(file === "MarketSearchDB.msp"){ 
                fs.readFile(file, (err, data)=>{
                    if(data.length !== 0){
                        marketDb  =  restoreFromFile('json','./MarketSearchDB.msp')
                    }else {
                        console.log("unlinking file")
                        fs.unlink(file, (err)=>{
                            if(err)// next(err)
                            {
                                //console.log(err.stack)
                                logger.error("Error while reading local db ", err.message);
                            }
                        })
                        
                    }
                })
                
                // console.log("line 45 restore from file", marketDb)
                }
        }
        )
    }catch(err){
        logger.error("Saving to the filesystem",err.name , err.message, err.stack)
    }
})







//endpoint to add a new market 
app.post('/addNew',(req,res)=>{
        if(!marketDb){
            throw new Error("No DB avilable")
        }
       //validate data into the api using regex 
       let id = req.body.id;
       let shopName = req.body.shopName;
       let keyWords = req.body.keyWords;
       let result;
       //call db to add the new items 
       try{
           // result = addNewMarket(marketDB,id, shopName, keyWords);
           result = insert(marketDb,{
                shop: id,
                shopName:shopName,
                tags:keyWords
           })

           insertData = `INSERT INTO searchTable (id, shopName,tags) VALUES ('${id}', '${shopName}', '${keyWords}');`

           

            mysqlDb.query(insertData, (err, result)=>{
               
               if(err) throw new Error("Could not insert data to the database");
            });

          
            
            if(result){
                res.statusMessage = "New shop has been added"
                res.status(200).end()
               // console.log("inside insert line 50 ",result, marketDB)
            }else{
                let errorMessage = "could not add the new shop"
                res.statusMessage = errorMessage
                res.status(500).end()
                throw new Error(errorMessage)
                
            }
           
        } catch(err){
            //throw error incase params required are not
           // res.status(500).json({"error":"could not add a new shop"})
           logger.error("error in the addNew route",err.message);
        }
        
})

app.get('/editTags', (req, res)=>{
    try {
        let shopName = req.body.shopName;
        let Newtags =  req.body.tags;
        if(!shopName){
            throw new Error ("Invalid shopName");
        }

        let sqlreq = `select * from searchtable where shopName='${shopName}'`;
        let Newid; 
        let NewshopName;


        mysqlDb.query(sqlreq,(err, result)=>{
            //error checking 
            if (err) throw new Error(`In editTags failed to access in db  shopName called = ${shopName}`);
            //expecting result as a dict with one value 
            Newid = result[0].id;  
            NewshopName = result[0].shopName;
        

        })

    
        let sqlInsert = `insert into searchtable (id, shopName, tags) VALUES ('${Newid}', '${NewshopName}', '${Newtags}') where shopName='${shopName}'`;
        mysqlDb.query(sqlInsert, (err, result)=>{
            if (err) throw new Error(`failed to edit new tags for shopName =  ${shopName}`);
        })
        //get the tags from current db add to the tags then republish the tags content 
        

    } catch (error) {
        //logger 
        logger.error("Error in the editTags route ",err.message)
        
    }
   

   
})

// app.get('/search/id/:terms', (req, res)=>{
//     try {
//         let id = req.params.id;
//         if (!id){
//             throw new Error("Unavailable id in  search terms");
//         }
//         let sqlID = `select * from searchtable where id = '${id}'`
//     } catch (error) {
        
//     }
    
   
// })
//endpoint to search a new market
app.get('/search/:terms',(req,res)=>{
    let searchTerm = req.params.terms;

    // to search for a specific term use specify that ID in the body 
    let specifiedID = req.body.id;


    let result;
    let date = new Date().toJSON();
    try{
        //adding a new search term to the db 
        addSearchedTerm = `INSERT INTO searchterms ( timestamp, terms) VALUES ( '${date}', '${searchTerm}');`
        mysqlDb.query(addSearchedTerm,(err, result)=>{
            if (err) throw new Error("Failed to add a new searhed term");
        })
        //getting the search term in the local db 
        result = search(marketDb,{
            term:searchTerm,
            properties:'*'
        })
        if (specifiedID){
            result.forEach(row => {
                if(row.id === specifiedID){
                    res.status(200).json({
                        "result": row
                    })
                }
            });
        }
        
            
        if(!result){
            res.statusMessage = "Could not match to any shops"
            res.status(400).end()
            throw new Error(res.statusMessage)
        }else{
           res.status(200).json(
            {
                "result":result.hits,
                "noOfHits":result.count
            }) 
        }
      
    }catch(err){
        logger.error("Error when searching for terms", err) //later substitute for data logger
    }
    
})



app.listen(port,()=>{
    console.log(`search engine server running on port ${port}`);
    //Emitting the event 
   
    
});
// app.on('close',()=>{
//     console.log("closing the application")
// })




