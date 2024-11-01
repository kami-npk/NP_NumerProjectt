export const fetchRandomEquation = async () => {
  const response = await fetch('http://localhost:80/different.php');
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};