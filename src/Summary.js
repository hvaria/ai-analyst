// // // Summary.js
// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import GrossProfitChart from './GrossProfitChart';

// // const Summary = () => {
// //   const [summaryData, setSummaryData] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     const fetchSummary = async () => {
// //       try {
// //         const response = await fetch(`/api/summary/file.json`);
// //         if (!response.ok) {
// //           throw new Error(`HTTP Error: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         setSummaryData(data);
// //         setLoading(false);
// //       } catch (error) {
// //         setError(`Failed to fetch summary: ${error.message}`);
// //         setLoading(false);
// //       }
// //     };

// //     fetchSummary();
// //   }, []);

// //   const renderContentPart = (part, index) => {
// //     if (part.text) {
// //       return <p key={index}>{part.text}</p>;
// //     }
// //   };

// //   if (loading) return <p>Loading...</p>;
// //   if (error) return <p>Error: {error}</p>;



// //   return (
// //     <div>
// //       <h1>Summary Insights</h1>
// //       {Object.entries(summaryData).map(([prompt, result], index) => (
// //         <div key={index}>
// //           <h2>{prompt}</h2>
// //           {result.candidates && result.candidates.length > 0 && 
// //             result.candidates[0].content.parts.map((part, partIndex) => renderContentPart(part, partIndex))}
// //           {prompt.includes("Dynamically identify and extract the gross profit amounts for each department") && (
// //             <GrossProfitChart grossProfitData={JSON.parse(result.candidates[0].content.parts[0].text).gross_profit} />
// //           )}
// //         </div>
// //       ))}
// //       <Link to="/">Go Back</Link>
// //     </div>
// //   );
// // };

// // export default Summary;

// // // // Summary.js
// // // import React, { useState, useEffect } from 'react';
// // // import { Link } from 'react-router-dom';
// // // import GrossProfitChart from './GrossProfitChart';

// // // const Summary = () => {
// // //   const [grossProfitData, setGrossProfitData] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const response = await fetch('/api/data/file.json');
// // //         if (!response.ok) {
// // //           throw new Error(`HTTP Error: ${response.status}`);
// // //         }
// // //         const data = await response.json();
// // //         const grossProfit = data["Dynamically identify and extract the gross profit amounts for each department and encode this data in JSON for charting and analysis"].candidates[0].content.parts[0].text;
// // //         const parsedGrossProfit = JSON.parse(grossProfit).gross_profit;
// // //         setGrossProfitData(parsedGrossProfit);
// // //         setLoading(false);
// // //       } catch (error) {
// // //         setError(`Failed to fetch data: ${error.message}`);
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   if (loading) return <p>Loading...</p>;
// // //   if (error) return <p>Error: {error}</p>;

// // //   return (
// // //     <div>
// // //       <h1>Gross Profit by Department</h1>
// // //       <GrossProfitChart grossProfitData={grossProfitData} />
// // //       <Link to="/">Go Back</Link>
// // //     </div>
// // //   );
// // // };

// // // export default Summary;

// // Summary.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const Summary = () => {
//   const [storeName, setStoreName] = useState('');
//   const [reportingPeriod, setReportingPeriod] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const response = await fetch(`/api/summary/file.json`);
//         if (!response.ok) {
//           throw new Error(`HTTP Error: ${response.status}`);
//         }
//         const data = await response.json();

//         // Extract the store name and reporting period from the summary data
//         const contentText = data["Analyze the image and extract general information about the report date, company name, and reporting period."].candidates[0].content.parts[0].text;
//         const storeNameMatch = contentText.match(/\*\*Company Name:\*\* ([^\n]+)/);
//         const reportingPeriodMatch = contentText.match(/\*\*Reporting Period:\*\* ([^\n]+)/);

//         if (storeNameMatch && storeNameMatch.length > 1) {
//           setStoreName(storeNameMatch[1].trim());
//         }
//         if (reportingPeriodMatch && reportingPeriodMatch.length > 1) {
//           setReportingPeriod(reportingPeriodMatch[1].trim());
//         }

//         setLoading(false);
//       } catch (error) {
//         setError(`Failed to fetch summary: ${error.message}`);
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div style={{ textAlign: 'center' }}>
//       <h1 style={{ fontWeight: 'normal' }}>{storeName}</h1>
//       <p style={{ fontSize: 'smaller' }}>{reportingPeriod}</p>
//       {/* Other content */}
//       <Link to="/">Go Back</Link>
//     </div>
//   );
// };

// export default Summary;











// Summary.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import GrossProfitChart from './GrossProfitChart';

const Summary = () => {
  // const [summaryData, setSummaryData] = useState({});
  const [storeName, setStoreName] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/summary/file.json`);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        // setSummaryData(data);

        // Extract gross profit data
        const insight = data["Summarize the Profit and Loss Data insights"].candidates[0].content.parts[0].text;
        setInsight(insight);


        // Extract the store name and reporting period from the summary data
        const contentText = data["Analyze the image and extract general information about the report date, company name, and reporting period."].candidates[0].content.parts[0].text;
        const storeNameMatch = contentText.match(/\*\*Company Name:\*\* ([^\n]+)/);
        const reportingPeriodMatch = contentText.match(/\*\*Reporting Period:\*\* ([^\n]+)/);

        if (storeNameMatch && storeNameMatch.length > 1) {
          setStoreName(storeNameMatch[1].trim());
        }
        if (reportingPeriodMatch && reportingPeriodMatch.length > 1) {
          setReportingPeriod(reportingPeriodMatch[1].trim());
        }

        setLoading(false);
      } catch (error) {
        setError(`Failed to fetch summary: ${error.message}`);
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // const renderContentPart = (part, index) => {
  //   if (part.text) {
  //     return <p key={index}>{part.text}</p>;
  //   }
  // };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontWeight: 'normal' }}>{storeName}</h1>
        <p style={{ fontSize: 'smaller' }}>{reportingPeriod}</p>
      </div>


      <h2>Insights</h2>
      <p>{insight}</p>

      <Link to="/">Go Back</Link>
    </div>
  );
};

export default Summary;
