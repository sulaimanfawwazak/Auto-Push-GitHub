import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // const now = new Date();
  const now = '2025-07-06T18:24:10.824Z';
  // const now = '2025-06-19T18:24:10.824Z';

  // const dateStr = now.toISOString().split('T')[0];
  const dateStr = now.split('T')[0];
  // let day = now.getDate();
  let day = 6;
  // let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()];
  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][6];
  // let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()]
  let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][1]

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/fetch-history?date=${dateStr}`);
        const json = await res.json();
        setHistory(json.data);
      }
      catch (error) {
        console.error("Failed to fetch history:", error);
      }
      finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  // if (loading) {
    // return (
      // <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {/* <p className="text-lg text-gray-600">Loading...</p> */}
      {/* </div> */}
    // );
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-400 rounded-full border-t-black animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading today's history...</p>
        </div>
      </div>
    );
  }

  // if (!history) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <p className="text-lg text-gray-600">No history found for today.</p>
  //     </div>
  //   );
  // }

  if (!history) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-md p-6 text-center bg-white shadow-md rounded-xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">No "Today In History" Added Today</h2>
          <p className="text-gray-600">This is an automated GitHub Streak Saver. It seems like the dev already made a commit today, so no "Today In History" added.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 mt-4 text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 ">
    <div className={`min-h-screen bg-gradient-to-br form-gray-100 to gray-200 ${geistSans.variable} ${geistMono.variable}`}>
      {/* Title */}
      <div className="w-full max-w-xl">
        <h1 className="mb-6 text-4xl font-bold text-left">
          Today in History: {day} {month}
        </h1>
      </div>

      {/* History Card */}
      <div className="w-full max-w-xl space-y-2 bg-white shadow-md rounded-xl">
        <div>
          {/* Image */}
          {history.image_url && (
            <img 
              src={history.image_url} 
              alt={history.title} 
              className="w-full rounded-t-xl"
            />
          )}

        </div>

        {/* Title */}
        <div className="px-6 py-4 space-y-2">
          <h2 className="text-xl font-bold">{history.title}</h2>
          {/* Description */}
          <p className="text-sm">
            {(() => {
              const date = new Date(history.date);
              const weekday = date.toLocaleDateString("en-GB", { weekday: "long" }); // Weekday
              const rest = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); // 3 December 1967
              return `${weekday}, ${rest}`;
            })()}
          </p>

          {/* Description */}
          <p className="text-lg">{history.content}</p>

          {/* Read More button */}
          <a
            href={`https://google.com/search?q=${encodeURIComponent(history.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2 py-1 mt-4 text-center text-white bg-black rounded-md hover:bg-gray-700"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}
