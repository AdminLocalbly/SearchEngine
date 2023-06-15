const {create, insert, search } = require('@lyrasearch/lyra'); 

const movieDB = create({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean'
  }
});


const { id: thePrestige } = insert(movieDB, {
    title: 'The prestige',
    director: 'Christopher Nolan',
    plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.',
    year: 2006,
    isFavorite: true
  });
const searchResult = search(movieDB, {
        term: 'fellow magicians',
        properties: "*",
});
//console.log("line 25", movieDB)
  console.log("line 13 checking propeerties of movie db ", searchResult) 
//   const { id: bigFish } = insert(movieDB, {
//     title: 'Big Fish',
//     director: 'Tim Burton',
//     plot: 'Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.',
//     year: 2004,
//     isFavorite: true
//   });
  
//   const { id: harryPotter } = insert(movieDB, {
//     title: 'Harry Potter and the Philosopher\'s Stone',
//     director: 'Chris Columbus',
//     plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
//     year: 2001,
//     isFavorite: false
//   });

//   //console.log(harryPotter); // 79741872-5

//   const searchResult = search(movieDB, {
//     term: 'Harry',
//     properties: "*",
//   });

//   //console.log("line 44",searchResult)
//   console.log("line 52", movieDB)
//   const searchResult1 = search(movieDB, {
//     term: 'Harry',
//     properties: '*',
//     tolerance: 1,
//   });

 
//   //console.log("line 50 tDB", movieDB)
//   // console.log("line 54 ",searchResult1.hits[0].document)
//   // console.log("line 34", searchResult1)
//   //console.log("line  52         ",JSON.stringify(searchResult1.document))