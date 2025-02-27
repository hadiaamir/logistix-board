import { NextResponse } from "next/server";
import Papa from "papaparse";

// Disable default body parsing to allow form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Parse the incoming form data (this is your file)
    const formData = await req.formData();
    const file = formData.get("file"); // Get the file from form data

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file content (Blob to text)
    const text = await file.text(); // .text() reads the file as a string

    // Parse the CSV content using PapaParse
    const parsedData = Papa.parse(text, {
      header: true, // Use the first row as headers
      skipEmptyLines: true, // Skip empty lines
    });

    if (parsedData.errors.length > 0) {
      throw new Error("CSV parsing error");
    }

    // Process the parsed CSV data and ensure numbers are integers (except for 'date')
    const transformedData = parsedData.data.map((item) => ({
      product_id: item.product_id, // Leave the product_id as a string
      product_name: item.product_name, // Leave the product_name as a string
      date: item.date, // Leave the date as a string (no conversion)
      inventory_level: parseInt(item.inventory_level, 10), // Convert inventory_level to an integer
      orders: parseInt(item.orders, 10), // Convert orders to an integer
      lead_time_days: parseInt(item.lead_time_days, 10), // Convert lead_time_days to an integer
    }));

    // Return the parsed and transformed CSV data
    return NextResponse.json(
      { message: "CSV processed successfully", data: transformedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
