const converObjectToString = (object: any) => {
  var string = "";
  Object.keys(object).map((item) => {
    string = item + `: "` + object[item] + `" ,` + string;
  });
  return string;
};
export default converObjectToString;
