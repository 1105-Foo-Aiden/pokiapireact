import { useEffect, useState } from "react";
import "./App.css";
import APICalling, { FetchEvos, LocationCall } from "./DataServices/APICalling";
import {IPokemon } from "./DataServices/APIDataService";

function App() {
  const names = document.getElementById("names");
  const searchBtn = document.getElementById("searchBtn");
  const searchField = document.getElementById("searchField");
  const randomBtn = document.getElementById("randomBtn");
  const favBtn = document.getElementById("favBtn");
  const showFavBtn = document.getElementById("showFavBtn");
  const favList = document.getElementById("favList");
  const evolutions = document.getElementById("evolutions");
  const pokemonImg = document.getElementById("pokemonImg");
  const locations = document.getElementById("locations");
  const moves = document.getElementById("moves");
  const abilities = document.getElementById("abilities");
  const typing = document.getElementById("typing");
  const pokemonSprite = document.getElementById("pokemoneSpirte");

  const [data, setData] = useState<IPokemon>();
  const [locationData, setLocationData] = useState<string>("");
  const [evoData, setEvoData] = useState<string[]>();


  let fetchedData
  useEffect(() => {
    const GetData = async () => {
      const randomNum: number = Math.floor(Math.random() * 649 + 1);
      fetchedData = await APICalling(randomNum);
      setData(fetchedData)


      const LocalData = await LocationCall(fetchedData.location_area_encounters)
      setLocationData(LocalData)


      const EvoData = await FetchEvos(fetchedData.species.url)
      setEvoData(EvoData)
       
    };
    GetData()
  }, [fetchedData]);
  
  return (
    <>
      <div className=" container-fluid flex justify-center mt-5">
        <div className="container-fluid grid lg:grid-cols-2 grid-rows-1 gap-x-60 gap-y-10 sm:grid-cols-1">
          <img
            src={
              data? data.sprites.other?.["official-artwork"].front_default: "../public/Assets/Pokeball-1.png"
            }
            alt="Pokeball starting img"
            id="pokemonImg"
            className="w-96 h-96 shadow-xl shadow-grey-800 justify-end"
          />
          <img
            src={
              data? data.sprites.other?.showdown.front_default: "../public/Assets/Pokeball-1.png"
            }
            alt="moving sprite"
            id="pokemonSprite"
            className="w-96 h-96 shadow-xl shadow-grey-800 justify-end"
          />

          <div className="text-center grid grid-cols-1 grid-rows-5 gap-2">
            <input
              type="text"
              id="searchField"
              placeholder="Enter a Pokemon's name or number"
              className="mb-3 bg-gray-50 text-gray-900 w-96 h-15"
            />

            <button
              type="button"
              id="searchBtn"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-96 h-15"
            >
              Search
            </button>
            <button
              type="button"
              id="randomBtn"
              className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900 w-96 h-15"
            >
              Random
            </button>
            <button
              type="button"
              id="favBtn"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-96 h-15"
            >
              Add to Favorites
            </button>
            <button
              className="overflow-y-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-96 h-15 text-center"
              type="button"
              id="showFavBtn"
            >
              Show Favorites
            </button>
          </div>
          <div className="grid gap-1">
            <p id="names" className="text-3xl max-w-96">
              {data && data.name}
            </p>
            <hr />
            <p id="typing" className="text-3xl max-w-96">
              {data && data.types.map((type) => type.type.name).join(", ")}
            </p>
            <hr />
            <p id="abilities" className="text-3xl max-w-96">
              {abilities? data?.abilities.map((ability) => ability.ability.name).join(", "): "N/A"}
            </p>
            <hr />
             <p id="locations" className="text-2xl max-w-96 ">
            {locationData? locationData : "N/A"}
            </p>  
            <hr />
            <p
              id="moves"
              className="text-3xl max-h-20 max-w-96 overflow-y-scroll"
            >
              {data && data.moves.map((move) => move.move.name).join(", ")}
            </p>
            <hr />
            <p id="evolutions" className="text-2xl max-w-96 ">
             {evoData? evoData.join(" > ") : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="notification" id="FavAdded" style={{ display: "none" }}>
        <p style={{ fontSize: "25px" }}>Favorite Notification</p>
        <span className="notification_progress"></span>
      </div>
    </>
  );
}

export default App;
