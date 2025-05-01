import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Subtotal = () => {
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const taxRate = 0.10;
  const taxAmount = subtotalAmount * taxRate;
  const totalAmount = subtotalAmount + taxAmount;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Feather name="file-text" size={26} color="#aaa" />
          <Feather name="edit-2" size={26} color="#aaa" />
        </View>
        
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>Customer's Name</Text>
          <Text style={styles.orderNumber}>Order Number: #000</Text>
        </View>
        
        {/* Dropdown Selectors */}
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Select Table</Text>
            <Text>▼</Text>
          </View>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Order Type</Text>
            <Text>▼</Text>
          </View>
        </View>
      </View>
      
      {/* Order Items Section */}
      <ScrollView style={styles.itemsContainer}>
        <View style={styles.noItemContainer}>
          <Feather name="shopping-cart" size={36} color="#ddd" />
          <Text style={styles.noItemText}>No Item Selected</Text>
          <Text style={styles.noItemSubtext}>Items you select will appear here</Text>
        </View>
      </ScrollView>
      
      {/* Order Summary Section - Enhanced Subtotal component */}
      <View style={styles.subtotalContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        {/* Subtotal Row */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <Text style={styles.priceText}>{subtotalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Tax Row */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Tax (10%)</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <Text style={styles.priceText}>{taxAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Additional Fee Row (example) */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Service Fee</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <Text style={styles.priceText}>0.00</Text>
          </View>
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Total Row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalCurrencySymbol}>₱</Text>
            <Text style={styles.totalPrice}>{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        
        {/* Promo Section */}
        <View style={styles.promoContainer}>
          <TouchableOpacity style={styles.promoButton}>
            <Feather name="tag" size={18} color="#4287f5" style={styles.promoIcon} />
            <Text style={styles.promoText}>Add Promo or Voucher</Text>
          </TouchableOpacity>
          
          <View style={styles.paymentContainer}>
            <TouchableOpacity style={styles.refreshButton}>
              <Feather name="refresh-cw" size={20} color="#888" />
            </TouchableOpacity>
            
          </View>
        </View>
        <TouchableOpacity style={styles.paymentButton}>
              <Feather name="credit-card" size={18} color="#555" style={styles.paymentIcon} />
              <Text style={styles.paymentButtonText}>Payment Method</Text>
            </TouchableOpacity>
        
        {/* Place Order Button */}
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

// Get device width to make the layout responsive for iPad mini
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 16,
    color: '#888',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dropdown: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  dropdownText: {
    color: '#666',
    fontSize: 16,
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noItemText: {
    color: '#888',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
  noItemSubtext: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  subtotalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLabel: {
    color: '#555',
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    marginRight: 8,
    fontSize: 16,
    color: '#555',
  },
  priceText: {
    minWidth: 60,
    textAlign: 'right',
    fontSize: 16,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCurrencySymbol: {
    marginRight: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'right',
    fontSize: 20,
    color: '#333',
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIcon: {
    marginRight: 8,
  },
  promoText: {
    color: '#4287f5',
    fontSize: 15,
    fontWeight: '500',
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    marginRight: 12,
  },
  paymentButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 8,
  },
  paymentButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  placeOrderButton: {
    backgroundColor: '#4287f5',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  placeOrderText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Subtotal;