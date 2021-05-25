function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

function parseISO8601Duration(iso8601Duration) {
  var iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

  var matches = iso8601Duration.match(iso8601DurationRegex);

  return {
    sign: matches[1] === undefined ? "+" : "-",
    years: matches[2] === undefined ? 0 : matches[2],
    months: matches[3] === undefined ? 0 : matches[3],
    weeks: matches[4] === undefined ? 0 : matches[4],
    days: matches[5] === undefined ? 0 : matches[5],
    hours: matches[6] === undefined ? 0 : matches[6],
    minutes: matches[7] === undefined ? 0 : matches[7],
    seconds: matches[8] === undefined ? 0 : matches[8],
  };
}

function getISOStringWithoutSecsAndMillisecs1(date) {
  const dateAndTime = date.toISOString().split("T");
  const time = dateAndTime[1].split(":");

  return dateAndTime[0] + "T" + time[0] + ":" + time[1];
}

module.exports = {
  getRandomString,
  parseISO8601Duration,
  getISOStringWithoutSecsAndMillisecs1,
};
