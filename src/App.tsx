import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "./App.scss";

const apiUrl = 'http://localhost:3000/';

export interface Thing {
  id: number;
  title: string;
  price: number;
  completed: boolean;
}

function App() {

  const [thingsObject, setThingsObject] = useState<Thing[]>([]);
  const [things, setThings] = useState<Thing[]>([]);

  const fetchThings = async () => {
    const response = await fetch(`${apiUrl}things`);
    const result = await response.json();

    setThingsObject(result);

    const apiThingsObject = JSON.parse(result.things_stored);
    const apiThings: Thing[] = Object.values(apiThingsObject);
    setThings(apiThings);
  }

  useEffect(() => {
    fetchThings();
  }, []);

  const toggleCompleteThing = async (id: number, completed: boolean) => {
    const response = await fetch(`${apiUrl}/things/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });
    const updatedThing = await response.json();
    setThings(things.map((thing) => (thing.id === id ? updatedThing : thing)));
  };

  const renderThings = () => {
    return things.map((thing) => (
      <Card
        key={thing.id}
        border={ thing.completed ? 'success' : 'danger' }
        style={{ width: '20%', minWidth: '10rem', marginRight: '1rem', marginTop: '1rem', borderWidth: '2px' }}
      >
        <Card.Body>
          <Card.Title>{thing.title}</Card.Title>
          <Card.Subtitle>{thing.completed ? 'completed' : 'awaiting'}</Card.Subtitle>
          <Card.Text>Price {thing.price}</Card.Text>
          <Button
              variant={thing.completed ? 'outline-danger' : 'outline-success'}
              onClick={() => toggleCompleteThing(thing.id, !thing.completed)}
          >        
              {thing.completed ? 'Undo' : 'Complete'}
          </Button>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
      <header>
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">Liatrio Modernize It</Navbar.Brand>
          </Container>
        </Navbar>
      </header>
      <main>
          <h1>Things</h1>
          <div>{JSON.stringify(thingsObject)}</div>
          <Button onClick={fetchThings}>Fetch Things</Button>
          {renderThings()}
      </main>
    </>
  );
}

export default App;
