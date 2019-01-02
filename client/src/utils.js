exports.sameDay = function(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

exports.sameMonth = function(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
  );
};

exports.addClickedDay = function(clicked, day) {
  return clicked
    .slice()
    .concat([day])
    .sort((d1, d2) => {
      if (d1 < d2) {
        return -1;
      }
      if (d1 > d2) {
        return 1;
      }
      return 0;
    });
};
