import React, {useState,useEffect} from 'react'
import Base from './Base';
import '../styles.css';
import { loadCart } from "./helper/cartHelper";
import Card from './Card';
import Paymentb from './Paymentb';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false)

    useEffect(() => {
        setProducts(loadCart());
    }, [reload])

    const loadAllProducts=(products)=>{
        return(
            <div>
                <h2>This section is to load all products</h2>
                {products.map((product, index)=>{
                    return <Card key={index} product={product} addtoCart={false} removeFromCart={true} setReload={setReload} reload={reload} />;
                })}
            </div>
        );
    }
    const loadCheckOut=()=>{
        return(
            <div>
                <h2>This section is checkout</h2>
            </div>
        );
    }

    return (
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">{products.length > 0 ? ( loadAllProducts(products) ) : ( <h3>No products in cart</h3> )}</div>
                <div className="col-6"><Paymentb products={products} setReload={setReload} reload={reload} /></div>
            </div>
        </Base>
    )
}

export default Cart;
