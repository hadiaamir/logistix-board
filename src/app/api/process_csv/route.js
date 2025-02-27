import { IncomingForm } from 'formidable';
import os from 'os';
import Papa from 'papaparse';
import fs from 'fs';

// Disable default body parsing for Next.js API route
export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};

// Named export for POST request
export async function POST(req, res) {
  const form = new IncomingForm({
    keepExtensions: true,
    uploadDir: os.tmpdir(), // Use the system's temporary directory for uploads
  });

  try {
    // Parse the form data asynchronously
    const formData = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(new Error('Error parsing form data'));
        } else {
          resolve({ fields, files });
        }
      });
    });

    const filePath = formData.files.csvFile[0].filepath; // The path of the uploaded CSV file
    console.log('CSV file path:', filePath);

    // Call the process_csv function to parse and handle the CSV
    const csvData = await process_csv(filePath);

    // Send the parsed CSV data back as JSON
    res.status(200).json(csvData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error parsing form data' });
  }
}

// Function to process CSV data
async function process_csv(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8'); // Read the CSV file content
    console.log('CSV file content:', fileContent);

    // Use papaparse to parse the CSV data
    const parsedData = Papa.parse(fileContent, {
      header: true,   // Treat the first row as the header
      skipEmptyLines: true, // Skip empty lines
    });

    if (parsedData.errors.length > 0) {
      throw new Error('CSV parsing error');
    }

    console.log('Parsed CSV Data:', parsedData.data);

    // Here you can process or transform the data as needed
    return parsedData.data;
  } catch (error) {
    console.error('Error processing CSV:', error);
    throw new Error('Error processing CSV');
  }
}
