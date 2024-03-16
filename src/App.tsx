import { useEffect, useState } from "react";
import "./App.css";
import APICalling, { FetchEvos, LocationCall } from "./DataServices/APICalling";
import { IPokemon } from "./DataServices/APIDataService";

function App() {
  const abilities = document.getElementById("abilities");
  const [data, setData] = useState<IPokemon>();
  const [locationData, setLocationData] = useState<string>("");
  const [evoData, setEvoData] = useState<string[]>();
  const [search, setSearch] = useState<string>();
  const [searchItem, setSearchItem] = useState<string | number>(1);
  let   [shiny, setShiny] = useState<Boolean>();
  let   [randomNum, setRandom] = useState<number>(0);

  let fetchedData: IPokemon;
  const HandleSearchClick = () => {
    if (search) {
      setSearchItem(search);
    }
    return searchItem;
  };

  useEffect(() => {
    const GetData = async () => {
      try {
        fetchedData = await APICalling(searchItem);
        setData(fetchedData);
      } catch (error) {
        alert(
          "There was an error fetching your Pokemon, you may have misspelled it, please try again"
        );
      }
      if (data) {
        setShiny(false);
        const LocalData = await LocationCall(data.location_area_encounters);
        setLocationData(LocalData);
        const EvoData = await FetchEvos(data.species.url);
        setEvoData(EvoData);
      }
    };
    GetData();
  }, [searchItem, randomNum]);

  const HandleShiny = () => {
    setShiny(shiny ? false : true);
    return shiny;
  };

  const HandleRandom = () => {
    setRandom(Math.floor(Math.random() * 649 + 1));
    setSearchItem(randomNum);
  };

  const FavClick = () =>{
    alert(`You Addded ${data?.name} to your favorites`)
  }
  
  return (
    <>
      <div className="container-fluid flex justify-center">
        <div className="container-fluid grid lg:grid-cols-2 grid-rows-1 gap-x-60 gap-y-10 sm:grid-cols-1">
          <img
            src={
              !shiny
                ? data? data.sprites.other?.["official-artwork"].front_default: "../public/Assets/Pokeball-1.png": data?.sprites.other?.["official-artwork"].front_shiny
            }
            alt="Pokeball starting img"
            id="pokemonImg"
            className="w-96 h-96 shadow-xl shadow-grey-800 justify-end"
            onClick={HandleShiny}
          />
          <img
            src={
              !shiny
                ? data
                  ? data.sprites.other?.showdown.front_default: "../public/Assets/Pokeball-1.png": data? data.sprites.other?.showdown.front_shiny: "../public/Assets/Pokeball-1.png"
            }
            alt="moving sprite"
            id="pokemonSprite"
            className="w-96 h-96 shadow-xl shadow-grey-800 justify-end"
            onClick={HandleShiny}
          />

          <div className="text-center grid grid-cols-1 grid-rows-5 gap-2">
            <input
              type="text"
              id="searchField"
              placeholder="Enter a Pokemon's name or number"
              className="mb-3 bg-gray-50 text-gray-900 w-96 h-15"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="button"
              id="searchBtn"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-96 h-15"
              onClick={HandleSearchClick}
            >
              Search
            </button>
            <button
              type="button"
              id="randomBtn"
              className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900 w-96 h-15"
              onClick={HandleRandom}
            >
              Random
            </button>
            <button
              type="button"
              id="favBtn"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-96 h-15"
              onClick={FavClick}
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
              {locationData ? locationData : "N/A"}
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
              {evoData ? evoData.join(" > ") : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
