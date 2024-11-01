export const fetchRandomEquation = async () => {
  const response = await fetch('http://localhost:80/interpolation.php');
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

export const convertDataToPoints = (equation) => {
  return Array(5).fill().map((_, index) => ({
    x: parseFloat(equation[`${index + 1}x`]),
    y: parseFloat(equation[`${index + 1}f(x)`])
  }));
};