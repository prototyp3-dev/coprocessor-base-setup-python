"use client";
// import Image from "next/image";

import { IChallenge } from "@/utils/models";
import { getChallenges, timeToDateUTCString } from "@/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

export default function Home() {
  const [challenges, setChallenges] = useState<IChallenge[]>();

  useEffect(() => {
    getChallenges().then((data) => {
      setChallenges(data);
    });
  }, []);

  return (
    <main className="grid grid-cols-1 h-full w-full">
      <div className="h-16"></div>
      <div className="grid grid-cols-1 justify-items-center gap-4 p-5 h-full">
        {challenges ? (
          challenges.map((challenge: IChallenge, index: number) => {
            return (
              <Link
                href={`/challenge/${challenge.challengeId}`}
                key={index}
                className="grid w-1/2 max-h-56 h-fit grid-cols-1 gap-2 p-5 rounded-2xl bg-slate-200 border-slate-400 hover:bg-slate-300"
              >
                {challenge.challengeId ? (
                  <div className="flex justify-around text-lg w-full">
                    <span className="w-1/3 flex justify-start">
                      Challenge Id
                    </span>
                    <span className="w-3/5 flex justify-end">
                      {challenge.challengeId.substring(0, 6)}...
                      {challenge.challengeId.substring(
                        challenge.challengeId.length - 4,
                        challenge.challengeId.length,
                      )}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <div className="flex justify-around text-lg w-full">
                  <span className="w-1/3 flex justify-start">Start</span>
                  <span className="w-3/5 flex justify-end">
                    {timeToDateUTCString(challenge.start)}
                  </span>
                </div>
                <div className="flex justify-around text-lg w-full">
                  <span className="w-1/3 flex justify-start">End</span>
                  <span className="w-3/5 flex justify-end">
                    {timeToDateUTCString(challenge.end)}
                  </span>
                </div>
                <div className="flex justify-around text-lg w-full">
                  <span className="w-1/3 flex justify-start">Total Prize</span>
                  <span className="w-3/5 flex justify-end">
                    {parseFloat(formatEther(challenge.totalPrize)).toLocaleString("en", { maximumFractionDigits: 4 })} ETH
                  </span>
                </div>
              </Link>
            );
          })
        ) :
          <></>
        }
      </div>
      <div className="h-16 absolute botton-0"></div>
    </main>
  );
}
