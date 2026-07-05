// src/utils/reporter.js

// Import only your local, single-line bundle file
import { htmlReport } from './bundle.js'; 

export function generateReports(data) {
  const reportName = __ENV.TEST_NAME || 'summary'; 
  
  return {
    // Converts the metrics map into a text-readable JSON format for the terminal
    'stdout': JSON.stringify(data, null, 2), 
    
    // Prefixing with './' explicitly binds the path mapping to your local project directory on Windows
    [`./reports/${reportName}.html`]: htmlReport(data, { 
      title: `Restful-Booker API Performance: ${reportName.toUpperCase()}`,
    }),
  };
}
