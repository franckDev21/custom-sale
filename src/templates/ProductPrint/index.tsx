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
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30
  },
  tableThLast:{
    fontWeight: 'semibold',
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderRight: 1
  },
  tableThFirst:{
    fontWeight: 'semibold',
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  tableChild:{
    width: '14.12%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
  },
  tableChildRigth:{
    width: '14.12%',
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

type ProductPrintProps = {
  className ?:  string,
  products ?: Product[],
};

const API_STORAGE_URL = `${baseURL}/storage`;

const ProductPrint: FC<ProductPrintProps> = ({
  className='',
  products = [],
}) => {
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

        <View style={styles.tableTile}><Text style={{ padding: 5 }}>Liste des produits | {moment().format('MMMM Do YYYY')}</Text></View>
        <View style={styles.table}>
          <View style={styles.tableThFirst}><Text>Nom du produit</Text></View>
          <View style={styles.tableTh}><Text>Date</Text></View>
          <View style={styles.tableTh}><Text>Quantité</Text></View>
          <View style={styles.tableTh}><Text>En stock ?</Text></View>
          <View style={styles.tableTh}><Text>Prix unitaire</Text></View>
          <View style={styles.tableTh}><Text>Fournisseurs</Text></View>
          <View style={styles.tableThLast}><Text>Categorie</Text></View>
          

          {products.map(item => (
            <React.Fragment key={item.id}>
              <View style={styles.tableChild}>
                {item.image && <Image src={{ uri: `${API_STORAGE_URL}/${item.image}`, method: 'GET', headers: {}, body: '' }} />}
                <Text>{item.name}</Text>
              </View>
              <View style={styles.tableChild}><Text>{formatDate(item.created_at || '')}</Text></View>
              <View style={styles.tableChild}>
                <Text>
                {item.qte_en_stock} {item.type_approvisionnement}{(item.qte_en_stock || 0) > 1 && 's'} 
                {item.product_type?.name === 'VENDU_PAR_NOMBRE_PAR_CONTENEUR' && ` de ${item.nbre_par_carton} et ${item.unite_restante || 0} Unité${(item.unite_restante || 0) > 1 ? 's':''} restante`} 
                {item.product_type?.name === 'VENDU_PAR_LITRE' && ` de ${item.qte_en_litre} ${item.product_type.unite_de_mesure} et ${item.unite_restante || 0} Unité${(item.unite_restante || 0) > 1 ? 's':''} restante`} 
                {item.product_type?.name === 'VENDU_PAR_KG' && ` de ${item.poids} ${item.product_type.unite_de_mesure} et ${item.unite_restante || 0} Unité${(item.unite_restante || 0) > 1 ? 's':''} restante`} 
                </Text>
              </View>
              <View style={styles.tableChild}><Text>{item.is_stock ? 'Oui':'Non'}</Text></View>
              <View style={styles.tableChild}><Text>{formatCurrency(parseInt(item.prix_unitaire?.toString() || '0',10),'XAF')}</Text></View>
              <View style={styles.tableChild}><Text>{item.product_supplier?.name}</Text></View>
              <View style={styles.tableChildRigth}><Text>{item.category?.name}</Text></View>
            </React.Fragment>
          ))}
          
          
        </View>

        <View style={styles.signature}><Text style={{ textAlign:'right' }}>La Direction</Text></View>

      </Page>
    </Document>
  );
};

export default ProductPrint;
