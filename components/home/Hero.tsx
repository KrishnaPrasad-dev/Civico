"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplitText from "../animations/Splittext";
import RoleCard from "../ui/RoleCard";
import Hyperspeed from "../animations/hyperspeed";

const heroHyperspeedOptions = {
  distortion: "turbulentDistortion",
  length: 420,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 95,
  fovSpeedUp: 180,
  speedUp: 1.6,
  carLightsFade: 0.35,
  totalSideLightSticks: 30,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.06,
  brokenLinesWidthPercentage: 0.12,
  brokenLinesLengthPercentage: 0.55,
  lightStickWidth: [0.15, 0.6] as [number, number],
  lightStickHeight: [1.4, 2.1] as [number, number],
  movingAwaySpeed: [70, 95] as [number, number],
  movingCloserSpeed: [-160, -220] as [number, number],
  carLightsLength: [18, 90] as [number, number],
  carLightsRadius: [0.08, 0.18] as [number, number],
  carWidthPercentage: [0.32, 0.55] as [number, number],
  carShiftX: [-0.9, 0.9] as [number, number],
  carFloorSeparation: [0, 6] as [number, number],
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
};

export default function Hero() {
  const router = useRouter();
  const [showBackground, setShowBackground] = useState(false);
  const [draftIssue, setDraftIssue] = useState("");

  const issueCategories = [
    {
      title: "Road & Transport",
      description: "Potholes, broken signals, damaged sidewalks, and unsafe crossings.",
    },
    {
      title: "Water & Sanitation",
      description: "Leakages, drainage overflow, waste collection, and hygiene risks.",
    },
    {
      title: "Street Infrastructure",
      description: "Streetlights, public spaces, damaged signage, and civic utilities.",
    },
    {
      title: "Public Safety",
      description: "Hazards, exposed wiring, blocked exits, and emergency concerns.",
    },
  ];

  const processSteps = [
    {
      title: "Report in minutes",
      description: "Submit a clear issue with location, details, and optional photo evidence.",
    },
    {
      title: "Route to right department",
      description: "CIVICO automatically directs the report to the relevant authority.",
    },
    {
      title: "Track transparent progress",
      description: "Citizens see status changes, comments, and resolution timelines in one place.",
    },
  ];

  useEffect(() => {
    // ✅ Wait for first paint + viewport stabilization
    const raf = requestAnimationFrame(() => {
      setShowBackground(true);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  const handleStartReporting = () => {
    const normalizedDraft = draftIssue.trim();

    if (normalizedDraft) {
      localStorage.setItem("issueDraft", normalizedDraft);
    } else {
      localStorage.removeItem("issueDraft");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=/raise-issue");
      return;
    }

    router.push("/raise-issue");
  };

  return (
    <section className="relative w-full overflow-x-clip text-white">
      {/* ================= BACKGROUND ================= */}
      {showBackground && (
        <div
          className="
            absolute inset-0
            -z-10
            h-[100svh]
            w-full
            overflow-hidden
          "
        >
          <Hyperspeed effectOptions={heroHyperspeedOptions} />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/20" />

      {/* ================= HERO ================= */}
      <div
        className="
          relative z-10
          min-h-[100svh]
          flex flex-col
          items-center
          justify-start md:justify-center
          pt-28 md:pt-0
          px-6
        "
      >
        <div className="mb-6 flex items-center gap-2 border border-white/20 px-4 py-1 rounded-full text-sm">
          <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs">
            NEW
          </span>
          <span>Report. Track. Resolve.</span>
        </div>

        <SplitText
          text="Modernizing How Civic Issues Are Handled"
          className="text-center text-4xl md:text-6xl font-bold max-w-3xl"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />

        <p className="text-center text-white mt-4 max-w-xl">
          CIVICO connects citizens, departments, and administrators to resolve
          local issues transparently and efficiently.
        </p>

        <div className="w-full max-w-xl mt-10 border border-white/50 bg-black/30 backdrop-blur-md rounded-xl p-4">
          <textarea
            placeholder="Describe a civic issue you want to report..."
            value={draftIssue}
            onChange={(e) => setDraftIssue(e.target.value)}
            className="w-full bg-transparent outline-none resize-none text-white placeholder-white"
            rows={4}
          />

          <button
            onClick={handleStartReporting}
            className="mt-4 ml-auto block bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2 rounded-md"
          >
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

      <section className="relative z-10 px-6 py-20 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-semibold">
            How CIVICO works
          </h2>
          <p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto">
            Clear workflows for citizens and departments, from first report to verified closure.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {processSteps.map((step, idx) => (
              <article
                key={step.title}
                className="rounded-xl border border-white/20 bg-black/35 p-6 backdrop-blur-sm"
              >
                <p className="text-sm text-cyan-300">Step {idx + 1}</p>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-gray-300 leading-relaxed">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-black/25 to-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-semibold">
            Common civic issues covered
          </h2>
          <p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto">
            One platform for everyday city problems that need public attention and fast action.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {issueCategories.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-white/15 bg-black/30 p-6"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-gray-300 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 bg-black/60">
        <div className="max-w-4xl mx-auto rounded-2xl border border-cyan-300/40 bg-cyan-950/30 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Ready to make your neighborhood better?
          </h2>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
            Join citizens and departments using CIVICO to report issues, coordinate action, and build trust through transparent progress.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="rounded-md bg-cyan-500 px-6 py-3 font-medium text-black transition hover:bg-cyan-400">
              Raise an Issue
            </button>
            <button className="rounded-md border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10">
              View All Issues
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
