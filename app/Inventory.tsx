import MenuButton from '@/components/menu';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Define type interfaces
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: any; // Using 'any' for image because React Native's require returns a number
}

interface Category {
  id: string;
  name: string;
}

// Sample product data
const productData: Product[] = [
  { id: '1', name: 'Beef Crowich', category: 'Sandwich', price: 5.50, image: require('../assets/images/Ham-Sandwich.jpg') },
  { id: '2', name: 'Beef Crowich', category: 'Sandwich', price: 5.50, image: require('../assets/images/Ham-Sandwich.jpg') },
  { id: '3', name: 'Beef Crowich', category: 'Sandwich', price: 5.50, image: require('../assets/images/Ham-Sandwich.jpg') },
];

// Categories
const categories: Category[] = [
  { id: '0', name: 'All Types' },
  { id: '1', name: 'Bread' },
  { id: '2', name: 'Cakes' },
  { id: '3', name: 'Sodas' },
];

const Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(productData.length / itemsPerPage);
  
  // Function to handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  // Products for current page
  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productData.slice(startIndex, endIndex);
  };

  // Function to render pagination indicators
  const renderPaginationDots = () => {
    return [...Array(totalPages)].map((_, index: number) => (
      <View 
        key={index} 
        style={[
          styles.paginationDot, 
          currentPage === index ? styles.activeDot : {}
        ]} 
      />
    ));
  };

  // Function to go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to render a product card
  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} resizeMode="contain" />
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.flexRow}>
          <View style={styles.newProductsContainer}>
            <MenuButton/>
            <Text style={styles.newProductsText}>New Products</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>10</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Product</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* Categories Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Types of Product</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id ? styles.selectedCategory : {}
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          <FlatList
            data={getCurrentPageItems()}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            numColumns={5}
            contentContainerStyle={styles.productsList}
          />

          {/* Pagination Controls */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity 
              style={styles.paginationButton}
              onPress={goToPreviousPage}
              disabled={currentPage === 0}
            >
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            
            <View style={styles.paginationDots}>
              {renderPaginationDots()}
            </View>
            
            <TouchableOpacity 
              style={styles.paginationButton}
              onPress={goToNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>POINT NATIVE</Text>
            <Text style={styles.tagline}>POS SYSTEM</Text>
          </View>
          <Text style={styles.footerTagline}>
            Empowering the dream every business shares with smart solutions.
          </Text>
          <Text style={styles.copyright}>© 2025 CodaNatin</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newProductsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newProductsText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  addButtonText: {
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 180,
    backgroundColor: '#f9f9f9',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#eaeaea',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: '#e6e6e6',
  },
  categoryText: {
    fontSize: 15,
  },
  productsContainer: {
    flex: 1,
    padding: 10,
  },
  productsList: {
    padding: 5,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  paginationButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#4285F4',
  },
  footer: {
    backgroundColor: '#222',
    padding: 15,
  },
  footerContent: {
    paddingLeft: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  tagline: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 10,
  },
  footerTagline: {
    color: '#ccc',
    fontSize: 12,
    maxWidth: '80%',
  },
  copyright: {
    color: '#888',
    fontSize: 11,
    marginTop: 5,
  },
});

export default Inventory;