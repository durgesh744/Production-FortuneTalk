export const calculate_discount_price = ({actualPrice, percentage}) => {
  let discountedPrice =
    (parseFloat(actualPrice) * parseFloat(percentage)) / 100;
  return parseFloat(parseFloat(actualPrice) - discountedPrice).toFixed(2);
};

export const sum_price = ({
  firstPrice = 0,
  secondPrice = 0,
  thirdPrice = 0,
  fourthPrice = 0,
}) => {
  return firstPrice + secondPrice + thirdPrice + fourthPrice;
};
