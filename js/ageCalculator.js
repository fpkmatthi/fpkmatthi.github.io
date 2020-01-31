function calcAge() {
  let dob = new Date(1998, 10, 9);
  let today = new Date();

  let timediff = Math.abs(today.getTime() - dob.getTime());
  return Math.floor(timediff / (1000 * 3600 * 24) / 365);
}

function init() {
  document.getElementById('age').innerHTML = calcAge();
}

window.onload = init();
