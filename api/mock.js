/**
 * Mock data generator for testing
 */

/**
 * Generate client distribution data (multi-series data)
 * @param {string} from - Start date
 * @param {string} to - End date
 * @returns {Array} Generated client distribution data
 */
function generateClientDistributionData(from, to) {
  const data = [];
  const fromDate = new Date(from);
  const toDate = new Date(to);
  let currentDate = new Date(fromDate);
  
  // Generate hourly data for every 4 hours
  while (currentDate <= toDate) {
    for (let hour = 0; hour < 24; hour += 4) {
      // Format as "YYYY-MM-DD HH:00:00"
      const hourStr = `${currentDate.toISOString().split('T')[0]} ${String(hour).padStart(2, '0')}:00:00`;
      
      // Generate values with some trends
      const timeOfDay = hour;
      const dayMultiplier = timeOfDay >= 8 && timeOfDay <= 16 ? 1.5 : 1; // Higher during work hours
      
      data.push({
        hour: hourStr,
        Lighthouse: Math.floor((Math.random() * 50 + 250) * dayMultiplier),
        Teku: Math.floor((Math.random() * 30 + 180) * dayMultiplier),
        Lodestar: Math.floor((Math.random() * 20 + 120) * dayMultiplier),
        Nimbus: Math.floor((Math.random() * 15 + 95) * dayMultiplier),
        Erigon: Math.floor((Math.random() * 10 + 45) * dayMultiplier),
        Unknown: Math.floor((Math.random() * 5 + 20) * dayMultiplier)
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

/**
 * Generate simple metric data
 * @param {string} metricId - Metric ID
 * @param {string} from - Start date
 * @param {string} to - End date
 * @returns {Array} Generated metric data
 */
function generateMetricData(metricId, from, to) {
  const data = [];
  const fromDate = new Date(from);
  const toDate = new Date(to);
  let currentDate = new Date(fromDate);
  
  // Generate daily data points
  while (currentDate <= toDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    let value;
    switch (metricId) {
      case 'queryCount':
        value = Math.floor(Math.random() * 100000) + 100000;
        break;
      case 'queryDuration':
        value = (Math.random() * 0.2 + 0.8).toFixed(3);
        break;
      case 'errorRate':
        value = (Math.random() * 0.5 + 0.1).toFixed(2);
        break;
      default:
        // For unknown metrics, generate reasonable values based on the ID
        if (metricId.toLowerCase().includes('count') || metricId.toLowerCase().includes('total')) {
          value = Math.floor(Math.random() * 50000) + 10000;
        } else if (metricId.toLowerCase().includes('rate') || metricId.toLowerCase().includes('percent')) {
          value = (Math.random() * 10).toFixed(2);
        } else if (metricId.toLowerCase().includes('time') || metricId.toLowerCase().includes('duration')) {
          value = (Math.random() * 2 + 0.5).toFixed(3);
        } else if (metricId.toLowerCase().includes('size') || metricId.toLowerCase().includes('bytes')) {
          value = Math.floor(Math.random() * 1000000) + 500000;
        } else {
          value = Math.floor(Math.random() * 100);
        }
    }
    
    data.push({ date: dateStr, value });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

/**
 * Generate mock data for a custom metric format
 * Detects the metric type from the metricId and query to generate appropriate mock data
 * @param {string} query - SQL query
 * @param {string} metricId - Metric ID
 * @returns {Array} Mock data matching expected format
 */
function generateCustomMetricData(query, metricId) {
  // Extract date pattern from query to determine if it's hourly or daily
  const isHourly = query.includes('toStartOfHour') || query.includes('toHour');
  
  // Get standard date range
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  
  if (isHourly) {
    return generateClientDistributionData(from.toISOString().split('T')[0], to.toISOString().split('T')[0]);
  } else {
    return generateMetricData(metricId, from.toISOString().split('T')[0], to.toISOString().split('T')[0]);
  }
}

module.exports = {
  generateClientDistributionData,
  generateMetricData,
  generateCustomMetricData
};