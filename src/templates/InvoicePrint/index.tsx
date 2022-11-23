import React, { FC } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import Order from "../../Model/Order";
import { formatCurrency, formatDate, user } from "../../utils/function";

import DefaultImage from '../../assets/img/logo/logo3.png'
import Invoice from "../../Model/Invoice";
import { baseURL } from "../../utils/axios-custum";
import Product from "../../Model/Product";
import moment from "moment";
import HeaderInvoice from "../../molecules/HeaderInvoice";
import NewHeaderInvoice from "../../molecules/NewHeaderInvoice";

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
    width: '25%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30
  },
  tableThLast:{
    fontWeight: 'semibold',
    width: '25%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderRight: 1
  },
  tableThFirst:{
    fontWeight: 'semibold',
    width: '25%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  tableChild:{
    width: '25%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30,
  },
  tableChildRigth:{
    width: '25%',
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

type InvoicePrintProps = {
  className ?:  string,
  invoices ?: Invoice[],
  companyId ?: string
};


const InvoicePrint: FC<InvoicePrintProps> = ({
  className='',
  invoices = [],
  companyId
}) => {


  return (
    <Document>
      <Page wrap size="A4" style={styles.page}>

         {/* <HeaderInvoice /> */}
         <NewHeaderInvoice companyId={companyId ? companyId : user().company_id} />

        <View style={styles.tableTile}><Text style={{ padding: 5 }}>Liste des factures | {moment().format('MMMM Do YYYY')}</Text></View>
        
        <View style={styles.table}>
          <View style={styles.tableThFirst}><Text>Numéro</Text></View>
          <View style={styles.tableTh}><Text>Date</Text></View>
          <View style={styles.tableTh}><Text>commande</Text></View>
          <View style={styles.tableTh}><Text>client</Text></View>
          

          {invoices.map(item => (
            <React.Fragment key={item.id}>
              <View style={styles.tableChild}><Text>{`N' ${item.id}/${item.day}/${item.year}`}</Text></View>
              <View style={styles.tableChild}><Text>{formatDate(item.created_at || '')}</Text></View>
              <View style={styles.tableChild}><Text>{item.order?.quantite} Produit(s) commandé(s) par {item.customer?.firstname} {item.customer?.lastname}</Text></View>
              <View style={styles.tableChild}><Text>{item.customer?.firstname} {item.customer?.lastname}</Text></View>
            </React.Fragment>
          ))}
          
          
        </View>

        <View style={styles.signature}><Text style={{ textAlign:'right' }}>La Direction</Text></View>

      </Page>
    </Document>
  );
};

export default InvoicePrint;
