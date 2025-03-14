import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import "./App.scss";

const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://liatrio-modernize-api-7c6e1933e382.herokuapp.com/' 
  : 'http://localhost:3000/';

interface Thing {
  id: number;
  title: string;
  price: number;
  completed: boolean;
}

interface AnyObject {
  [key: string]: any;
}

interface ThingsObject {
  things_stored: AnyObject;
  timestamp: string;
}

function App() {

  const [thingsObject, setThingsObject] = useState<ThingsObject>({ things_stored: {}, timestamp: '' });
  const [things, setThings] = useState<Thing[]>([]);
  const [newThing, setNewThing] = useState({ title: '', price: 0 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchThings = async () => {
    const response = await fetch(`${apiUrl}things`);
    const result = await response.json();

    setThingsObject(result);

    const apiThingsObject = JSON.parse(result.things_stored);
    const apiThings: Thing[] = Object.values(apiThingsObject);
    setThings(apiThings.sort((a, b) => a.id - b.id));
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

  const deleteThing = async (id: number) => {
    await fetch(`${apiUrl}/things/${id}`, {
      method: "DELETE",
    });
    setThings(things.filter((thing) => thing.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewThing({ ...newThing, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newThing.price > 2147483647) {
      setToastMessage('Price cannot exceed 2,147,483,647');
      setShowToast(true);
      return;
    }
    try {
      const response = await fetch(`${apiUrl}things`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newThing, completed: false }),
      });
      const createdThing = await response.json();
      if (response.ok) {
        setThings([...things, createdThing]);
        setNewThing({ title: '', price: 0 });
      } else {
        setToastMessage(`Failed to add new thing: ${createdThing.exception || 'please try again'}`);
        setShowToast(true);
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        setToastMessage(`Failed to add new thing ${error.message}`);
        setShowToast(true);
      }
    }
  };

  const renderThings = () => {
    return things.map((thing) => (
      <Card
        key={thing.id}
        border={ thing.completed ? 'success' : 'danger' }
        style={{ width: '20%', minWidth: '10rem', marginRight: '1rem', marginTop: '1rem', borderWidth: '2px' }}
      >
        <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Card.Title>{thing.title}</Card.Title>
            <Button variant="link" onClick={() => deleteThing(thing.id)} style={{ color: 'red', textDecoration: 'none' }}>X</Button>
          </div>
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
      <Form onSubmit={handleSubmit} style={{ margin: '1rem' }}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={newThing.title}
            onChange={handleInputChange}
            placeholder="Enter title"
          />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={newThing.price}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Thing
        </Button>
      </Form>
      <div className="toast-container">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide className="toast-error">
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </>
  );
}

export default App;
