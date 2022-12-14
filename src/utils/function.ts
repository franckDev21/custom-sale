import moment from "moment";
import UserService from "../service/UserService";

export const extraiText = (text: string, maxLength: number = 25) => {
  let newContent = [];
  for (let i = 0; i < text.length; i++) {
    if (i + 1 <= maxLength - 3) {
      newContent.push(text[i]);
    }
  }

  if (text.length >= maxLength - 3) {
    return newContent.join("") + "...";
  }
  return text;
};

export const formatCurrency = (number: number, currency: string = "USD") => {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency })
    .format(number)
    .replace("$", "");
};

export const formatDate = (date: string) => {
  return moment(new Date(date)).format("MMMM Do YYYY");
};

export const pttc = (
  pht: number,
  type = "AUCUN"
): { pht: number; pttc: number; totalTVA: number; totalIR: number } => {
  const TVA = 19.5;
  const IR = 5.5;
  const PHT = JSON.parse(JSON.stringify(pht));

  let subTva = (pht * TVA) / 100;
  let subIr = (pht * IR) / 100;
  let pttc = 0;

  if (type === "TVA") {
    pttc = pht + subTva;
  } else if (type === "IR") {
    pttc = pht + subIr;
  } else {
    pttc = pht;
  }

  return {
    pht: PHT,
    pttc,
    totalTVA: subTva,
    totalIR: subIr,
  };
};

export const isContains = (tabSting: string[], search: string): boolean => {
  return tabSting
    .join(",")
    .toLocaleLowerCase()
    .includes(search.toLocaleLowerCase());
};

export const roleIs = (role: string): boolean =>
  isContains(UserService.getAuth().roles || [""], role);

export const user = () => UserService.getUser()