import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navigation } from './layout';
import { Home } from './pages/home';

function App() {
  return (
    <div className="App">
        <Navigation></Navigation>
        <Home></Home>
    </div>
  );
}

export default App;
