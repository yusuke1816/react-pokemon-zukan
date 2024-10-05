// src/components/pokemonTypeLabel.tsx
// ポケモンのタイプのラベル
import { pokemonTypesMap } from '../pokemonTypesMap';

type PokemonTypeLabelProps = {
  type: string;
};

const PokemonTypeLabel: React.FC<PokemonTypeLabelProps> = ({ type }) => {
  const typeInfo = pokemonTypesMap.find((t) => t.jaType === type);
  return (
    <span 
      style={{
        backgroundColor: typeInfo?.color,
      }}
      key={type}
      className={`text-white px-3 py-1 rounded-full w-fit`}
    >
      {typeInfo?.jaType}
    </span>
  );
};

export default PokemonTypeLabel;