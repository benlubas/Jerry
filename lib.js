const random = (min, max) => {
  return parseInt(Math.random() * (max + 1 - min) + min);
};
function shuffle(arr) {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
module.exports = {
  random,
  shuffle,
};
