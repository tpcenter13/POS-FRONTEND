import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define the type for a product
interface Product {
  id: string;
  name: string;
  price: string;
  type: string;
  image: string;
}

// Define the type for FlatList item rendering
interface ProductItem {
  item: Product;
}

// Sample product data
const productData: Product[] = [
  { id: '1', name: 'Beef Crowich', price: '$5.50', type: 'Sandwich', image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Buttermilk Croissant', price: '$4.00', type: 'Pastry', image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Cereal Cream Donut', price: '$4.25', type: 'Donut', image: 'https://via.placeholder.com/100' },
  { id: '4', name: 'Cheesy Cheesecake', price: '$3.75', type: 'Cake', image: 'https://via.placeholder.com/100' },
  { id: '5', name: 'Cheesy Sourdough', price: '$4.50', type: 'Bread', image: 'https://via.placeholder.com/100' },
  { id: '6', name: 'Egg Tart', price: '$3.25', type: 'Pastry', image: 'https://via.placeholder.com/100' },
  { id: '7', name: 'Grains Pan Bread', price: '$4.50', type: 'Bread', image: 'https://via.placeholder.com/100' },
  { id: '8', name: 'Spinachoco Roll', price: '$4.00', type: 'Pastry', image: 'https://via.placeholder.com/100' },
];

// Sample categories
const categories: string[] = ['All', 'Breads', 'Cakes', 'Donuts', 'Pastries', 'Sandwiches'];

const Products: React.FC = () => {
  // Render each product item
  const renderProduct = ({ item }: ProductItem) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productType}>{item.type}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Categories */}
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryTab}>
              <Text style={styles.categoryText}>{category}</Text>
              <Text style={styles.categoryCount}>20 items</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search something sweet on your mind..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Product Grid */}
      <FlatList
        data={productData}
        renderItem={renderProduct}
        keyExtractor={(item: Product) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryTab: {
    marginRight: 15,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryCount: {
    fontSize: 12,
    color: '#888',
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productList: {
    paddingHorizontal: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productType: {
    fontSize: 12,
    color: '#888',
    marginVertical: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e91e63',
  },
});

export default Products;