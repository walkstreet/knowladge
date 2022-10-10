import { Fragment, useState, useEffect } from 'react';

const useHackerNewsApi = () => {
  const [data, setData] = useState({ hits: [] });
  const [url, setUrl] = useState('http://localhost/api/v1/search?query=redux');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result: any = await Promise.resolve({
          data: {
            hits: [{ objectID: '123321', title: 'hello', url: '/hooks' }],
          },
        });
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [url]);
  const doFetch = (query: string) => {
    setUrl(query);
  };
  return { data, isLoading, isError, doFetch };
};

export default function Hooks() {
  const [query, setQuery] = useState('redux');
  const { data, isLoading, isError, doFetch } = useHackerNewsApi();
  console.log(data, isLoading, isError);
  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() => doFetch(`http://localhost/api/v1/search?query=${query}`)}
      >
        Search
      </button>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map((item: any) => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}
