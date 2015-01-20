/* GET /Search/keywords 
view all recipes that have the keyword in their title*/

router.get('Search/:keyword', function(req, res) {
	//search only works if a single word entered into the search
	var searchword = req.param('keyword');
	recipes.Recipe.find({name: searchword}, function(err, results) {
		console.log(results);
		res.render('multiplerecipes', { recipe_list: results });
	});
});




  /* GET /Recipes/123 
    view a specific recipe */
  router.get('/Recipes/:id', function(req, res) {
    var recipeId = req.param('id');
    recipes.Recipe.findOne({_id: recipeId}, function(err, result) {
      console.log(result);
      res.render('singlerecipe', { recipe: result });
    });
  });


// example:
// The following operation returns all the documents 
// from the products collection where qty is greater 
// than 25 and returns only the _id, item and qty fields:
// db.products.find( { qty: { $gt: 25 } }, { item: 1, qty: 1 } )




//don't know how to search with multiple words yet
// router.get('/#q=:keywords', function(req, res) {
// 	//split the keywords (if there were spaces in the search they will
// 		//be replaced by pluses in the url)
// 	var search_keywords = req.param('keywords');
// 	var split = search_keywords.split("+");
// 	//search by each keyword
// 	for key in split:
// 		recipes.Recipe.find({recipe_name: key || recipe_name: key}, function(err, result) {
// 			console.log(result);
// 			res.render('multiplerecipes', { recipe_list: result });
// 		});
// });