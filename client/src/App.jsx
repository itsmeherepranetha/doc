import TextEditor from "./TextEditor";
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import { v4 as uuid } from 'uuid';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuid()}`}/>} replace />
        <Route path="/documents/:id" element={<TextEditor/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
