import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../Redux/productSlice';
import withSpinner from './withSpinner';
import "./ProductComparision.css"

const comparisonReducer = (state, action) => {
  switch (action.type) {
    case 'ADDPRODUCT':
      return [...state, action.payload];
    case 'REMOVEPRODUCT':
      return state.filter((product) => product.id !== action.payload.id);
    default:
      return state;
  }
};

function ProductComparison() {
  const dispatch = useDispatch();
  const { catalog, status } = useSelector((state) => state.products);
  const [selectedProducts, dispatchComparison] = useReducer(comparisonReducer, []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const ProductSelection = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      dispatchComparison({ type: 'REMOVEPRODUCT', payload: product });
    } else {
      dispatchComparison({ type: 'ADDPRODUCT', payload: product });
    }
  };

  return (<>
    <div className='productsDisplay'>
      <h1 className='heading'>Product Comparison Tool</h1>
      <div className="product-list">
        {catalog.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <button onClick={() => ProductSelection(product)}>
              {selectedProducts.find((p) => p.id === product.id) ? 'Remove' : 'Compare'}
            </button>
          </div>
        ))}
      </div>
      {selectedProducts.length > 0 && (
        <div className="comparison-table">
          <h2 className='comparision'>Comparison</h2>
          <table className='ptable'>
            <thead>
              <tr>
                <th>Feature</th>
                {selectedProducts.map((product) => (
                  <th key={product.id}>{product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                {selectedProducts.map((product) => (
                  <td key={product.id}>{product.price}</td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {selectedProducts.map((product) => (
                  <td key={product.id}>{product.rating}</td>
                ))}
              </tr>
              <tr>
                <td>Features</td>
                {selectedProducts.map((product) => (
                  <td key={product.id}>{product.features}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  </>);
}

export default withSpinner(ProductComparison);


