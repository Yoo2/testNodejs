
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.registration = function(req, res){
  res.render('Registration',{title:'Registration page'})
};
