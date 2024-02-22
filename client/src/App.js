import { useState, useEffect} from 'react'
import Media from './Media'

function App() {
  const [alias, setAlias] = useState('')

  useEffect(() => {
    const getInfo = async () => {
      const response = await fetch('/getinfo');
      const { alias } = await response.json();
      setAlias(alias)
    };
    getInfo();
  }, []);

  return (
    <>
      <p>Alias: {alias}</p>
      <Media />
    </>
  );
}

export default App;
