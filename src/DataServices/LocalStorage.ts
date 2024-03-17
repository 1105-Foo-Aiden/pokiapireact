const saveLocalStorage = (pokemon: string) => {
  let localStorageData = getLS();
  if (!localStorageData.includes(pokemon)) {
    localStorageData.push(pokemon);
  }
  localStorage.setItem("favorites", JSON.stringify(localStorageData));
};

const getLS = () => {
  let favorites = localStorage.getItem("favorites");
  if (favorites == null) {
    return [];
  }
  return JSON.parse(favorites);
};

const deleteFromLS = (pokemon: string) => {
  let favorites = getLS();
  let nameIndex = favorites.indexOf(pokemon);
  favorites.splice(nameIndex, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};
export { getLS, saveLocalStorage, deleteFromLS };