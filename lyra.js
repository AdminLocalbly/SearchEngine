const {create, insert , remove , search } = require ("@lyrasearch/lyra");

//creating a database for the markets
 function createDB(){
    return create({
        schema:{
            shopId:'string',
            shopName:'string',
            keywords:'string'         
        },
        defaultLanguage:'english',
    })
    }


function addNewMarket(marketDb,Id, ShopName, KeyWords){
    let result;  
    try{
      result = insert(marketDb,{
                shopId:'1',
                shopName:'Hats are rare this days',
                keyWords:'welcome dear friends'
            })
            console.log("line 24", marketDb)
            result= id
            
            return result
    }catch(err){
        console.log(`line 25 inside insert ${err.message}`, err)   
    }
    
   
    
}

//working have been tested
async function searchTerms(Db, word){
  // console.log(">>>>>line 24 <<<<<<< ",word,Db)
  try{
        let searchResult = await search(Db, {
            term:word, 
            properties:'*'//,
        //  tolerance:1
        });
        console.log("line 43 inside  lyra", searchResult)
        return searchResult.hits
    }catch(err){
        console.log("Error on line 44", err.message)
    }
    
}
 
module.exports ={createDB, addNewMarket,searchTerms}