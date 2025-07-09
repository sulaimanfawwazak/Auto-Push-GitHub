import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { FaCode, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Head from "next/head";

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

  const now = new Date();
  // const now = '2025-07-06T18:24:10.824Z'; // Testing
  // const now = '2025-06-19T18:24:10.824Z'; // Testing
  // const now = '2025-06-05T18:24:10.824Z'; // Testing

  const dateStr = now.toISOString().split('T')[0];
  // const dateStr = now.split('T')[0];

  let day = now.getDate();
  // let day = 6;

  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()];
  // let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][6];
  
  let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()]
  // let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][1]

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
  }, [dateStr]);

  // if (loading) {
    // return (
      // <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {/* <p className="text-lg text-gray-600">Loading...</p> */}
      {/* </div> */}
    // );
  // }

  if (loading) {
    return (
      <>
        <Head>
          <title>Today in History</title>
          <meta name="description" content="Discover what happened on this day in history." />
          <link rel="icon" href="/apple-scrolls-emoji.ico" />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-400 rounded-full border-t-black animate-spin"></div>
            <p className="text-lg font-medium text-gray-700">Loading today&apos;s history...</p>
          </div>
        </div>
      </>
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
      <>
        <Head>
          <title>Today in History</title>
          <meta name="description" content="Discover what happened on this day in history." />
          <link rel="icon" href="/apple-scrolls-emoji.ico" />
        </Head>

        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="max-w-md p-6 text-center bg-white shadow-md rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">No &quot;Today In History&quot; Added Today</h2>
            <p className="text-gray-600">This is an automated GitHub Streak Saver. It seems like the dev already made a commit today, so no &quot;Today In History&quot; added.</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={`https://google.com/search?q=${encodeURIComponent("Today in History")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Search It Instead
                </a>
              </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Today in History</title>
        <meta name="description" content="Discover what happened on this day in history." />
        <link rel="icon" href="/apple-scrolls-emoji.ico" />
      </Head>

      <div className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200`}>
        <main className="container px-4 py-8 mx-auto md:py-12">
          {/* Header */}
          <header className="max-w-3xl mx-auto mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Today in History: <span className="text-indigo-600">{day} {month}</span>
            </h1>
          </header>

          {/* History Card */}
          <div className="max-w-3xl mx-auto overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl">
            {/* Image */}
            {history.image_url && (
              <div className="relative h-48 md:h-64 lg:h-80">
                <img 
                  src={history.image_url} 
                  alt={history.title} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{history.title}</h2>
                <p className="text-sm text-gray-500">
                  {(() => {
                    const date = new Date(history.date);
                    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
                    const rest = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                    return `${weekday}, ${rest}`;
                  })()}
                </p>
              </div>
              
              <div className="prose text-gray-700 max-w-none">
                <p>{history.content}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={`https://google.com/search?q=${encodeURIComponent(history.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-sm text-center text-gray-500">
            <p className='font-mono text-sm text-center'>Discover what happened today in history</p>
            <p className='mt-4 font-mono text-sm text-center'>Made with <span className='font-sans'>❤️</span> and <span className='font-sans'>☕</span> by <a className='font-mono text-blue-700 underline underline-offset-2' href="https://github.com/sulaimanfawwazak">pwnwas</a> </p>
            <p className='font-mono text-sm text-center'><a className='text-blue-700 underline' href='https://saweria.co/pwnwas'>Donate</a> buat mam di warmindo 💵😋</p>
            <div className='flex flex-row justify-center py-4 space-x-8'>
              <a href='https://github.com/sulaimanfawwazak'>
                <FaGithub href='https://github.com/sulaimanfawwazak' className='transition cursor-pointer hover:text-blue-700'/>
              </a>
              <a href='https://instagram.com/sfawwazak'>
                <FaInstagram className='transition cursor-pointer hover:text-blue-700'/>
              </a>
              <a href='https://www.linkedin.com/in/sfawwazak/'>
                <FaLinkedinIn className='transition cursor-pointer hover:text-blue-700'/>
              </a>
              <a href='https://sfawwaz-web.vercel.app/'>
                <FaCode className='transition cursor-pointer hover:text-blue-700'/>
              </a>
            </div>
          </footer>
        </main>
      </div>
    </>
    
  );
}
