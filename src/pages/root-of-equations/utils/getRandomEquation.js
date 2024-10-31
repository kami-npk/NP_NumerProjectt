import { toast } from "sonner";

export const getRandomEquation = async (setEquation, setXL, setXR) => {
  try {
    const response = await fetch('http://localhost/rootofequation.php');
    const data = await response.json();

    // Filter to get only the required IDs
    const filteredData = data.filter(item => 
      ["1", "2", "3"].includes(item.data_id)
    );

    // Select a random equation
    if (filteredData.length > 0) {
      const randomEquation = filteredData[Math.floor(Math.random() * filteredData.length)];
      
      // Set the values directly from the API response
      setEquation(randomEquation.fx);
      if (setXL) setXL(randomEquation.xl);
      if (setXR) setXR(randomEquation.xr);
      
      toast({
        title: "Equation loaded",
        description: "Random equation has been loaded successfully.",
      });
    }
  } catch (error) {
    console.error('Error fetching random equation:', error);
    toast({
      title: "Error",
      description: "Failed to fetch random equation.",
      variant: "destructive",
    });
  }
};