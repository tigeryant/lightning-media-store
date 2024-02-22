import './App.css';
import { useState, useEffect} from 'react'

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
    <p>Alias: {alias}</p>
  );
}

export default App;
