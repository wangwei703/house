
const readHouseList = require("./stat/readlist");
const groupList = require("./stat/group_list");
const calcAvg = require("./stat/calc_avg");
const calcMonAvg = require("./stat/calc_mon_avg");
const calcHome = require("./stat/calc_for_home");
const calcQuantity = require("./stat/calc_quantity");
const calcAvg4Mob = require("./stat/calc_avg4mob");
const write = require("./stat/write");
let { houseList, commArr, dateArr, source, trend } = readHouseList();

dateArr.sort((d1, d2) => d1 > d2 ? 1 : (d1 < d2 ? -1 : 0));
let result;
result = calcAvg(houseList, commArr, dateArr, source);
write("avg", result);
result = calcQuantity(houseList, commArr, dateArr, source);
write("quantity", result);
result = calcMonAvg(trend, source);
write("avgmon", result);
result = calcHome(houseList, commArr, source, trend);
write("home", result);

result = calcAvg4Mob(houseList, commArr, dateArr, source, trend);
write("data", result, true);

result = groupList(houseList, commArr, dateArr, source);
write("list", result);


