export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = Array.from({ length: 31 }, (_, index) => index + 1);

export function years() {
  const thisYear = new Date().getFullYear();
  let years = [];
  for (let i = thisYear; i >= 1905; i--) {
    years.push(i);
  }

  return years;
}
