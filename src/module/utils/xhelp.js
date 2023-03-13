import moment from "moment";
const formateDateInner = (datenum) => {
  if (datenum === undefined) {
    return "";
  }
  let tmp = new Date(Number(datenum));
  let ret = moment(tmp).format("YYYY-MM-DD HH:mm"); //DD-MMM-YYYY HH:mm:ss
  return ret;
};

const formateSinceTimeInner = (timesince) => {
  console.log("formateSinceTimeInner", timesince);
  const curTime = Number(Date.now());
  const datenum = curTime - Number(timesince);
  console.log("curTime", curTime);
  console.log("datenum", datenum);
  if (datenum < 60 * 1000) {
    let second = Math.floor(datenum / 1000);
    return second + "s";
  } else if (datenum < 60 * 60 * 1000) {
    let second = Math.floor(datenum / 1000);
    let minute = Math.floor(datenum / 60000);
    second = second - minute * 60;
    let ret = minute + "m " + second + "s";
    return ret;
  } else if (datenum < 24 * 60 * 60 * 1000) {
    let second = Math.floor(datenum / 1000);
    let minute = Math.floor(datenum / 60000);
    let hour = Math.floor(datenum / 3600000);
    second = second - minute * 60;
    minute = minute - hour * 60;
    let ret = hour + "h " + minute + "m " + second + "s";
    return ret;
  } else {
    return formateDateInner(timesince);
  }
};

const xhelp = {
  formateDate: formateDateInner,
  formateSinceTime: formateSinceTimeInner,
};

export default xhelp;
