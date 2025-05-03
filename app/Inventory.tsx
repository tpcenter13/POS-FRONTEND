import MenuButton from '@/components/menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Define type interfaces
interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  image?: string | any;
}

interface Category {
  id: string;
  name: string;
}

const Inventory = () => {
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: '',
    price: '',
    stock: '',
    image: null as string | null,
  });
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Categories
  const categories: Category[] = [
    { id: '0', name: 'All Types' },
    { id: '1', name: 'Bread' },
    { id: '2', name: 'Cakes' },
    { id: '3', name: 'Sodas' },
  ];

  // Check for stored token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let storedToken: string | null = null;
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          storedToken = window.localStorage.getItem('authToken');
        } else {
          storedToken = await AsyncStorage.getItem('authToken');
        }
        console.log('Checking auth token in Inventory:', storedToken);
        if (storedToken) {
          setToken(storedToken);
          setIsLoggedIn(true);
          await validateAndFetch(storedToken);
        } else {
          setIsLoggedIn(false);
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const validateAndFetch = async (authToken: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Ensure price is a number by parsing it
      const parsedProducts = response.data.data.map((product: any) => ({
        ...product,
        price: parseFloat(product.price), // Convert price to a number
        stock: parseInt(product.stock, 10), // Ensure stock is an integer
      }));
      setProducts(parsedProducts);
      console.log('Token validated successfully in Inventory');
    } catch (error) {
      console.error('Token validation failed in Inventory:', error);
      clearToken();
      setIsLoggedIn(false);
      Alert.alert('Session expired', 'Please log in again.');
    }
  };

  const clearToken = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('authToken');
    } else {
      await AsyncStorage.removeItem('authToken');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProduct({ ...newProduct, image: result.assets[0].uri });
    }
  };

  const handleAddProduct = async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to add a product.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('type', newProduct.type);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);

      if (newProduct.image) {
        const uriParts = newProduct.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('image', {
          uri: newProduct.image,
          name: `product.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await axios.post('http://127.0.0.1:8000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Parse price and stock for the new product
      const newProductData = {
        ...response.data.data,
        price: parseFloat(response.data.data.price),
        stock: parseInt(response.data.data.stock, 10),
      };
      setProducts([...products, newProductData]);
      setModalVisible(false);
      setNewProduct({ name: '', type: '', price: '', stock: '', image: null });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const getCurrentPageItems = () => {
    let filteredProducts = products;
    if (selectedCategory !== '0') {
      let selectedCatName = '';
      for (const cat of categories) {
        if (cat.id === selectedCategory) {
          selectedCatName = cat.name;
          break;
        }
      }
      filteredProducts = products.filter(product => product.type.toLowerCase() === selectedCatName.toLowerCase());
    }
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

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

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
            style={styles.productImage} 
            resizeMode="contain" 
          />
        ) : (
          <Text>No Image</Text>
        )}
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productCategory}>{item.type}</Text>
      <Text style={styles.productPrice}>
        ${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}
      </Text>
      <Text style={styles.productStock}>Stock: {item.stock}</Text>
    </View>
  );

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: username,
        password,
      });
      const { token } = response.data;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('authToken', token);
      } else {
        await AsyncStorage.setItem('authToken', token);
      }
      setToken(token);
      setIsLoggedIn(true);
      await validateAndFetch(token);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'Please check your credentials.');
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.modalTitle}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={styles.countText}>{products.length}</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add New Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Product Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Type"
              value={newProduct.type}
              onChangeText={(text) => setNewProduct({ ...newProduct, type: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={newProduct.stock}
              onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {newProduct.image ? 'Image Selected' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>
            {newProduct.image && (
              <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
            )}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add Product" onPress={handleAddProduct} />
            </View>
          </View>
        </View>
      </Modal>

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
            keyExtractor={(item) => item.id.toString()}
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
  headerButtons: {
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
    marginRight: 10,
  },
  addButtonText: {
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: '500',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  productStock: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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