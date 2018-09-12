export const makeSexyDate = seconds => {
  const date = new Date(null);
  date.setTime(seconds);
  return date.toLocaleString();
};

export const makeMoneyForm = str => {
  return str.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const stringToJSON = str => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

export const parseMessage = message => {
  if (typeof message.data === "string") {
    const { data } = message;
    const parsedMessage = stringToJSON(data);
    if (parsedMessage !== null) {
      const { type } = parsedMessage;
      if (type === "BLOCKCHAIN_RESPONSE") {
        return parsedMessage.data;
      } else {
        return null;
      }
    }
  }
};
