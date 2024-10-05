// src/pages/PokemonDetail.tsx
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPokemonDetail } from '../api/pokemonDetail';
import PokemonTypeLabel from '../components/PokemonTypeLabel';
import { apiQueryKeys } from '../queryKeys';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: [apiQueryKeys.pokemon.detail(Number(id))],
    queryFn: () => fetchPokemonDetail(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    console.log(data);
  }, [data])

  if (isLoading) return <PokemonDetailSkeleton />;
  if (error instanceof Error) return <div>エラー: {error.message}</div>;
  if (!data) return <div>ポケモンが見つかりません</div>;

  return (
    <div className="p-4 max-w-[400px] m-auto">
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">← 一覧に戻る</Link>
      <div className="mt-4 bg-white shadow-md rounded p-8 flex flex-col items-center gap-4">
        <img src={data.image} alt={data.japaneseName} className="w-40 h-40" />
        <h1 className="mt-4 text-2xl font-bold">{data.japaneseName} (#{data.id})</h1>
        <p className="mt-2 text-justify">{data.description}</p>
        <div className="grid grid-cols-2 gap-2">
          {data?.types?.map((type) => (
            <PokemonTypeLabel key={type} type={type} />
          ))}
        </div>
          <span className="w-fit whitespace-nowrap text-right">特性</span>
        <div className="flex gap-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            {data?.abilities?.map((ability) => (
              <span key={ability}>{ability}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-2 w-full">
          {data?.baseStats?.map((stat) => (
            <div key={stat.name} className="flex items-center">
              <span className="w-24 text-right mr-2">{stat.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 rounded-full h-4"
                  style={{ width: `${(stat.value / 255) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 w-8">{stat.value}</span>
            </div>
          ))}
          {/* 合計種族値 */}
          <div className="flex items-center">
            <span className="w-24 text-right mr-2">合計</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 rounded-full h-4"
                style={{ width: `${(data?.baseStats?.reduce((sum, stat) => sum + stat.value, 0) / 780) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 w-8">{data?.baseStats?.reduce((sum, stat) => sum + stat.value, 0)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        {/* 0は前へがないので非表示 */}
        {Number(id) !== 1 ? <Link to={`/pokemon/${Number(id) - 1}`} className="px-4 py-2 bg-blue-500 text-white rounded-md">前へ</Link> : <span />}
        <Link to={`/pokemon/${Number(id) + 1}`} className="px-4 py-2 bg-blue-500 text-white rounded-md">次へ</Link>
      </div>
    </div>
  );
};

const PokemonDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 max-w-[400px] m-auto">
      <div className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4 w-24">
        <Skeleton />
      </div>
      <div className="mt-4 bg-white shadow-md rounded p-8 flex flex-col items-center gap-4">
        <Skeleton circle={true} width={160} height={160} />
        <Skeleton width={200} height={24} />
        <Skeleton width={300} height={60} />
        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-2 w-full">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton width={60} height={20} />
              <div className="flex-1 ml-2">
                <Skeleton height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton width={80} height={36} />
        <Skeleton width={80} height={36} />
      </div>
    </div>
  );
};

export default PokemonDetail;
