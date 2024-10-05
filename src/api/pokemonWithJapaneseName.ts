// src/api/pokemonWithJapaneseName.ts
import { fetchPokemonList, PokemonListResult } from './pokemon';
import { Pokemon } from './pokemon.type';
import { fetchPokemonJapaneseName } from './pokemonSpecies';

// ポケモンの日本語名を含む拡張情報を表す型
export type PokemonWithJapaneseName = {
  name: string;          // ポケモンの英語名
  url: string;           // ポケモンの詳細情報を取得するためのURL
  japaneseName: string;  // ポケモンの日本語名
  number: string;        // ポケモンの図鑑番号
};

// 日本語名を含むポケモンリストの結果を表す型
export type PokemonListWithJapaneseNames = {
  count: number;                         // 総ポケモン数
  next: string | null;                   // 次のページのURL（存在する場合）
  previous: string | null;               // 前のページのURL（存在する場合）
  results: PokemonWithJapaneseName[];    // ポケモンの詳細情報リスト
};

// 日本語名を含むポケモンリストを取得する関数
export const fetchPokemonListWithJapaneseNames = async (offset: number = 0, limit: number = 20): Promise<PokemonListWithJapaneseNames> => {
  // 基本的なポケモンリストを取得
  const pokemonList: PokemonListResult = await fetchPokemonList(offset, limit);
  
  // 各ポケモンの詳細情報を取得し、日本語名を追加
  const updatedResults: PokemonWithJapaneseName[] = await Promise.all(
    pokemonList.results.map(async (pokemon) => {
      // ポケモン種族のURLを生成
      const speciesUrl = pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', 'https://pokeapi.co/api/v2/pokemon-species/');
      // 日本語名を取得
      const japaneseName = await fetchPokemonJapaneseName(speciesUrl);
      // ポケモンの詳細情報を取得
      const pokemonDetails: Pokemon = await fetch(pokemon.url).then(res => res.json());
      
      // 必要な情報を組み合わせて返す
      return {
        ...pokemon,
        japaneseName,
        number: pokemonDetails.id.toString(),
        types: pokemonDetails.types.map((t) => ({
          type: {
            name: t.type.name
          }
        })),
        abilities: pokemonDetails.abilities.map((a) => ({
          ability: {
            name: a.ability.name
          }
        }))
      };
    })
  );
  
  // 元のリスト情報と更新された結果を組み合わせて返す
  return { ...pokemonList, results: updatedResults };
};
