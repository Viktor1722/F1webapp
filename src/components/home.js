"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-coal bg-zinc-900">
      <>
        <section className="flex flex-wrap gap-3 items-end">
          <div className="bg-zinc-900 border-none">
            <div className="text-2xl text-white py-8">
              <div className="text-f1Red text-sm">Round 8 Last Race</div>
              <div className="py-2"> 2024</div>
              <div className="text-base  text-slate-50">
                Home glory for Leclerc as he controls Monaco Grand Prix to win
                for Ferrari from Piastri and Sainz
              </div>
            </div>
            <div>
              <div className="w-full overflow-x-auto scroll-smooth scrollbar-hide rounded-lg">
                <div className="flex flex-col justify-center items-start space-y-1 gap-2">
                  <div
                    className={`flex-none bg-white w-full rounded-lg flex justify-between items-center p-4 `}
                  >
                    <div className="flex flex-row items-center space-x-2 gap-3">
                      <span className="text-lg font-bold"></span>
                      <div>
                        <p className="text-sm font-semibold">
                          <span className="font-bold"></span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-400"></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-start space-x-2 mt-2">
              <button
                variant="outline"
                className="bg-f1Red text-white px-6 py-2 border-none"
              >
                RESULTS
              </button>
              <button
                variant="outline"
                className="bg-zinc-900 text-white border border-white px-6 py-2"
              >
                HIGHLIGHTS
              </button>
            </div>
          </div>

          <div className="mt-4 bg-zinc-900 border-none">
            <div className="text-2xl">
              <div className="flex gap-2">
                <div className="text-f1Red text-sm">Round 9 Next Race</div>
              </div>
              <div className="flex gap-4 items-center mt-1">
                <p className="text-white"></p>
              </div>
              <p className="text-white"></p>
              <p className="text-white text-lg mt-1">17-19 May</p>
              <div className="text-lg w-[500px] text-slate-50"></div>
            </div>
            <div>
              <div className="bg-slate-900 px-4 py-4 rounded-xl">
                <div className="flex gap-4 items-center justify-between">
                  <p className="text-sm text-white">PRACTICE 1</p>
                  <p className="text-gray-400 text-sm">FRI</p>
                  <p className="text-white bg-zinc-800 px-2 py-1 rounded-2xl text-sm">
                    13:30 - 14:30
                  </p>
                </div>
                <div className="flex gap-4 items-center justify-between mt-2">
                  <p className="text-sm text-white">PRACTICE 2</p>
                  <p className="text-gray-400 text-sm">FRI</p>
                  <p className="text-white bg-zinc-800 px-2 py-1 rounded-2xl text-sm">
                    17:00 - 18:00
                  </p>
                </div>
                <div className="flex gap-4 items-center justify-between mt-2">
                  <p className="text-sm text-white">PRACTICE 3</p>
                  <p className="text-gray-400 text-sm">SAT</p>
                  <p className="text-white bg-zinc-800 px-2 py-1 rounded-2xl text-sm">
                    12:30 - 13:30
                  </p>
                </div>
                <div className="flex gap-4 items-center justify-between mt-2">
                  <p className="text-sm text-white">QUALIFYING</p>
                  <p className="text-gray-400 text-sm">SAT</p>
                  <p className="text-white bg-zinc-800 px-2 py-1 rounded-2xl text-sm">
                    16:00 - 17:00
                  </p>
                </div>
                <div className="flex gap-4 items-center justify-between mt-2">
                  <p className="text-sm text-white">RACE</p>
                  <p className="text-gray-400 text-sm">SUN</p>
                  <p className="text-white bg-zinc-800 px-2 py-1 rounded-2xl text-sm">
                    15:00
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-start space-x-2 mt-2">
              <button
                disabled
                variant="outline"
                className="bg-f1Red text-white px-6 py-2 border-none"
              >
                LIVE
              </button>
            </div>
          </div>
        </section>
        <section></section>
      </>
      ;
    </main>
  );
}
