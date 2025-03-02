// ProductCategories.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/productCategories.css';// Import CSS file

const categories = [
  'Beauty products', 'Vegetables', 'Fruits', 'Bakery', 'Home Decor', 'Groceries',
  'Skin Care Products', 'Electronic Products', 'Machine & Tools', 'Ice Creams',
  'Cakes', 'Accessories'
];

function ProductCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/add-product/${category.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <div className="categories-container">
      <h2>Select a Product Category</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <button
            key={category}
            className="category-button"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductCategories;
