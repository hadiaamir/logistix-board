import fs from 'fs';
import Papa from 'papaparse';

// Function to process the CSV file
export async function processCsv(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8'); // Read the CSV content from file
    console.log('CSV file content:', fileContent);

    // Use papaparse to parse the CSV content
    const parsedData = Papa.parse(fileContent, {
      header: true,   // Use the first row as headers
      skipEmptyLines: true, // Skip any empty lines
    });

    if (parsedData.errors.length > 0) {
      throw new Error('CSV parsing error');
    }

    console.log('Parsed CSV Data:', parsedData.data);
    
    // Return parsed CSV data
    return parsedData.data;
  } catch (error) {
    console.error('Error processing CSV:', error);
    throw new Error('Error processing CSV');
  }
}
