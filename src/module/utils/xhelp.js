import moment from "moment";
import { def_ipfs_public_gateway } from "./xdef";
const formateDateInner = (datenum) => {
  if (datenum === undefined) {
    return "";
  }
  let tmp = new Date(Number(datenum));
  let ret = moment(tmp).format("YYYY-MM-DD HH:mm"); //DD-MMM-YYYY HH:mm:ss
  return ret;
};

const formateSinceTimeInner = (timesince) => {
  const curTime = Number(Date.now());
  const datenum = curTime - Number(timesince);
  if (datenum < 60 * 1000) {
    return "NOW";
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

const convertImageUrlFromIPFSToGFSInner = (str) => {
  let tar = "![image](" + def_ipfs_public_gateway + "/ipfs/";
  let new_str = str.replaceAll(tar, "![image](gamefisociety/temp/image/");
  return new_str;
};

const convertImageUrlFromGFSToIPFSInner = (str) => {
  let tar = "![image](gamefisociety/temp/image/";
  let new_str = str.replaceAll(
    tar,
    "![image](" + def_ipfs_public_gateway + "/ipfs/"
  );
  return new_str;
};

const isJsonInner = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
const xhelp = {
  formateDate: formateDateInner,
  formateSinceTime: formateSinceTimeInner,
  convertImageUrlFromIPFSToGFS: convertImageUrlFromIPFSToGFSInner,
  convertImageUrlFromGFSToIPFS: convertImageUrlFromGFSToIPFSInner,
  isJson: isJsonInner
};

export default xhelp;
