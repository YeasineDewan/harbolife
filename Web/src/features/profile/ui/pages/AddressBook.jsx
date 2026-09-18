import { useState } from "react";

export default function AddressBook() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Address Book
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your shipping and billing addresses for a faster checkout.
        </p>
      </div>

      {!isAdding ? (
        <div className="bg-white dark:bg-[#252525] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Saved Addresses
            </h3>
          </div>
          <div className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            You currently don't have any saved addresses.
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full active:scale-95 shadow-md"
          >
            Add new address
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#252525] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm max-w-2xl">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Add address
          </h3>

          <form className="flex flex-col gap-5">
            <div>
              <input
                type="text"
                placeholder="First name"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last name"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="*Address"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500 font-medium"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Apt/Suite/Other(optional)"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="*City"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500 font-medium"
              />
            </div>

            <div className="relative">
              <select
                defaultValue=""
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors appearance-none font-medium cursor-pointer"
              >
                <option value="" disabled className="text-gray-500">
                  *Choose State
                </option>
                <option value="cairo" className="text-black">
                  Cairo
                </option>
                <option value="giza" className="text-black">
                  Giza
                </option>
                <option value="alexandria" className="text-black">
                  Alexandria
                </option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-4 items-center mt-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="*Zip code"
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500 font-medium"
                />
              </div>
              <span className="text-gray-400 font-bold hidden sm:block">—</span>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="+4 code (optional)"
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3.5 text-gray-900 dark:text-white outline-none focus:border-green-700 dark:focus:border-green-500 transition-colors placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                id="preferred"
                className="w-5 h-5 accent-green-700 cursor-pointer rounded"
              />
              <label
                htmlFor="preferred"
                className="text-gray-700 dark:text-gray-300 cursor-pointer font-medium select-none"
              >
                Make this my preferred address
              </label>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <button
                type="button"
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full active:scale-95 shadow-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-gray-900 dark:text-white font-bold hover:underline transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
