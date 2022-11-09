import moment from "moment";

export const extraiText = (text: string, maxLength: number = 25) => {
  let newContent = [];
  for (let i = 0; i < text.length; i++) {
    if (i+1 <= (maxLength - 3)) {
      newContent.push(text[i]);
    }
  }

  if(text.length >= (maxLength - 3)){
    return newContent.join("")+'...'
  }
  return text
};

export const formatCurrency = (number: number,currency: string = 'USD') => {
 return (new Intl.NumberFormat("de-DE", {style: "currency", currency}).format(number)).replace('$','');
}


export const formatDate = (date: string) => {
  return moment(new Date(date)).format('MMMM Do YYYY')
}

export const pttc = (pht: number, type = 'AUCUN'): number => {
  const TVA = 19.5
  const IR = 5.5

  let subTva = pht * TVA/100
  let subIr  = pht * IR/100
  let pttc = 0

  if(type === 'TVA'){
    pttc = pht + subTva
  }else if(type === 'IR'){
    pttc = pht + subIr
  }else{
    pttc = pht
  }
  
  return pttc
}