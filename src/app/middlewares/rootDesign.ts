import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import os from "os";


const rootDesign = (req: Request, res: Response) => {
   // Get system uptime (in hours, minutes)
   const uptime = os.uptime(); // seconds
   const uptimeHours = Math.floor(uptime / 3600);
   const uptimeMinutes = Math.floor((uptime % 3600) / 60);
 
   // Get CPU load (average over last 1 min)
   const loadAverage = os.loadavg()[0]; // 1-min avg
 
   // Get memory usage
   const totalMem = os.totalmem() / (1024 * 1024 * 1024); // GB
   const freeMem = os.freemem() / (1024 * 1024 * 1024); // GB
   const usedMem = totalMem - freeMem;
   
   // Get last check timestamp
   const lastCheck = new Date().toLocaleTimeString();
 
   res.status(StatusCodes.OK).send(`
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Server Status</title>
       <style>
         body {
           font-family: "Courier New", monospace;
           background-color: #121212;
           color: #00ff00;
           text-align: center;
           padding: 50px;
         }
         .container {
           max-width: 600px;
           margin: auto;
           padding: 20px;
           border: 2px solid #00ff00;
           border-radius: 8px;
           background: #1a1a1a;
           box-shadow: 0px 0px 15px rgba(0, 255, 0, 0.5);
         }
         h1 {
           color: #00ff00;
         }
         p {
           color: #cfcfcf;
         }
         .status-box {
           background: #000;
           padding: 15px;
           border-radius: 5px;
           text-align: left;
           font-size: 14px;
         }
         button {
           background-color: #00ff00;
           color: #121212;
           border: none;
           padding: 10px 20px;
           font-size: 14px;
           border-radius: 4px;
           cursor: pointer;
           font-weight: bold;
           margin-top: 10px;
           transition: background 0.3s ease;
         }
         button:hover {
           background-color: #33ff33;
         }
       </style>
     </head>
     <body>
       <div class="container">
         <h1>🔌 SERVER STATUS</h1>
         <div class="status-box">
           <p>> SYSTEM: Online ✅</p>
           <p>> UPTIME: ${uptimeHours}h ${uptimeMinutes}m</p>
           <p>> CPU Load: ${loadAverage.toFixed(2)}%</p>
           <p>> Memory Usage: ${usedMem.toFixed(1)} GB / ${totalMem.toFixed(1)} GB</p>
           <p>> Last Check: ${lastCheck}</p>
         </div>
         <form action="/" method="get">
           <button type="submit">🔄 Refresh Status</button>
         </form>
       </div>
     </body>
   </html>
   `);
};

export default rootDesign;
