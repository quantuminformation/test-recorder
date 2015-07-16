//todo make this more robust, or let user specify manually
export default function () {
  let isAngular = window.angular;
  let isEmber = window.ember;

  if (isAngular) {
    return "angular";
  } else if (isEmber) {
    return "ember";
  }
  else {
    throw ("no framework found")
  }
}
