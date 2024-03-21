"use client";
import { useEffect, useState } from "react";
import { ddbDocClient } from "@/config/dbconfig";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import Link from "next/link";

export default function Home() {
  let data = [];
  const [tableData, setTableData] = useState([]);

  //   scanning the dynamodb table
  const scanTable = async () => {
    try {
      data = await ddbDocClient.send(new ScanCommand({ TableName: "Users" }));
      setTableData(data.Items);
    } catch (err) {
      console.log("Error", err);
    }
  };
  const deleteItem = async (primaryKeyValue, sortKeyValue) => {
    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: "Users",
          Key: {
            id: primaryKeyValue,
            dateAdded: sortKeyValue,
          },
        })
      );
      console.log("Success - item deleted");
      scanTable();
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    scanTable();
  }, []);

  return (
    <div className="bp-3 sm:p-5 md:p-20">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="w-full md:w-auto flex flex-col md:flex-row my-2 mr-5 space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <Link
              href={{
                pathname: "/adduser",
              }}
            >
              <button
                type="button"
                className="flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
              >
                Add User
              </button>
            </Link>
          </div>
          <div className="">
            <table className="w-full text-sm  text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="text-center py-3">
                    ID
                  </th>
                  <th scope="col" className="text-center py-3">
                    First Name
                  </th>
                  <th scope="col" className="text-center py-3">
                    Last Name
                  </th>
                  <th scope="col" className="text-center py-3">
                    City
                  </th>
                  <th scope="col" className="text-center py-3">
                    Phone Number
                  </th>
                  <th scope="col" className="text-center py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData &&
                  tableData.map((row, idx) => (
                    <tr
                      scope="row"
                      key={idx}
                      className="border-b dark:border-gray-700"
                    >
                      <td className="text-center py-3">{row.id}</td>
                      <td className="text-center py-3">{row.firstName}</td>
                      <td className="text-center py-3">{row.lastName}</td>
                      <td className="text-center py-3">{row.city}</td>
                      <td className="text-center py-3">{row.phoneNumber}</td>
                      <td className="text-center py-3">
                        <button
                          id="apple-imac-27-dropdown-button"
                          className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                          type="button"
                          onClick={() => deleteItem(row.id, row.dateAdded)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
