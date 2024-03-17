import { useEffect, useState } from "react";
import "./App.css";
import APICalling, { FetchEvos, LocationCall } from "./DataServices/APICalling";
import { IEvoultions, IPokemon } from "./DataServices/APIDataService";
import ModalComponent from "./Components/ModalComponent";
import { deleteFromLS, saveLocalStorage } from "./DataServices/LocalStorage";

function App() {
  const abilities = document.getElementById("abilities");
  const [data, setData] = useState<IPokemon>();
  const [locationData, setLocationData] = useState<string>("");
  const [evoData, setEvoData] = useState<string[]>();
  const [search, setSearch] = useState<string>();
  const [searchItem, setSearchItem] = useState<string | number>(1);
  let [shiny, setShiny] = useState<Boolean>();
  let [randomNum, setRandom] = useState<number>(0);
  const [isFav, setisFav] = useState<Boolean>(false);

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
        console.log(data);
      } catch (error) {
        alert("The Pokemon you entered could not be found, please try again");
      }
  
      if (data) {
        setShiny(false);
        setSearch("");
        const LocalData = await LocationCall(data.location_area_encounters);
        setLocationData(LocalData);

        const EvoData = await FetchEvos(data.species.url);
        setEvoData(EvoData);
      }
    };
    GetData();
    if(data === null || undefined){
      GetData()
    }
  }, [searchItem]);

  const HandleShiny = () => {
    setShiny(shiny ? false : true);
    return shiny;
  };

  const HandleRandom = () => {
    setRandom(Math.floor(Math.random() * 649 + 1));
    setSearchItem(randomNum);
    return searchItem
  };

  const FavClick = () => {
    if (data && !isFav) {
      setisFav(true);
      alert(`You Addded ${data.name} to your favorites`);
      saveLocalStorage(data.name);
    } else {
      if (data && isFav) {
        setisFav(false);
        alert(`You removed ${data?.name} from your favorites`);
        deleteFromLS(data.name);
      }
    }
  };

  return (
    <>
      <div className="container-fluid flex justify-center">
        <div className="container-fluid grid lg:grid-cols-2 grid-rows-1 gap-x-60 gap-y-10 sm:grid-cols-1">
          <img
            src={
              data
                ? data && !shiny
                  ? data.sprites.other?.["official-artwork"].front_default
                  : data.sprites.other?.["official-artwork"].front_shiny
                : "./Assets/Pokeball-1.png"
            }
            alt="Pokeball starting img"
            id="pokemonImg"
            className="w-96 h-96 shadow-xl shadow-grey-800 justify-end"
            onClick={HandleShiny}
          />
          <img
            src={
              data
                ? data && !shiny
                  ? data.sprites.other?.showdown.front_default
                  : data?.sprites.other?.showdown.front_shiny
                : "./Assets/Pokeball-1.png"
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
              {!isFav ? "Add to Favorites" : "Remove from Favorites"}
            </button>
            <ModalComponent />
          </div>
          <div className="grid gap-1">
            <p id="names" className="text-3xl max-w-96">
              {data && data ? data.name : "Name goes here"}
            </p>
            <hr />
            <p id="typing" className="text-3xl max-w-96">
              {data && data.types
                ? data.types.map((type) => type.type.name).join(", ")
                : "Types go here"}
            </p>
            <hr />
            <p id="abilities" className="text-3xl max-w-96">
              {data && abilities
                ? data?.abilities
                    .map((ability) => ability.ability.name)
                    .join(", ")
                : "Abilities go here"}
            </p>
            <hr />
            <p id="locations" className="text-2xl max-w-96 ">
              {locationData ? locationData : "Locations go here"}
            </p>
            <hr />
            <p
              id="moves"
              className="text-3xl max-h-20 max-w-96 overflow-y-scroll"
            >
              {data && data.moves
                ? data.moves.map((move) => move.move.name).join(", ")
                : "Moves go here"}
            </p>
            <hr />
            <p id="evolutions" className="text-2xl max-w-96 ">
              {data && data.species.url ? evoData ? evoData.join(" > ") : "N/A" : "Evolutions go here"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
