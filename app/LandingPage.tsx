import Clock from '@/components/clock';
import Menu from '@/components/menu';
import Products from '@/components/products';
import Subtotal from '@/components/subtotal';
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '16px',
      height: '100vh', // Ensure the container takes full height
    }}>
      {/* Row for Menu and Clock */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '8px',
      }}>
        <Menu />
        <Clock />
      </div>

      {/* Row for Products and Subtotal */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1, // Take remaining space
        gap: '8px',
      }}>
        {/* Products on the left */}
        <div style={{
          flex: 2, // Takes more space (adjust ratio as needed)
          overflowY: 'auto', // Allow scrolling if content overflows
        }}>
          <Products />
        </div>

        {/* Subtotal on the right */}
        <div style={{
          flex: 1, // Takes less space (adjust ratio as needed)
          minWidth: '300px', // Ensure Subtotal has a minimum width like in the screenshot
        }}>
          <Subtotal />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;