export const fetchRandomEquation = async () => {
  const response = await fetch('http://localhost:80/extrapolation.php');
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

export const convertDataToPoints = (equation) => {
  return Array(5).fill().map((_, index) => ({
    x: parseFloat(equation[`x1_${index + 1}`]),
    fx: parseFloat(equation[`f(x)_${index + 1}`])
  }));
};