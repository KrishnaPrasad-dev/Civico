"use client";

import { useEffect, useState } from "react";
import RoleCard from "../ui/RoleCard";
import Hyperspeed from "../../Hyperspeed";

export default function Hero() {
  const [text, setText] = useState(false);

  // Attach global pointer listeners (IMPORTANT)
  useEffect(() => {
    const down = () => {
      document.documentElement.style.setProperty(
        "--hyperspeed-boost",
        "4.5"
      );
    };

    const up = () => {
      document.documentElement.style.setProperty(
        "--hyperspeed-boost",
        "1.6"
      );
    };

    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchstart", down);
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <section className="relative overflow-hidden text-white">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute top-0 left-0 right-0 h-screen -z-20">
        <Hyperspeed
          effectOptions={{
            distortion: "turbulentDistortion",
            length: 420,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 95,
            fovSpeedUp: 180,
            speedUp: 1.6, // base speed (boost handled internally)
            carLightsFade: 0.35,
            totalSideLightSticks: 30,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.06,
            brokenLinesWidthPercentage: 0.12,
            brokenLinesLengthPercentage: 0.55,
            lightStickWidth: [0.15, 0.6],
            lightStickHeight: [1.4, 2.1],
            movingAwaySpeed: [70, 95],
            movingCloserSpeed: [-160, -220],
            carLightsLength: [18, 90],
            carLightsRadius: [0.08, 0.18],
            carWidthPercentage: [0.32, 0.55],
            carShiftX: [-0.9, 0.9],
            carFloorSeparation: [0, 6],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0f0f0f,
              background: 0x000000,
              shoulderLines: 0x1e90ff,
              brokenLines: 0x1e90ff,
              leftCars: [0xff4d6d, 0xffa600, 0xff007f],
              rightCars: [0x00e5ff, 0x7cff00, 0x00ffa6],
              sticks: 0x00e5ff,
            },
          }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-[1px] pointer-events-none" />

      {/* ================= HERO ================= */}
      <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-6">
        <div className="mb-6 flex items-center gap-2 border border-white/20 px-4 py-1 rounded-full text-sm">
          <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs">
            NEW
          </span>
          <span>Report. Track. Resolve.</span>
        </div>

        <h1 className="text-center text-4xl md:text-6xl font-semibold max-w-3xl">
          Modernizing How Civic Issues Are Handled
        </h1>

        <p className="text-center text-gray-300 mt-4 max-w-xl">
          CIVICO connects citizens, departments, and administrators
          to resolve local issues transparently and efficiently.
        </p>

        <div className="w-full max-w-xl mt-10 bg-white/10 border border-white/20 rounded-xl p-4">
          <textarea
            placeholder="Describe a civic issue you want to report..."
            className="w-full bg-transparent outline-none resize-none text-gray-200 placeholder-gray-400"
          />

          <button className="mt-4 ml-auto block bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2 rounded-md">
            Get Started
          </button>
        </div>
      </div>

      {/* ================= ROLES ================= */}
      <section className="relative z-10 py-24 px-6 bg-black/40">
        <h2 className="text-center text-3xl md:text-4xl font-semibold">
          Built for everyone involved
        </h2>

        <p className="text-center text-gray-400 mt-4 max-w-xl mx-auto">
          A single platform designed to support every role in the civic ecosystem.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <RoleCard
            icon="🧍"
            title="Citizens"
            description="Report local issues, follow updates in real time, and stay informed."
          />
          <RoleCard
            icon="🏢"
            title="Departments"
            description="Receive reports, post updates, and respond efficiently."
          />
          <RoleCard
            icon="🛡️"
            title="Administrators"
            description="Oversee activity and ensure transparency."
          />
        </div>
      </section>
    </section>
  );
}
