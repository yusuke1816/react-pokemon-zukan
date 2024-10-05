// src/api/pokemonDetail.ts
import { FlavorTextEntry, PokemonAbility, PokemonStat, PokemonType } from './pokemon.type';
import { Name } from './common.type';

type PokemonDetail = {
  id: number;
  name: string;
  japaneseName: string;
  image: string;
  types: string[];
  abilities: string[];
  description: string;
  baseStats: { name: string; value: number }[];
};

export const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error('ポケモンの詳細情報の取得に失敗しました');
  }
  const data = await response.json();

  // ポケモン種族情報を取得して日本語名を取得
  const speciesResponse = await fetch(data.species.url);
  if (!speciesResponse.ok) {
    throw new Error('ポケモン種族情報の取得に失敗しました');
  }
  const speciesData = await speciesResponse.json();
  const japaneseNameEntry = speciesData.names.find(
    (nameEntry: Name) => nameEntry.language.name === 'ja'
  );
  const japaneseName = japaneseNameEntry ? japaneseNameEntry.name : data.name;

  // タイプの日本語名を取得
  const types = await Promise.all(
    data.types.map(async (typeInfo: PokemonType) => {
      const typeResponse = await fetch(typeInfo.type.url);
      const typeData = await typeResponse.json();
      const japaneseType = typeData.names.find((name: Name) => name.language.name === 'ja');
      return japaneseType ? japaneseType.name : typeInfo.type.name;
    })
  );

  // 特性の日本語名を取得
  const abilities = await Promise.all(
    data.abilities.map(async (abilityInfo: PokemonAbility) => {
      const abilityResponse = await fetch(abilityInfo.ability.url);
      const abilityData = await abilityResponse.json();
      const japaneseAbility = abilityData.names.find((name: Name) => name.language.name === 'ja');
      return japaneseAbility ? japaneseAbility.name : abilityInfo.ability.name;
    })
  );

  // 種族値の取得
  const baseStats = await Promise.all(data.stats.map( async (stat: PokemonStat) => {
    // 日本語名を取得
    const japaneseStatData = await fetch(`https://pokeapi.co/api/v2/stat/${stat.stat.name}`);
    const japaneseStatDataJson = await japaneseStatData.json();
    return {
      name: japaneseStatDataJson.names.find((name: Name) => name.language.name === "ja-Hrkt").name,
      value: stat.base_stat,
    };
  }));

  console.log(baseStats);

  // 説明文の取得
  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === 'ja'
  );
  const description = flavorTextEntry
    ? flavorTextEntry.flavor_text.replace(/\f/g, ' ')
    : '説明文がありません。';

  return {
    id: data.id,
    name: data.name,
    japaneseName,
    image: data.sprites.other['official-artwork'].front_default,
    types,
    abilities,
    description,
    baseStats,
  };
};

