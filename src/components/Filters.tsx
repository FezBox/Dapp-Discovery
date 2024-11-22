import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { getAllCategories, getAllNetworks } from '@/services/database';

interface FiltersProps {
  selectedCategory: string;
  selectedNetwork: string;
  onCategoryChange: (category: string) => void;
  onNetworkChange: (network: string) => void;
}

const Filters = ({
  selectedCategory,
  selectedNetwork,
  onCategoryChange,
  onNetworkChange,
}: FiltersProps) => {
  const [categoryQuery, setCategoryQuery] = useState('');
  const [networkQuery, setNetworkQuery] = useState('');

  // Get unique categories and networks
  const allCategories = ['All', ...getAllCategories()];
  const allNetworks = ['All', ...getAllNetworks()];

  // Filter categories based on search query
  const filteredCategories = categoryQuery === ''
    ? allCategories
    : allCategories.filter((category) =>
        category.toLowerCase().includes(categoryQuery.toLowerCase())
      );

  // Filter networks based on search query
  const filteredNetworks = networkQuery === ''
    ? allNetworks
    : allNetworks.filter((network) =>
        network.toLowerCase().includes(networkQuery.toLowerCase())
      );

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Dropdown */}
        <div>
          <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Category
          </label>
          <Combobox
            value={selectedCategory || 'All'}
            onChange={(value) => onCategoryChange(value === 'All' ? '' : value)}
          >
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0"
                  onChange={(event) => setCategoryQuery(event.target.value)}
                  displayValue={(category: string) => category}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {filteredCategories.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                    Nothing found.
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <Combobox.Option
                      key={category}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-900 dark:text-gray-100'
                        }`
                      }
                      value={category}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {category}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-blue-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>

        {/* Networks Dropdown */}
        <div>
          <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Network
          </label>
          <Combobox
            value={selectedNetwork || 'All'}
            onChange={(value) => onNetworkChange(value === 'All' ? '' : value)}
          >
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0"
                  onChange={(event) => setNetworkQuery(event.target.value)}
                  displayValue={(network: string) => network}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                {filteredNetworks.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                    Nothing found.
                  </div>
                ) : (
                  filteredNetworks.map((network) => (
                    <Combobox.Option
                      key={network}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? 'bg-green-600 text-white'
                            : 'text-gray-900 dark:text-gray-100'
                        }`
                      }
                      value={network}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {network}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-green-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>
      </div>
    </div>
  );
};

export default Filters;
