import { IPokemon, IEvoultions } from './APIDataService';


export default async function APICalling(pokemon:string | number) {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const promise:IPokemon = await data.json();
    await FetchEvos(promise.species.url)
    return promise; 
}

export async function LocationCall(url:string) {
    const locationData: [{location_area:{name:string, url:string}}] = await (await fetch(url)).json()
    return locationData? locationData[0].location_area.name: "N/A";
}

export async function FetchEvos(url:string) {
    const EvoData = await fetch(url)
    const evoObject = await EvoData.json()
    const evoChain = await fetch(evoObject.evolution_chain.url)
    const evoChainData: IEvoultions = await evoChain.json()
  
    let evoArr : string[]

    if(evoChainData.chain.evolves_to.length === 0){
        return
    }
    else{
        evoArr = [evoChainData.chain.species.name]

        const seeEvos =( chain: any) =>{
            if(chain.evolves_to.length === 0){
                return
            }
            else{
                chain.evolves_to.forEach((evo:any) => {
                    evoArr.push(evo.species.name)
                    seeEvos(evo)
                })
            }
        }
        seeEvos(evoChainData.chain)
        evoArr.join(" > ")
        
    }
    
    return evoArr;
}
