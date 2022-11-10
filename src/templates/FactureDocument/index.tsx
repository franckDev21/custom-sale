import React, { FC } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import Order from "../../Model/Order";
import OrderProduct from "../../Model/OrderProduct";
import { formatCurrency, pttc } from "../../utils/function";

import DefaultImage from '../../assets/img/default-product.png'
import Invoice from "../../Model/Invoice";
import { baseURL } from "../../utils/axios-custum";
// import HeaderInvoice from "../../molecules/HeaderInvoice";
import NewHeaderInvoice from "../../molecules/NewHeaderInvoice";
import { default as dayjs } from 'dayjs';
import 'dayjs/locale/fr' // import locale


dayjs.locale('fr') // use locale

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection:'column',
    fontSize: 11
  },
  header: {
    display: 'flex',
    justifyContent : 'space-between',
    flexDirection: 'row',
    width: '100%',
    // backgroundColor: 'green'
  },
  image : {
    width : 130,
    height : 130,
    backgroundColor: "#E4E4E4",
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
    width: '40%',
    display: 'flex',
    margin: '0 10px'
  },
  content : {
    width: '100%',
    // alignSelf: 'flex-end',
    // marginLeft: 'auto',
    // backgroundColor: 'pink'
  },
  date : {
    width: '100%'
  },
  customer : {
    width: '100%',
    // backgroundColor : 'red',
    minHeight: 50,
    border: 1,
    marginTop: 5,
    padding: 8
  },
  tableTile : {
    height: 3,
    backgroundColor: '#000',
    marginTop: 25,
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 10
  },
  tableTh:{
    fontWeight: 'bold',
    width: '25%',
    padding: 4,
    // borderLeft:1,
    // borderBottom: 1,
    // borderTop: 1,
    minHeight: 30,
    color: '#000'
  },
  tableChild:{
    width: '25%',
    padding: 4,
    // borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
    color: '#5f6063',
    borderColor: '#5f6063'
  },
  tableTotalLabel: {
    width: '75%',
    padding: 4,
    paddingRight: 8,
    minHeight: 30,
    borderBottom: 1,
    borderRight: 1,
    transform: 'translateX(1px)',
    color: '#5f6063',
    borderColor: '#5f6063'
  },
  tableTotal: {
    width: '25%',
    padding: 4,
    minHeight: 30,
    borderBottom: 1,
    borderColor: '#5f6063'
  },
  table : {
    display:'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
    padding: 10
  },
  signature : {
    paddingTop: 8,
    paddingRight: 30,
    width: '100%',
    minHeight: 20,
    marginTop: 70,
    display: 'flex',
    textDecoration: 'underline'
  }
});

type TypeDocument = {
  className ?:  string,
  order ?: Order,
  orderProducts ?: OrderProduct[],
  invoice ?: Invoice
};

// const API_STORAGE_URL = `${baseURL}/storage`;

const FactureDocument: FC<TypeDocument> = ({
  className='',
  order = {},
  orderProducts = [],
  invoice = {}
}) => {
  return (
    <Document>
      <Page wrap size="A4" style={styles.page}>

        <NewHeaderInvoice />

        <View style={styles.header}>
          <View style={styles.head}>
            <View style={styles.content}>
              <View style={styles.customer}>
                <Text style={{ fontSize: 16, fontWeight:'extrabold', marginBottom: 7 }}>Facture</Text>
                <Text style={{ marginBottom: 4 }}>N° : {order.invoice?.reference}</Text>
                <Text style={{ marginBottom: 4 }}>Date : {dayjs().format('DD/MM/YYYY')}</Text>
                <Text style={{ marginBottom: 4 }}>Tél : {order.customer?.tel}</Text>
                <Text style={{ marginBottom: 4 }}>Vendeur : {order.user?.firstname} {order.user?.lastname}</Text>
              </View>
            </View>
          </View>

          <View style={styles.head}>
            <View style={styles.content}>
              <Text style={styles.date}>Douala {dayjs().format('DD MMMM YYYY')}</Text>
              <View style={styles.customer}>
                <Text style={{ marginBottom: 3 }}>Nom : {order.customer?.firstname} {order.customer?.lastname}</Text>
                <Text style={{ marginBottom: 3 }}>Email : {order.customer?.email}</Text>
                <Text style={{ marginBottom: 3 }}>Tél : {order.customer?.tel}</Text>
                <Text style={{ marginBottom: 3 }}>Localisation : {order.customer?.address}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableTile}></View>
        <View style={styles.table}>
          <View style={styles.tableTh}><Text>Nom du produit</Text></View>
          <View style={styles.tableTh}><Text>Quantité</Text></View>
          <View style={styles.tableTh}><Text>Prix unitaire</Text></View>
          <View style={styles.tableTh}><Text>total</Text></View>

          {orderProducts.map(item => (
            <React.Fragment key={item.id}>
              <View style={styles.tableChild}><Text>{item.product?.name}</Text></View>
              <View style={styles.tableChild}>
                <Text>{item.qte} {item.type_de_vente}{(item.qte || 0) > 0 && 'S'}</Text>
              </View>
              <View style={styles.tableChild}>
                <Text>
                  {(item.prix_de_vente || '0').toString() !== (item.product?.prix_unitaire || '0').toString() ? <>
                    {formatCurrency((parseInt(item.prix_de_vente?.toString() || '0',10) || 0),'XAF').replace('FCFA','')}
                  </>:<>
                    {formatCurrency((parseInt(item.product?.prix_unitaire?.toString() || '0',10) || 0),'XAF').replace('FCFA','')}
                  </>}
                </Text>
              </View>
              <View style={styles.tableChild}>
                <Text>
                  {(item.prix_de_vente || '0').toString() !== (item.product?.prix_unitaire || '0').toString() ? <>
                    {formatCurrency((parseInt(item.prix_de_vente?.toString() || '0',10) || 0) * (parseInt(item.qte?.toString() || '0',10)||0),'XAF').replace('FCFA','')}
                  </>:<>
                    {formatCurrency((parseInt(item.product?.prix_unitaire?.toString() || '0',10) || 0) * (parseInt(item.qte?.toString() || '0',10)||0),'XAF').replace('FCFA','')}
                  </>}
                </Text>
              </View>
            </React.Fragment>
          ))}
          

          <View style={styles.tableTotalLabel}><Text style={{ textAlign:'right' }}>Total HT</Text></View>
          <View style={styles.tableTotal}><Text>{formatCurrency(parseInt(order.total_ht || '0',10) || 0,'XAF')}</Text></View>

          {order.invoice?.as_tva && <>
            <View style={styles.tableTotalLabel}><Text style={{ textAlign:'right' }}>Total TVA (19.5%)</Text></View>
            <View style={styles.tableTotal}><Text>{formatCurrency(pttc(parseInt(order.total_ht || '0',10)).totalTVA,'XAF')}</Text></View>
          </>}

          {order.invoice?.as_ir && <>
            <View style={styles.tableTotalLabel}><Text style={{ textAlign:'right' }}>Total IR (5.5%)</Text></View>
            <View style={styles.tableTotal}><Text>{formatCurrency(pttc(parseInt(order.total_ht || '0',10)).totalIR,'XAF')}</Text></View>
          </>}
          
          <View style={styles.tableTotalLabel}><Text style={{ textAlign:'right' }}>Total TTC</Text></View>
          <View style={styles.tableTotal}><Text>{formatCurrency(parseInt(order.cout || '0',10) || 0,'XAF')}</Text></View>
        </View>

        <View style={styles.signature}><Text style={{ textAlign:'right' }}>La Direction</Text></View>

      </Page>
    </Document>
  );
};

export default FactureDocument;
