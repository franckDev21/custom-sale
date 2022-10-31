import React, { FC } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import Order from "../../Model/Order";
import { formatCurrency, formatDate } from "../../utils/function";

import DefaultImage from '../../assets/img/logo/logo3.png'
import Invoice from "../../Model/Invoice";
import { baseURL } from "../../utils/axios-custum";
import Product from "../../Model/Product";
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection:'column',
    fontSize: 13
  },
  header: {
    padding: 8,
    display: 'flex',
    justifyContent : 'space-between',
    flexDirection: 'row',
  },
  image : {
    width : 130,
    height : 130,
    // backgroundColor: "#E4E4E4",
  },
  right : {
    width: '80%',
    // backgroundColor : 'green',
    height : 130,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    textAlign: 'center'
  },
  rightBottom : {
    marginBottom: 10,
    textAlign: 'center',
    padding: 5
  },
  head : {
    // backgroundColor: 'yellow',
    width: '100%',
    display: 'flex',
    padding: 8
  },
  content : {
    maxWidth: 200,
    width: '100%',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    // backgroundColor: 'pink'
  },
  date : {
    width: '100%'
  },
  customer : {
    width: '100%',
    maxWidth: 200,
    // backgroundColor : 'red',
    minHeight: 50,
    border: 1,
    marginTop: 5
  },
  tableTile : {
    width: '100%',
    maxWidth: 500,
    // backgroundColor: 'violet',
    minHeight: 15,
    marginTop: 4,
    textDecoration: 'underline',
    fontSize: 14,
  },
  tableTh:{
    fontWeight: 'semibold',
    width: '16.5%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30
  },
  tableThLast:{
    fontWeight: 'semibold',
    width: '16.5%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderRight: 1
  },
  tableThFirst:{
    fontWeight: 'semibold',
    width: '16.5%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  tableChild:{
    width: '16.5%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
  },
  tableChildRigth:{
    width: '16.5%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
    borderRight: 1
  },
  tableTotal: {
    width: '25%',
    padding: 4,
    minHeight: 30,
    borderBottom: 1
  },
  table : {
    display:'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
    fontSize: '11px',
    marginLeft: 3,
  },
  signature : {
    paddingTop: 8,
    paddingRight: 30,
    width: '100%',
    minHeight: 20,
    marginTop: 70,
    display: 'flex',
    textDecoration: 'underline',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
});

type OrderPrintProps = {
  className ?:  string,
  orders ?: Order[],
  products ?: Product[],
};

const API_STORAGE_URL = `${baseURL}/storage`;

const OrderPrint: FC<OrderPrintProps> = ({
  className='',
  products = [],
  orders = [],
}) => {

  const getProductNameWithId = (id: string): Product|null => {
    return products.find(p => p.id?.toString() === id.toString()) || null
  }

  return (
    <Document>
      <Page wrap size="A4" style={styles.page}>

        <View style={styles.header}>
          <View style={styles.image}>
            <Image src={DefaultImage} />
          </View>
          <View style={styles.right}>
            <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>COMPANY Name</Text></View>
            <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>Commerce Général - Prestations de Services</Text></View>
            <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>B.P : 7754 Douala Tél : (237) 243 043 918 / 696 975 548</Text></View>
            {/* <View style={styles.rightBottom}><Text>Site internet : https://solumat-sarl.com/</Text></View> */}
          </View>
        </View>

        <View style={styles.tableTile}><Text style={{ padding: 5 }}>Liste des commandes | {moment().format('MMMM Do YYYY')}</Text></View>
        <View style={styles.table}>
          <View style={styles.tableThFirst}><Text>produits</Text></View>
          <View style={styles.tableTh}><Text>Date</Text></View>
          <View style={styles.tableTh}><Text>Quantité</Text></View>
          <View style={styles.tableTh}><Text>Coût</Text></View>
          <View style={styles.tableTh}><Text>Etat</Text></View>
          <View style={styles.tableTh}><Text>client</Text></View>
          

          {orders.map(item => (
            <React.Fragment key={item.id}>
              <View style={styles.tableChild}>
                {item.order_products?.map(product => <Text key={product.id}>{getProductNameWithId(product.product_id || '1')?.name}</Text>)}
              </View>
              <View style={styles.tableChild}><Text>{formatDate(item.created_at || '')}</Text></View>
              <View style={styles.tableChild}><Text>{item.quantite}</Text></View>
              <View style={styles.tableChild}><Text>{formatCurrency(parseInt(item.cout?.toString() || '0',10),'XAF')}</Text></View>
              <View style={styles.tableChild}><Text>{item.etat}</Text></View>
              <View style={styles.tableChild}><Text>{item.customer?.firstname} {item.customer?.lastname}</Text></View>
            </React.Fragment>
          ))}
          
          
        </View>

        <View style={styles.signature}><Text style={{ textAlign:'right' }}>La Direction</Text></View>

      </Page>
    </Document>
  );
};

export default OrderPrint;
