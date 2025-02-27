import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ThresholdChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        {/* Historical Inventory Line */}
        <Line type="monotone" dataKey="inventory_level" stroke="#8884d8" dot={false} />
        
        {/* Threshold Lines */}
        <Line type="monotone" dataKey="lowThreshold" stroke="#ff7300" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="mediumThreshold" stroke="#82ca9d" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="highThreshold" stroke="#ff0000" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ThresholdChart
