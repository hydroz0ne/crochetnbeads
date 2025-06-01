import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import About from './Pages/About.jsx';
import Cart from './Pages/Cart.jsx';
import Item from './Pages/Item.jsx';
import Home from './Pages/Home.jsx';
import ShopCategory from './Pages/ShopCategory.jsx';
import LoginSignUp from './Pages/LoginSignUp.jsx';
import OrderSuccess from './Pages/OrderSuccess';
import OrderCancel from './Pages/OrderCancel';
import Footer from './Components/Footer/Footer.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/plushies" element={<ShopCategory category='plushies'/>} />
        <Route path="/apparel" element={<ShopCategory category='apparel'/>} />
        <Route path="/bouquets" element={<ShopCategory category='bouquets'/>} />
        <Route path="/jewelry" element={<ShopCategory category='jewelry'/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/:category/:itemid" element={<Item/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/login" element={<LoginSignUp/>} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-cancel" element={<OrderCancel />} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;