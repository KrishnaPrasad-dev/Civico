"use client";
import Navbar from "@/components/layout/Navbar";

import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        {/* Card */}

        <div
          className="
    relative
    w-full
    sm:max-w-md
    bg-gray-800
    rounded-xl
    border border-white/10
    shadow-lg
    transition-all duration-300 ease-out
    hover:-translate-y-1
    hover:scale-[1.01]
    hover:shadow-xl
    hover:shadow-primary-500/20
    cursor-pointer
  "
        >
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent hover:ring-primary-500/30 transition" />

          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-950 dark:border-gray-900">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                LogIn to your Account
              </h1>

              <form className="space-y-4 md:space-y-6">

              


                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    placeholder="name@gmail.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                    dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                    required
                  />
                </div>


                {/* Terms */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50
                      focus:ring-3 focus:ring-indigo-300
                      dark:bg-gray-700 dark:border-gray-600
                      dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full text-white bg-indigo-600 hover:bg-indigo-700
                  focus:ring-4 focus:outline-none focus:ring-indigo-300
                  font-medium rounded-lg text-sm px-5 py-2.5 text-center
                  dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                >
                  Create an account
                </button>

                {/* Login link */}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don&apos;t have an Account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-500"
                  >
                    SignUp here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
