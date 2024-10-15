import React from 'react';

const SearchForm = ({ searchParams, setSearchParams, handleSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Palabra clave: </label>
        <input
          type="text"
          name="query"
          value={searchParams.query}
          onChange={handleInputChange}
          placeholder="procesadores"
        />
      </div>

      <div>
        <label>Precio mínimo: </label>
        <input
          type="number"
          name="priceMin"
          value={searchParams.priceMin}
          onChange={handleInputChange}
          placeholder="Ej: 1000"
        />
      </div>

      <div>
        <label>Precio máximo: </label>
        <input
          type="number"
          name="priceMax"
          value={searchParams.priceMax}
          onChange={handleInputChange}
          placeholder="Ej: 5000"
        />
      </div>

      <div>
        <label>Ordenar por: </label>
        <select
          name="sort"
          value={searchParams.sort}
          onChange={handleInputChange}
        >
          <option value="relevance">Relevancia</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>
      </div>

      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchForm;
